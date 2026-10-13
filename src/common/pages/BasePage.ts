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
     * Confirmed live on NG (2026-10-07): the OneTrust cookie-consent widget's full-page dark
     * backdrop ('.onetrust-pc-dark-filter') can stay rendered and pointer-events-enabled even
     * after both its own banner and preference panel are hidden (display:none) — a stuck OneTrust
     * state, not anything this suite does. It then silently intercepts clicks anywhere on the page
     * ("subtree intercepts pointer events"), and re-confirmed live: it doesn't just appear once —
     * it can reappear between two clicks moments apart (e.g. opening a menu, then clicking inside
     * it), so a one-off check-and-hide before each action is a race against whenever it next
     * re-renders. `addLocatorHandler` is Playwright's purpose-built answer to exactly this: once
     * registered, the engine itself re-checks for the overlay and runs the handler every time it
     * would otherwise block an actionability wait, however many times that happens, with no
     * call-site-by-call-site guessing required. Registered once per page, in goto().
     */
    protected async registerOnetrustOverlayHandler() {
        await this.page.addLocatorHandler(
            this.page.locator('.onetrust-pc-dark-filter'),
            async (overlay) => {
                await overlay.evaluate((el) => { (el as HTMLElement).style.display = 'none'; });
            },
        );

        // The banner can also come back mid-test (new context, cookie not yet written, or a
        // navigation that re-runs the OneTrust script). Registering it as a locator handler means
        // Playwright dismisses it whenever it would block an action, instead of each call site
        // having to guess when it might reappear.
        await this.page.addLocatorHandler(
            this.page.locator('#onetrust-banner-sdk'),
            async (banner) => {
                await this.page
                    .locator('#onetrust-accept-btn-handler')
                    .or(this.page.getByRole('button', { name: /accept all cookies/i }))
                    .first()
                    .click({ timeout: 5000 })
                    .catch(() => { /* fall through to the hide below */ });
                // A locator handler MUST leave its locator non-visible or Playwright aborts the
                // action after a few runs — so if Accept did not take (re-render, animation), hide
                // the banner outright rather than letting the handler spin.
                await banner
                    .evaluate((el) => { (el as HTMLElement).style.display = 'none'; })
                    .catch(() => { /* already gone */ });
            },
        );
    }

    /**
     * The OneTrust consent banner itself ("Your cookie privacy" / "Accept All Cookies"), as opposed
     * to the stuck backdrop handled above. Confirmed live on NG (2026-10-12): it docks across the
     * bottom of the viewport and covers whatever sits there, and opening "Manage Cookie Preferences"
     * is what raises the '.onetrust-pc-dark-filter' that then intercepts clicks page-wide.
     *
     * Clicking Accept (rather than hiding it) is deliberate: accepting sets OneTrust's own consent
     * cookie, so the banner stays gone for the rest of the browser context instead of returning on
     * every navigation and reload. The id is OneTrust's standard one, with a text fallback in case
     * this tenant renames it. Best-effort throughout — a region that never shows the banner, or a
     * context where it was already accepted, must be a silent no-op.
     * Budget note (2026-10-13): this started at 8000ms and that was too expensive. goto() is
     * called repeatedly inside a single test — login T14-29 does four — so an 8s wait on every
     * navigation where no banner exists added ~30s to that test and pushed it from a steady
     * 62-68s to a 90s timeout in GH, ZA and ZM. The wait only needs to cover a banner that is
     * already on the page; anything that appears later is caught by the locator handler
     * registered above, which is the real safety net. Keep this short.
     */
    protected async acceptCookieConsentIfVisible(timeout: number = 1500) {
        const accept = this.page
            .locator('#onetrust-accept-btn-handler')
            .or(this.page.getByRole('button', { name: /accept all cookies/i }))
            .first();
        try {
            await accept.waitFor({ state: 'visible', timeout });
            await accept.click({ timeout: 5000 });
            await this.page
                .locator('#onetrust-banner-sdk')
                .waitFor({ state: 'hidden', timeout: 5000 })
                .catch(() => { /* accepted but animating out — the handler below covers the rest */ });
        } catch {
            // Not shown: already accepted, or this region doesn't serve OneTrust. Both are fine.
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
        // Confirmed live repeatedly across this codebase (LoginArgs, OddSelectionAbove,
        // BetSaverPage.preparePage, NewHomePage) as a recurring, independently-rediscovered fix:
        // `viewport: null` + `--start-maximized` doesn't reliably yield a desktop-width window in
        // this environment — it can render the mobile-breakpoint layout instead (a different login
        // panel, a bottom tab bar, etc.), which then makes otherwise-correct locators fail to
        // become visible. Forcing it once here, at the one shared navigation entrypoint, instead
        // of patching each call site that happens to notice.
        await this.page.setViewportSize({ width: 1920, height: 1080 });
        await this.registerOnetrustOverlayHandler();

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

        // Before the promo popup: the consent banner is the outermost layer, and dismissing it
        // first stops it covering the promo popup close button at the bottom of the screen.
        await this.acceptCookieConsentIfVisible();

        // The promotion popup shows once, shortly after landing — wait for it and close it.
        await this.closePromotionPopupIfVisible();
    }

    async Login(user: { mobile: string; password: string } = userData.user4) {
        // Confirmed live on GH: a promotional toast (Casino Fixtures campaign) mounts ~3-4s after
        // any page load AND recurs — goto()'s own dismiss can miss a re-appearance that lands
        // exactly while this method is filling the form, which then silently fails to submit
        // (the popup intercepts the field/Enter interaction) and Deposit never shows afterward.
        await this.closePromotionPopupIfVisible(2000);

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
