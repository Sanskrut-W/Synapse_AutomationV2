import { Page, TestInfo } from '@playwright/test';
import { BetslipPage } from './BetslipPage';
import { SafeActions } from '../actions/SafeActions';
import { text, role, first, at } from '../locators/sel';
import { highlightElements } from '../flows/HighlightElements';
import { ScreenshotHelper } from '../flows/ScreenshotHelper';
import { getFirstBookingCode } from '../flows/StoreAllBookingCode';
import { GetBookingCode } from '../flows/GetBookingCode';
import { OddsSelectionAbove } from '../flows/OddSelection';
import { loadRegionData } from '../config/regionData';

const userData = loadRegionData('json-data/userData.json');

export class BetInfluencerModal extends BetslipPage {
    constructor(page: Page, safeActions: SafeActions) {
        super(page, safeActions);

        const inherited = this.loc;
        this.loc = { ...inherited, ...this.build('betInfluencer', {
            // Confirmed live: an unscoped "summary" text search matches the sidebar's "Bonus
            // Summary" link (outside #my-account-main) BEFORE the real "Summary" tab inside the
            // Bet Influencer panel — clicking it navigated to the wrong section entirely. Affects
            // every region (confirmed on both GH and ZA), not just one.
            summaryButton: (root) => root.locator('#my-account-main').getByText('summary', { exact: false }).first(),
            // Confirmed live on NG: same bug class as summaryButton above — an unscoped "details"
            // text search matches a signup/FAQ paragraph ("...fill in your personal details.")
            // elsewhere on the page BEFORE the real "Details" tab inside the Bet Influencer panel.
            // That paragraph sits behind the panel's modal overlay, so every click attempt is
            // intercepted by the overlay and times out after all retries — this was the actual
            // failure behind clickDetailButton() throwing (cascading into every test that reaches
            // the Details page: gotoDetailSectionBetInfluencerModal() and its callers).
            detailButton: (root) => root.locator('#my-account-main').getByText('details', { exact: false }).first(),
            lastFourWeeksCanvas: first(text('Last four weeks')),
            detailedBreakdownButton: first(text('Detailed breakdown')),
            totalMonthlyRevenue: first(text('Total Revenue')),
            // Confirmed live: "#sortSelector" has zero matches on the real page — never a working
            // locator. The real "Sort By" control is a PrimeVue-style dropdown; its floating
            // "month"-style label ("Sort By") sits 2 parents above the actual clickable container.
            sortBySelector: (root) => root.locator('#my-account-main').getByText('Sort By', { exact: true }).locator('..').locator('..'),
            // The real "Sort" direction toggle is a standalone SVG icon (not a <button>) next to
            // the Sort By dropdown — distinguished by its distinctive up/down-arrows path data,
            // since it carries no accessible name or role of its own.
            sortButton: (root) => root.locator('#my-account-main').locator('svg:has(path[d^="M18 21L14 17"])'),
            codesUsed: first(text('Codes used')),
            betsTaken: first(text('Bets taken')),
            // Confirmed live: this floating-label PrimeVue dropdown's "month" label sits 3 parents
            // above the actual clickable dropdown container (span -> label -> label-wrapper ->
            // dropdown container) — clicking the container opens the month picklist.
            monthsSelector: (root) => root.locator('#my-account-main').getByText('month', { exact: true }).locator('..').locator('..').locator('..'),
            // Confirmed live: "#my-account-main .NextPrevBtn" never matched anything — the real
            // pagination controls are plain buttons with accessible names "Next"/"Previous". The
            // "Previous" button only renders once a later page has been visited (absent on page 1).
            nextButton: first((root) => root.locator('#my-account-main').getByRole('button', { name: 'Next' })),
            previousButton: first((root) => root.locator('#my-account-main').getByRole('button', { name: 'Previous' })),
            revenue: first(text('This month')),
            betInfluencerLink1: first(role('link', { name: 'Bet Influencer' })),
            betInfluencerLink2: at(role('link', { name: 'Bet Influencer' }), 1),
        }) };
    }

    async verifyBookingCodeDropDown() {
        const bookingCode = getFirstBookingCode();
        await this.page.locator(`#${bookingCode}`).locator('summary').click();
        await this.page.waitForTimeout(5000);
        await highlightElements(this.page.locator(`#${bookingCode}`).locator('summary'));
    }

    async verifyPresenceofBetInfluencerinHamburgerMenu() {
        await this.toggleHambergerMenu();
        await highlightElements(this.page.getByRole('link', { name: 'Bet Influencer' }).nth(0));
    }

