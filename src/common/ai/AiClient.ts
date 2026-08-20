/**
 * AI client for self-healing locators — asks an LLM to suggest a replacement Playwright locator
 * when both the primary locator and the heuristic fallback fail.
 *
 * Security note: the API key is read ONLY from environment variables, with no hardcoded fallback
 * default. The old Betway-Automation repo had a hardcoded OpenRouter key committed in
 * src/global/utils/locators/healing.ts — that is an anti-pattern this class must never repeat.
 * If no key is configured, this client warns and returns null so SafeActions lets the original
 * error surface, instead of silently calling out with a wrong/missing key.
 */
export class AIClient {
    private apiKey: string | undefined;
    private provider: 'openai' | 'gemini' = 'openai';

    constructor() {
        this.apiKey = process.env.OPENAI_API_KEY || process.env.GEMINI_API_KEY;
        if (!process.env.OPENAI_API_KEY && process.env.GEMINI_API_KEY) {
            this.provider = 'gemini';
        }
    }

    /**
     * Asks the AI to suggest a new locator for a failed element.
     * @param elementDescription The locator key (e.g. "loginButton") — used purely as context for the model.
     * @param originalLocator String form of the locator that failed.
     * @param pageSource A snippet of the current page HTML.
     */
    async getSuggestedLocator(elementDescription: string, originalLocator: string, pageSource: string): Promise<string | null> {
        if (!this.apiKey) {
            console.warn('[AIClient] No API key found (OPENAI_API_KEY or GEMINI_API_KEY). Skipping AI healing.');
            return null;
        }

        const truncatedSource = pageSource.length > 50000 ? pageSource.substring(0, 50000) + '...' : pageSource;

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
            return this.provider === 'openai' ? await this.callOpenAI(prompt) : await this.callGemini(prompt);
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
                model: 'gpt-4o',
                messages: [{ role: 'user', content: prompt }],
                temperature: 0,
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
        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${this.apiKey}`;
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }),
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
        return locator.replace(/`/g, '').replace(/^playwright\s*/i, '').trim();
    }
}
