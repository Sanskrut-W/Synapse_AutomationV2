import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';
import { activeRegion } from '../config/oddsApiUrl';

dotenv.config();

/**
 * AI client for self-healing locators — asks an LLM to suggest a replacement Playwright locator
 * when both the primary locator and the heuristic fallback fail.
 *
 * Security note: the API key is read ONLY from environment variables (via a local, gitignored
 * .env, or real env vars in CI), with no hardcoded fallback default. The old Betway-Automation
 * repo had a hardcoded OpenRouter key committed in src/global/utils/locators/healing.ts — that is
 * an anti-pattern this class must never repeat. If no key is configured, this client warns and
 * returns null so SafeActions lets the original error surface, instead of silently calling out
 * with a wrong/missing key.
 *
 * Cost controls (the configured Gemini key runs on a small, fixed credit budget — see below):
 *  - Persistent disk cache, keyed by region+element: once a locator has been AI-healed, every
 *    later run (this run's other workers, and every future run) reuses the cached suggestion for
 *    free instead of re-calling the API for the same drift. Delete `.selfheal-cache.json` at the
 *    repo root (or set AI_HEAL_IGNORE_CACHE=1) to force fresh suggestions.
 *  - Hard per-process call cap (AI_HEAL_MAX_CALLS, default 25) — a circuit breaker so a mass
 *    breakage (e.g. a full page redesign) degrades to "self-healing stops helping" instead of
 *    silently burning through the budget.
 *  - Page HTML is stripped of <script>/<style>/<svg>/comments and truncated (AI_HEAL_HTML_CHARS,
 *    default 20000 chars) before being sent — that's the bulk of the token cost per call.
 *  - Cheapest current Gemini tier (gemini-2.5-flash-lite) by default, low temperature, and a small
 *    output-token cap, since the only thing we need back is one locator string.
 */
export class AIClient {
    private apiKey: string | undefined;
    private provider: 'openai' | 'gemini' = 'openai';
    private geminiModel: string;

    private static callCount = 0;
    private static readonly maxCalls = Number(process.env.AI_HEAL_MAX_CALLS || 25);
    private static readonly htmlCharCap = Number(process.env.AI_HEAL_HTML_CHARS || 20000);
    private static readonly cacheFile = path.join(process.cwd(), '.selfheal-cache.json');

    constructor() {
        this.apiKey = process.env.OPENAI_API_KEY || process.env.GEMINI_API_KEY;
        if (!process.env.OPENAI_API_KEY && process.env.GEMINI_API_KEY) {
            this.provider = 'gemini';
        }
        // gemini-2.5-flash-lite was sunset for new keys as of this session (confirmed live — the API
        // itself returns a 404 pointing at the replacement); gemini-3.5-flash-lite is the current
        // cheapest tier that still works with this key. Override via GEMINI_MODEL if that changes again.
        this.geminiModel = process.env.GEMINI_MODEL || 'gemini-3.5-flash-lite';
    }

    /**
     * Asks the AI to suggest a new locator for a failed element.
     * @param elementDescription The locator key (e.g. "loginButton") — used purely as context for the model.
     * @param originalLocator String form of the locator that failed.
     * @param pageSource A snippet of the current page HTML.
     */
    async getSuggestedLocator(elementDescription: string, originalLocator: string, pageSource: string): Promise<string | null> {
        const cacheKey = `${activeRegion()}::${elementDescription}`;

        if (!process.env.AI_HEAL_IGNORE_CACHE) {
            const cached = AIClient.readCache()[cacheKey];
            if (cached) {
                console.log(`[AIClient] Cache hit for '${cacheKey}' — reusing prior suggestion, no API call.`);
                return cached;
            }
        }

        if (!this.apiKey) {
            console.warn('[AIClient] No API key found (OPENAI_API_KEY or GEMINI_API_KEY). Skipping AI healing.');
            return null;
        }

        if (AIClient.callCount >= AIClient.maxCalls) {
            console.warn(`[AIClient] Per-run AI call cap (${AIClient.maxCalls}) reached. Skipping AI healing for '${cacheKey}' to protect API budget.`);
            return null;
        }
        AIClient.callCount++;

        const compacted = this.compactHtml(pageSource);
        const truncatedSource = compacted.length > AIClient.htmlCharCap
            ? compacted.substring(0, AIClient.htmlCharCap) + '...'
            : compacted;

        const prompt = `
        You are a Playwright automation expert.
        A test failed because a locator could not be found.

        Element Description: "${elementDescription}"
        Original (Failed) Locator: "${originalLocator}"

        Here is a snippet of the current page HTML:
        \`\`\`html
        ${truncatedSource}
        \`\`\`

        Please analyze the HTML and suggest a ROBUST Playwright locator (CSS or XPath or Role)
        that identifies this element.

        Return ONLY the locator string. Do not return markdown formatting, explanations, or code blocks.
        Just the string.
        `;

        try {
            const suggestion = this.provider === 'openai' ? await this.callOpenAI(prompt) : await this.callGemini(prompt);
            if (suggestion) {
                AIClient.writeCacheEntry(cacheKey, suggestion);
                console.log(`[AIClient] AI healed '${cacheKey}' -> ${suggestion}. Cached for future runs — consider adding this as a permanent region override in src/regions/${activeRegion()}/locators.ts.`);
            }
            return suggestion;
        } catch (error) {
            console.error('[AIClient] Error calling AI provider:', error);
            return null;
        }
    }