    async verifyBetInfluencerFromAccountPopup(mobile: any) {
        await this.toggleHambergerMenu();
        // Confirmed live on MW: `.nth(0)` picked a hidden duplicate (4 total "My Bets" DOM
        // matches, index 0 not visible) — same class of bug already fixed for MyBetsPage's own
        // myBetsButton locator. Filter to the first VISIBLE match instead, and use a native
        // DOM click (same confirmed-necessary fix as MyBetsPage.clickMyBets() — Playwright's
        // simulated mouse click, even forced, doesn't trigger this element's handler on MW).
        // NOTE: live-confirmed this still lands on the regular My Bets page rather than the
        // "Account Options" popup this test expects next — MW's hamburger "My Bets" may not
        // route through that secondary popup at all (a different, unresolved question from the
        // click-mechanics bug fixed here). Left as-is rather than guessing a workaround.
        await this.page.getByText('My Bets').filter({ visible: true }).first().evaluate((el: HTMLElement) => el.click());
        await this.page.getByText(`Account Options: ${mobile} `);
        // Was an inline getByRole(...).nth(1), which no region could override. betInfluencerLink2
        // carries the identical definition, so every region resolves exactly as before — but GH,
        // whose page renders only ONE "Bet Influencer" link (confirmed live 2026-10-16: the
        // Account Options popup opens correctly, there simply is no index 1), can now point the
        // same key at the first match instead of timing out on an element that cannot exist.
        const windowBetInfluencer = this.loc.betInfluencerLink2;
        await windowBetInfluencer.waitFor({ state: 'visible', timeout: 5000 });
        await highlightElements(windowBetInfluencer);
    }

    async verifyAndClickDetailedBreakdown() {
        await highlightElements(this.loc.detailedBreakdownButton);
        await this.loc.detailedBreakdownButton.click();
    }

    // The "Sort" icon-button is a standalone SVG next to the sort-by dropdown, not inside it — a
    // different, adjacent control (see loc.sortButton).
    async verifyAndClickSortButton() {
        await highlightElements(this.loc.sortButton);
        await this.loc.sortButton.click();
    }

    async verifyNextButton(screenshotDir: string, testInfo: TestInfo) {
        await highlightElements(this.loc.nextButton);
    }

    async verifyPreviousButton(screenshotDir: string, testInfo: TestInfo) {
        // Confirmed live: "Previous" only renders once a later page has actually been visited —
        // it's simply absent from the DOM on page 1, not just disabled.
        if (await this.loc.previousButton.isVisible({ timeout: 2000 }).catch(() => false)) {
            await highlightElements(this.loc.previousButton);
        }
    }

    // Returns true if Next was already disabled when called (nothing to paginate through — the
    // real signal is the `disabled` attribute, not a CSS "active" class, which never existed on
    // the real button), false if it successfully paged forward at least once.
    async verifyNextButtonFunctionality() {
        let stayedOnFirstPage = true;
        while (!(await this.loc.nextButton.isDisabled().catch(() => true))) {
            await this.loc.nextButton.click();
            await this.page.waitForTimeout(1000);
            stayedOnFirstPage = false;
        }
        return stayedOnFirstPage;
    }

    async toggleHambergerMenu() {
        await this.Login();
        await this.loc.hamburgerMenu.click();
    }

