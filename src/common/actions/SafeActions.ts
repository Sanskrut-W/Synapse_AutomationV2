import { Page, Locator } from '@playwright/test';
import { highlightElementBorder } from '../flows/HighlightElements';
import { AIClient } from '../ai/AiClient';

/**
 * Self-healing actions (click, fill, highlight) with a 3-level fallback:
 *   1. Primary Locator — the `loc` map entry declared in the Page Object's constructor. Given up
 *      to 3 attempts (the original try + 2 retries, with a short pause between) before anything
 *      else kicks in — a brief transient state (a toast still closing, a spinner, a slow re-render)
 *      resolves on its own most of the time and shouldn't cost an AI call.
 *   2. Heuristic Locator — a hand-seeded fallback generated from the locator's key (below).
 *   3. AI Healer — a last-resort LLM call, given the failed locator + a page-HTML snippet.
 *
 * Self-healing (tiers 2 and 3) is skipped entirely — even after all 3 primary attempts fail — when
 * the failure looks network/navigation-related (site unreachable, DNS failure, connection reset,
 * the page itself closed/crashed). No locator, heuristic or AI-suggested, fixes "the site didn't
 * load" — attempting to heal that just burns time and AI budget for a failure class self-healing
 * was never meant to address. That case surfaces the original error immediately instead.
 *
 * Every Page Object action method routes through this class (`safeActions.safeClick(...)`)
 * instead of calling `.click()`/`.fill()` on a Locator directly — that's what makes the fallback
 * chain apply uniformly across the whole framework rather than needing to be re-added per call site.
 */
export class SafeActions {
    private aiClient: AIClient;
    private defaultTimeout: number;

    /** Original attempt + 2 retries = 3 total tries on the primary locator before self-heal is even considered. */
    private static readonly PRIMARY_ATTEMPTS = 3;
    private static readonly RETRY_PAUSE_MS = 1000;

    constructor(public page: Page) {
        this.aiClient = new AIClient();
        this.defaultTimeout = 60000;
    }

    async safeClick(key: string, primaryLocator: Locator, options?: { timeout?: number }) {
        const totalTimeout = options?.timeout || this.defaultTimeout;
        const outcome = await this.retryPrimary(key, (perAttemptTimeout) => primaryLocator.click({ timeout: perAttemptTimeout }), totalTimeout);
        if (outcome.ok) return;
        const e1 = outcome.error;

        if (this.skipHealing(key, e1)) throw e1;

        console.warn(`[Self-Heal L2] Primary locator for '${key}' failed after ${SafeActions.PRIMARY_ATTEMPTS} attempts. Trying heuristic...`);
        const heuristicLocator = this.generateHeuristic(key);

        if (heuristicLocator) {
            try {
                await heuristicLocator.click({ timeout: totalTimeout });
                console.log(`[Self-Heal L2] SUCCESS: heuristic click worked for '${key}'.`);
                return;
            } catch (e2) {
                console.warn(`[Self-Heal L3] Heuristic for '${key}' also failed. Calling AI...`);
            }
        } else {
            console.warn(`[Self-Heal L3] No heuristic for '${key}'. Calling AI directly...`);
        }

        const pageContent = await this.page.content();
        const aiLocatorString = await this.aiClient.getSuggestedLocator(key, primaryLocator.toString(), pageContent);

        if (aiLocatorString) {
            try {
                console.log(`[Self-Heal L3] AI suggested locator: ${aiLocatorString}`);
                await this.page.locator(aiLocatorString).click({ timeout: totalTimeout });
                console.log(`[Self-Heal L3] SUCCESS: AI-suggested locator worked for '${key}'.`);
            } catch (e3) {
                console.error(`[Self-Heal L3] FAILED: AI-suggested locator also failed for '${key}'.`);
                throw e3;
            }
        } else {
            console.error(`[Self-Heal L3] FAILED: AI returned no suggestion for '${key}'.`);
            throw e1; // Re-throw the *original* L1 error — clearest signal of what actually broke.
        }
    }

    async safeFill(key: string, primaryLocator: Locator, value: string, options?: { timeout?: number }) {
        const totalTimeout = options?.timeout || this.defaultTimeout;
        const outcome = await this.retryPrimary(key, (perAttemptTimeout) => primaryLocator.fill(value, { timeout: perAttemptTimeout }), totalTimeout);
        if (outcome.ok) return;
        const e1 = outcome.error;

        if (this.skipHealing(key, e1)) throw e1;

        console.warn(`[Self-Heal L2] Primary locator for '${key}' failed to fill after ${SafeActions.PRIMARY_ATTEMPTS} attempts. Trying heuristic...`);
        const heuristic = this.generateHeuristic(key);

        if (heuristic) {
            try {
                await heuristic.fill(value, { timeout: totalTimeout });
                console.log(`[Self-Heal L2] SUCCESS: heuristic fill worked for '${key}'.`);
                return;
            } catch (e2) {
                console.warn(`[Self-Heal L3] Heuristic fill for '${key}' also failed. Calling AI...`);
            }
        } else {
            console.warn(`[Self-Heal L3] No heuristic for '${key}'. Calling AI directly...`);
        }

        const pageContent = await this.page.content();
        const aiLocatorString = await this.aiClient.getSuggestedLocator(key, primaryLocator.toString(), pageContent);

        if (aiLocatorString) {
            try {
                console.log(`[Self-Heal L3] AI suggested locator: ${aiLocatorString}`);
                await this.page.locator(aiLocatorString).fill(value, { timeout: totalTimeout });
                console.log(`[Self-Heal L3] SUCCESS: AI-suggested locator worked for '${key}'.`);
            } catch (e3) {
                console.error(`[Self-Heal L3] FAILED: AI-suggested locator also failed for '${key}'.`);
                throw e3;
            }
        } else {
            console.error(`[Self-Heal L3] FAILED: AI returned no suggestion for '${key}'.`);
            throw e1; // Re-throw the *original* L1 error — clearest signal of what actually broke.
        }
    }

