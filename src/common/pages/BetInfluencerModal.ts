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
            summaryButton: first(text('summary')),
            detailButton: first(text('details')),
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
        await this.page.waitForTimeout(50000);
        await this.page.getByText('Bet Influencer').first().click();
        await this.page.getByText('Bet Influencer').first().click();
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
    async clickDetailButton() {
        await this.loc.detailButton.click();
    }

    async sortByDropDownFunctionalityChacek(screenshotDir: string, testInfo: TestInfo) {
        const sortbutton = this.page.locator('xpath=//*[@id="my-account-main"]/div/div[2]/div/div[1]/div[2]/div/div');
        for (let i = 0; i < 6; i++) {
            await sortbutton.click();
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
        await this.loc.welcomeUser.waitFor({ state: 'visible' });
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