    private async callOpenAI(prompt: string): Promise<string | null> {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.apiKey}`,
            },
            body: JSON.stringify({
                model: 'gpt-4o-mini',
                messages: [{ role: 'user', content: prompt }],
                temperature: 0,
                max_tokens: 60,
            }),
        });

        if (!response.ok) {
            console.error(`[AIClient] OpenAI API failed: ${response.status} ${response.statusText}`);
            return null;
        }

        const data = await response.json();
        const content = data.choices?.[0]?.message?.content?.trim();
        return this.cleanLocator(content);
    }

    private async callGemini(prompt: string): Promise<string | null> {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${this.geminiModel}:generateContent?key=${this.apiKey}`;
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }],
                generationConfig: { temperature: 0, maxOutputTokens: 60 },
            }),
        });

        if (!response.ok) {
            console.error(`[AIClient] Gemini API failed: ${response.status} ${response.statusText}`);
            return null;
        }

        const data = await response.json();
        const content = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
        return this.cleanLocator(content);
    }

    private cleanLocator(locator: string | undefined): string | null {
        if (!locator) return null;
        let cleaned = locator.replace(/`/g, '').replace(/^playwright\s*/i, '').trim();

        // Despite the prompt asking for a bare selector, the model sometimes returns a full
        // Playwright call instead (confirmed live: `page.locator('#real-login-btn')`). Unwrap it —
        // callers do `this.page.locator(aiLocatorString)` themselves, so a wrapped string would
        // otherwise fail to parse as CSS and silently waste an otherwise-correct suggestion.
        const wrapped = cleaned.match(/^(?:page\.)?locator\(\s*(['"`])(.*)\1\s*\)$/s);
        if (wrapped) {
            cleaned = wrapped[2];
        } else if (/^(['"`]).*\1$/.test(cleaned)) {
            cleaned = cleaned.slice(1, -1);
        }

        return cleaned.trim() || null;
    }

    /** Strips the token-heavy, locator-irrelevant parts of the DOM before it's sent to the model. */
    private compactHtml(html: string): string {
        return html
            .replace(/<script[\s\S]*?<\/script>/gi, '')
            .replace(/<style[\s\S]*?<\/style>/gi, '')
            .replace(/<svg[\s\S]*?<\/svg>/gi, '<svg></svg>')
            .replace(/<!--[\s\S]*?-->/g, '')
            .replace(/\s{2,}/g, ' ');
    }

    private static readCache(): Record<string, string> {
        try {
            return JSON.parse(fs.readFileSync(AIClient.cacheFile, 'utf-8'));
        } catch {
            return {};
        }
    }

    /** Read-merge-write — fine-grained locking isn't worth it here: a lost concurrent write in a
     *  parallel run just costs one extra (still cheap) API call later, never corruption or a crash. */
    private static writeCacheEntry(key: string, value: string) {
        const cache = AIClient.readCache();
        cache[key] = value;
        try {
            fs.writeFileSync(AIClient.cacheFile, JSON.stringify(cache, null, 2));
        } catch (e) {
            console.warn('[AIClient] Failed to persist self-heal cache:', e);
        }
    }
}