    /** A self-healing highlight — never throws, since it's only used for visual/screenshot evidence. */
    async safeHighlight(key: string, primary: Locator) {
        try {
            await primary.waitFor({ state: 'attached', timeout: 2000 });
            await highlightElementBorder(primary);
        } catch {
            const heuristic = this.generateHeuristic(key);
            if (heuristic) {
                try {
                    await heuristic.waitFor({ state: 'attached', timeout: 2000 });
                    await highlightElementBorder(heuristic);
                } catch { /* nothing to highlight, ignore */ }
            }
        }
    }

    /**
     * Runs `action` against the primary locator up to PRIMARY_ATTEMPTS times, splitting the caller's
     * total timeout budget evenly across attempts (rather than giving each retry the full budget —
     * that would make a genuinely-broken locator take PRIMARY_ATTEMPTS× as long to fail as before,
     * for zero extra signal, since Playwright already polls continuously within a single attempt's
     * timeout). A short pause between attempts gives transient page state a moment to settle.
     */
    private async retryPrimary<T>(
        key: string,
        action: (perAttemptTimeout: number) => Promise<T>,
        totalTimeout: number
    ): Promise<{ ok: true } | { ok: false; error: any }> {
        const perAttemptTimeout = Math.max(1000, Math.floor(totalTimeout / SafeActions.PRIMARY_ATTEMPTS));
        let lastError: any;

        for (let attempt = 1; attempt <= SafeActions.PRIMARY_ATTEMPTS; attempt++) {
            try {
                await action(perAttemptTimeout);
                return { ok: true };
            } catch (e) {
                lastError = e;
                if (attempt < SafeActions.PRIMARY_ATTEMPTS) {
                    console.warn(`[Self-Heal] '${key}' attempt ${attempt}/${SafeActions.PRIMARY_ATTEMPTS} failed — retrying before considering self-heal.`);
                    await this.page.waitForTimeout(SafeActions.RETRY_PAUSE_MS).catch(() => { });
                }
            }
        }
        return { ok: false, error: lastError };
    }

    /**
     * Decides whether to skip heuristic/AI healing entirely after the primary locator has
     * exhausted all its retries. True for anything that isn't really "the locator is wrong":
     * a dead/closed page, or a Chromium network error (net::ERR_*, DNS failure, connection
     * refused/reset, a stalled navigation) — self-healing can't fix an unreachable site, and
     * trying only delays the real failure and, for the AI tier, spends money for nothing.
     */
    private skipHealing(key: string, error: any): boolean {
        if (this.page.isClosed()) {
            console.error(`[Self-Heal] '${key}' failed and the page is closed/crashed — skipping self-heal.`);
            return true;
        }
        const message = String(error?.message ?? error ?? '');
        const isNetworkFailure = /net::ERR_|ERR_CONNECTION|ERR_NAME_NOT_RESOLVED|ERR_INTERNET_DISCONNECTED|ERR_SSL_PROTOCOL|ERR_TIMED_OUT|ERR_EMPTY_RESPONSE|ERR_ADDRESS_UNREACHABLE|NS_ERROR_|page\.goto:/i.test(message);
        if (isNetworkFailure) {
            console.error(`[Self-Heal] '${key}' failed due to a network/navigation issue (site unreachable), not a locator problem — skipping self-heal.`);
        }
        return isNetworkFailure;
    }

    /**
     * Level-2 heuristic locators, seeded from this session's confirmed real Betway DOM findings.
     * Grow this dictionary over time as new keys prove worth a hand-written fallback.
     */
    private generateHeuristic(key: string): Locator | null {
        switch (key) {
            case 'hamburgerMenu':
                return this.page.locator('#header-hamburger-btn');
            case 'loginButton':
                return this.page.getByRole('button', { name: 'Login' }).first();
            case 'signUpButton':
                return this.page.locator('#sign-up-btn');
            case 'mobileInput':
                return this.page.locator('#header-username');
            case 'passwordInput':
                return this.page.locator('#header-password');
            case 'accountsButton':
                return this.page.locator('img[alt="Profile picture"], feeds-avatar-image.profile-avatar');
            case 'depositButton':
                return this.page.getByRole('button', { name: 'Deposit' }).first();
            case 'hamburgerEyeButton':
                return this.page.locator('div.accordion-summary-header div.mr-2 svg');
            case 'howTo':
                return this.page.locator('div.mt-8.rounded-lg a[href="/how-to-bet"]');
            case 'betslipButton':
                return this.page.getByText(/Betslip\s*\d+/).first();
            default:
                return null;
        }
    }
}
