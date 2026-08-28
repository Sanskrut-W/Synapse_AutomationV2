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
            sortBySelector: first((root) => root.locator('#sortSelector')),
            codesUsed: first(text('Codes used')),
            betsTaken: first(text('Bets taken')),
            // Source Excel type is "css" for both — the old resolver's "css" branch never even
            // reads `options`, so the intended {"name":"Next"}/{"name":"Previous"} filters were
            // always ignored. Both resolve to the exact same first `.NextPrevBtn` element.
            // Preserved verbatim.
            nextButton: first((root) => root.locator('.NextPrevBtn')),
            previousButton: first((root) => root.locator('.NextPrevBtn')),
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
        await this.page.getByText('My Bets').nth(0).click();
        await this.page.getByText(`Account Options: ${mobile} `);
        const windowBetInfluencer = this.page.getByRole('link', { name: 'Bet Influencer' }).nth(1);
        await windowBetInfluencer.waitFor({ state: 'visible', timeout: 5000 });
        await highlightElements(windowBetInfluencer);
    }

    async verifyAndClickDetailedBreakdown() {
        await highlightElements(this.loc.detailedBreakdownButton);
        await this.loc.detailedBreakdownButton.click();
    }

    async verifyNextButton(screenshotDir: string, testInfo: TestInfo) {
        await highlightElements(this.loc.nextButton);
    }

    async verifyPreviousButton(screenshotDir: string, testInfo: TestInfo) {
        await highlightElements(this.loc.previousButton);
    }

    async verifyNextButtonFunctionality() {
        let activeTag = true;
        while (await this.loc.nextButton.getAttribute('class').then(cls => cls && cls.includes('active'))) {
            await this.loc.nextButton.click();
            await this.page.waitForTimeout(1000);
            activeTag = false;
        }
        return activeTag;
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
        // await this.loc.betConfirmation.locator('..').getByRole('img').first().click();
        await this.LogOut();
        return SharedBookingCode;
    }
}
