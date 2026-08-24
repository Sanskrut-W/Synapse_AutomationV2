import { Page, Locator } from '@playwright/test';
import { LocatorMap } from '../locators/sel';
import { overridesForGroup } from '../locators/overrides';
import { SafeActions } from '../actions/SafeActions';
import { loadRegionData } from '../config/regionData';

const userData = loadRegionData('json-data/userData.json');

/**
 * BasePage — foundation for every Page Object.
 *
 * Architecture contract:
 *  - Every selector lives in exactly ONE place: a Page Object's `loc` map, declared with the
 *    `sel` builders (css/role/text/…) and resolved via `this.build('<group>', {...})`.
 *  - A region that differs supplies a partial override map in regions/<R>/locators.ts; `build()`
 *    merges it automatically (region key wins over the base definition).
 *  - Every action (click/fill) routes through `safeActions`, which gives it a 3-tier self-heal
 *    fallback (primary locator → heuristic → AI) instead of failing outright on a stale selector.
 *
 * Also owns the flows that are identical site-wide:
 *  - goto(path)  : baseURL-relative navigation + promotion-popup dismissal, with retry.
 *  - Login(user) : header login form + promotion-popup dismissal.
 *
 * The promotion popup ("Bet Now" toast with #modal-close-btn) appears ONCE, shortly after
 * landing (and can reappear right after login). It is closed only at those two points — it must
 * NOT be auto-closed later, because other modals in the test flow (booking code, share, etc.)
 * reuse the same #modal-close-btn and are asserted/used by the tests themselves.
 */
export class BasePage {
    page: Page;
    protected readonly safeActions: SafeActions;
    protected readonly baseLoginLocators: {
        mobileNumber: Locator;
        password: Locator;
    };

    // Declared here (not readonly) so every subclass — whether chained through HomePage or flat
    // off BasePage — can do `this.loc = { ...this.loc, ...this.build(group, {...}) }` uniformly.
    // readonly would block reassignment from any constructor but the declaring class's own.
    loc: Record<string, Locator> = {};

    constructor(page: Page, safeActions: SafeActions) {
        this.page = page;
        this.safeActions = safeActions;
        this.baseLoginLocators = {
            mobileNumber: page.getByRole('textbox', { name: 'Mobile Number' }).first(),
            password: page.getByRole('textbox', { name: 'Enter Password' }).first(),
        };
    }

    /**
     * Resolve a Page Object's selector map into live Locators, applying the active region's
     * overrides for this group (region key wins over the base definition).
     */
    protected build(group: string, defs: LocatorMap): Record<string, Locator> {
        const merged: LocatorMap = { ...defs, ...overridesForGroup(group) };
        const out: Record<string, Locator> = {};
        for (const key of Object.keys(merged)) out[key] = merged[key](this.page);
        return out;
    }

    /**
     * Wait for the promotion popup to appear and close it. No-op if it does not show within the
     * timeout — best-effort dismiss, not something self-healing applies to.
     */
    protected async closePromotionPopupIfVisible(timeout: number = 10000) {
        const closeBtn = this.page.locator('#modal-close-btn').filter({ visible: true }).first();
        try {
            await closeBtn.waitFor({ state: 'visible', timeout });
            await closeBtn.click({ timeout: 3000 });
        } catch {
            // Popup did not appear -> ignore
        }
    }

    /**
     * A separate "Informative" promotional interstitial (e.g. "New Casino Experience") can
     * probabilistically layer on top of the Sign Up popup right after it opens. It must be scoped
     * to its own "Informative" header bar before closing: that popup's own close button reuses the
     * exact same #modal-close-btn id, so an unscoped close can close the wrong modal (confirmed
     * live — closing the first #modal-close-btn match when the interstitial isn't present closes
     * the entire Sign Up popup instead of doing nothing).
     */
    protected async closeInformativeInterstitialIfVisible(timeout: number = 5000) {
        const badge = this.page.getByText('Informative', { exact: true });
        try {
            await badge.waitFor({ state: 'visible', timeout });
            const header = badge.locator('xpath=ancestor::div[contains(@class,"sticky") and contains(@class,"z-20")][1]');
            await header.locator('#modal-close-btn').click({ timeout: 3000 });
        } catch {
            // Interstitial did not appear -> ignore
        }
    }

    async goto(path: string = '/sport/soccer') {
        let lastError: Error | undefined;
        for (let attempt = 1; attempt <= 3; attempt++) {
            try {
                await this.page.goto(path, { waitUntil: 'domcontentloaded' });
                lastError = undefined;
                break;
            } catch (error) {
                lastError = error as Error;
                if (attempt < 3) await new Promise((resolve) => setTimeout(resolve, 2000 * attempt));
            }
        }
        if (lastError) throw lastError;

        // The promotion popup shows once, shortly after landing — wait for it and close it.
        await this.closePromotionPopupIfVisible();
    }

    async Login(user: { mobile: string; password: string } = userData.user4) {
        // Most regions show the Mobile Number field inline in the header at all times. Some
        // (confirmed live: MW) instead show only a "Login" button, and the inline fields don't
        // render until it's clicked. Detect that case generically rather than branching on region,
        // so this keeps working if other regions turn out to behave the same way.
        try {
            await this.baseLoginLocators.mobileNumber.waitFor({ state: 'visible', timeout: 3000 });
        } catch {
            const loginButton = this.page.getByRole('button', { name: 'Login', exact: true }).first();
            await loginButton.click({ timeout: 10000 }).catch(() => { /* no such button either — let the fill below surface the real error */ });
            await this.baseLoginLocators.mobileNumber.waitFor({ state: 'visible', timeout: 10000 }).catch(() => { });
        }
        await this.safeActions.safeFill('baseLoginMobileNumber', this.baseLoginLocators.mobileNumber, user.mobile);
        await this.safeActions.safeFill('baseLoginPassword', this.baseLoginLocators.password, user.password);
        await this.page.keyboard.press('Enter');

        // The popup can also show right after logging in.
        await this.closePromotionPopupIfVisible(9000);

        await this.page.waitForLoadState('domcontentloaded');
    }

    /** Alias — some specs call the lowercase variant. */
    async login(user?: { mobile: string; password: string }) {
        await this.Login(user);
    }
}
