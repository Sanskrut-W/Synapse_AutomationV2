import { Page, Locator } from '@playwright/test';
import { highlightElementBorder } from '../flows/HighlightElements';
import { AIClient } from '../ai/AiClient';

/**
 * Self-healing actions (click, fill, highlight) with a 3-level fallback:
 *   1. Primary Locator — the `loc` map entry declared in the Page Object's constructor.
 *   2. Heuristic Locator — a hand-seeded fallback generated from the locator's key (below).
 *   3. AI Healer — a last-resort LLM call, given the failed locator + a page-HTML snippet.
 *
 * Every Page Object action method routes through this class (`safeActions.safeClick(...)`)
 * instead of calling `.click()`/`.fill()` on a Locator directly — that's what makes the fallback
 * chain apply uniformly across the whole framework rather than needing to be re-added per call site.
 */
export class SafeActions {
    private aiClient: AIClient;
    private defaultTimeout: number;

    constructor(public page: Page) {
        this.aiClient = new AIClient();
        this.defaultTimeout = 60000;
    }

    async safeClick(key: string, primaryLocator: Locator, options?: { timeout?: number }) {
        try {
            await primaryLocator.click({ timeout: options?.timeout || this.defaultTimeout });
        } catch (e1) {
            console.warn(`[Self-Heal L2] Primary locator for '${key}' failed. Trying heuristic...`);
            const heuristicLocator = this.generateHeuristic(key);

            if (heuristicLocator) {
                try {
                    await heuristicLocator.click({ timeout: options?.timeout || this.defaultTimeout });
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
                    await this.page.locator(aiLocatorString).click({ timeout: options?.timeout || this.defaultTimeout });
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
    }

    async safeFill(key: string, primaryLocator: Locator, value: string) {
        try {
            await primaryLocator.fill(value, { timeout: this.defaultTimeout });
        } catch (e1) {
            const heuristic = this.generateHeuristic(key);
            if (heuristic) {
                try {
                    await heuristic.fill(value, { timeout: this.defaultTimeout });
                    return;
                } catch (e2) {
                    console.warn(`[Self-Heal L3] Heuristic fill for '${key}' failed. AI fill-healing not implemented yet.`);
                    throw e2;
                }
            }
            throw e1;
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