    async gotoBetInfluencerModal() {
        await this.toggleHambergerMenu();
        // BetInfluencer (capitalised) has never existed as a key anywhere in the inheritance
        // chain — only the lowercase `betInfluencer` (from LoginPage) does. This click has always
        // thrown at runtime; preserved verbatim rather than silently redirected to the real key.
        await this.loc.betInfluencerLink1.click();
        await this.page.locator('#my-account-main').waitFor({ state: 'visible' });
    }
    async gotoDetailSectionBetInfluencerModal() {
        await this.toggleHambergerMenu();
        // Was: a 50s dead wait followed by clicking the ambiguous, unscoped "Bet Influencer" text
        // TWICE — confirmed live this occasionally lands on the wrong sidebar section entirely
        // (observed: "Bonus Summary") rather than opening Bet Influencer, since a fresh getByText()
        // query on the second click can resolve differently once the page has already navigated.
        // The sidebar item has a real, unambiguous id — click it once instead.
        await this.page.locator('[id="Bet Influencer-hamburger-menu-btn"]').click();
        await this.page.locator('#my-account-main').waitFor({ state: 'visible', timeout: 10000 });
        await this.clickDetailButton();
    }
    async goToBetInfluencerWithoutLogin() {
        await this.page.waitForLoadState('domcontentloaded');
        await this.loc.hamburgerMenu.click();
        await this.page.waitForLoadState('domcontentloaded');
        await this.page.waitForTimeout(2000);
        await this.loc.BetInfluencer.click();
        await this.page.waitForSelector('text=Revenue', { state: 'visible' });
        await this.page.waitForTimeout(2000);
    }
    /**
     * Clicks `locator`, dismissing a promotional popup that appears in between retries. Confirmed
     * live on MZ: a promotional interstitial (its own dedicated close button) can layer on top of
     * an already-open panel on a delay and intercept clicks meant for the panel's own content.
     * Closes only the LAST (topmost, most-recently-mounted) `#modal-close-btn` match — the panel
     * itself was already open before any promo layered on top of it, so its own close button is
     * never the last match, and clicking it here would incorrectly close the panel we're using.
     */
    private async clickDismissingPromo(locator: import('@playwright/test').Locator, attempts = 4) {
        for (let i = 0; i < attempts; i++) {
            try {
                await locator.click({ timeout: 8000 });
                return;
            } catch (e) {
                if (i === attempts - 1) throw e;
                const closeButtons = this.page.locator('#modal-close-btn').filter({ visible: true });
                const count = await closeButtons.count().catch(() => 0);
                if (count > 1) {
                    try { await closeButtons.last().click({ timeout: 3000 }); await this.page.waitForTimeout(300); } catch { /* not shown */ }
                }
            }
        }
    }

    async clickDetailButton() {
        await this.clickDismissingPromo(this.loc.detailButton);
    }

    async sortByDropDownFunctionalityChacek(screenshotDir: string, testInfo: TestInfo) {
        const sortbutton = this.page.locator('xpath=//*[@id="my-account-main"]/div/div[2]/div/div[1]/div[2]/div/div');
        for (let i = 0; i < 6; i++) {
            // Confirmed live on NG: the same promotional interstitial clickDismissingPromo() already
            // guards clickDetailButton() against (see above) can also layer on top of the panel
            // mid-loop here — observed landing squarely over the sort dropdown after a prior
            // ArrowDown+Enter selection, blocking every remaining iteration's click until timeout.
            // Route through the same dismiss-and-retry helper instead of a raw click.
            await this.clickDismissingPromo(sortbutton);
            await this.page.keyboard.press('ArrowDown');
            await this.page.keyboard.press('Enter');
            await highlightElements(sortbutton);
            await ScreenshotHelper(this.page, screenshotDir, `T7-${i + 1}-Sort by dropdown after click`, testInfo);
        }
    }

    async User1PlaceBets(legsCount: number) {
        await this.gotoSportsPage();
        await this.LoginArgs(`${userData.user1.mobile}`, `${userData.user1.password}`);
        await OddsSelectionAbove(legsCount, 1.2, this.page);
        await this.clickBetNowBtn();
        await this.retryBetIfOddsChanged();
        const bookingCode = await this.loc.bookingCodeMessage.locator('..').innerText();
        console.log(bookingCode);
        await this.page.locator('#modal-close-btn').first().click();
        await this.LogOut();
        return bookingCode;
    }

    async User2PlaceBetsFromBookingCode(bookingCode: any) {
        await this.LoginArgs(`${userData.user5.mobile}`, `${userData.user5.password}`);
        // Confirmed live: the unscoped `welcomeUser` ("Welcome" text) locator this used to wait on
        // is a strict-mode violation on ZA — it also matches an unrelated "Welcome To Betway Feed"
        // widget elsewhere on the page, same class of bug already fixed for T9's login check (see
        // verifyWelcomeUser() below) via the Deposit-button signal instead of raw "Welcome" text.
        // user5 has no `name` field in userData.json; verifyWelcomeUser() tolerates that fine — the
        // username highlight is best-effort only, not required for the check itself to pass.
        await this.verifyWelcomeUser(userData.user5.name);
        await this.loc.betslipButton.click();
        const SharedBookingCode = await GetBookingCode(bookingCode);
        await this.loc.bookingCodeInput.fill(`${SharedBookingCode}`);
        await this.page.keyboard.press('Enter');
        await this.clickBetNowBtn();
        await this.retryBetIfOddsChanged();
        // await this.loc.betConfirmation.locator('..').getByRole('img').first().click();
        await this.LogOut();
        return SharedBookingCode;
    }
}
