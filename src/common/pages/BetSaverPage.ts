import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';
import { SafeActions } from '../actions/SafeActions';
import { css, role, text, label, placeholder, first, at } from '../locators/sel';
import { highlightElements } from '../flows/HighlightElements';
import { ScreenshotHelper } from '../flows/ScreenshotHelper';
import { OddsSelection, LiveOddsSelection, DrawNoBetOddsSelection, EsportsOddsSelection, OddsSelectionAbove } from '../flows/OddSelection';

export class BetSaverPage extends BasePage {
    constructor(page: Page, safeActions: SafeActions) {
        super(page, safeActions);

        this.loc = { ...this.loc, ...this.build('betSaver', {
            // --- Login & Registration ---
            gotit: first(role('button', { name: 'Got it' })),
            mobileNumber: first(role('textbox', { name: 'Mobile Number' })),
            password: first(role('textbox', { name: 'Enter Password' })),
            loginButton: first(role('button', { name: 'Login' })),

            // --- Navigation & Core Buttons ---
            sportButton: first(role('link', { name: 'Sport Sport' })),
            liveButton: first(role('link', { name: 'Live Live' })),
            eSportsButton: first(role('link', { name: 'ESports ESports' })),
            upcomingButton: first(text('Upcoming', { exact: true })),
            liveTab: css('#sports-tabs div:has-text("Live")'),
            hamburgerMenu: css('#header-hamburger-btn'),
            myBetsButton: first(text('My Bets')),

            // --- BetSaver Status & Info ---
            betSaverNotActive: first(text('Bet Saver not active')),
            betSaverActive: first(text('Bet Saver is active')),
            betSaverInfo: at(css('svg.flex-shrink-0.w-6.h-5.cursor-pointer'), 1),
            continueInBetSaverInfo: first(role('button', { name: 'Continue' })),
            betSaverPopup: first(text('Win Boost Bet Saver Our Bet')),

            // --- BetSlip & Wager ---
            multiBetSlip: css('#betslip-multi-tab'),
            singleBetSlip: css('#betslip-single-tab'),
            betSlipTextBox: first(role('textbox', { name: 'Booking Code' })),
            betSlipsearchIcon: css('#betslip-container form img'),
            // Source Excel value is the number 0, not a real placeholder string — never matched a
            // real element. Preserved verbatim (String(0)), not guessed at.
            wagerAmountInput: placeholder('0'),
            betAmountInput: css('#bet-amount-input'),
            betNowButton: first(role('button', { name: 'Bet Now' })),
            betslipDeleteButton: css('#betslip-remove-all'),
            closePopup: css('#modal-close-btn'),

            // --- Booking Code & Sharing ---
            bookABet: first(role('button', { name: 'Codesicon' })),
            addToBetSlip: first(role('button', { name: '/Booking Code #\\w+/' })), // literal string, not a real regex — never matched
            copyBookingCode: css('span:has-text("Booking Code") svg'),
            shareButton: first(role('button', { name: 'share' })),

            // --- My Bets / Settled / Cash Out ---
            settledBetsButton: first(text('Settled Bets')),
            openBetsButton: first(text('Open Bets')),
            cashOutButton: first(role('button', { name: 'Cashout' })),
            cashoutConfirmButton: css('div.flex.justify-between.w-full button[aria-label="Cashout"]'),
            cashOutCloseButton: first(role('button', { name: 'Close' })),
            betSaverInMyBets: first((root) => root.locator('xpath=//*[@id="my-bets-container"]/div[3]/div[2]/div[1]/div[1]/div[2]/div/svg[2]')),
            betSaverInDetailView: first(role('button', { name: 'Bet Saver You have qualified' })),
            detailViewButton: first(text('Detail View')),
            // Source "nth" cell held descriptive text instead of a number — Number(...) => NaN,
            // so the old resolver's `.nth(config.nth)` call would have received NaN. Preserved as
            // a plain (unwrapped) locator rather than replicating `.nth(NaN)`.
            detailViewBackButton: css('#detail-view-back-btn img'),
            rebetButton: label('Rebet'),

            // --- Smart Picks & Filters ---
            smartPicksButton: css('.flex > .col-span-6 > div:nth-child(4)'),
            arrowFilter: at(css('div:has-text("Bets Taken Odds are indicative and may not be the latest") img'), 2),
            smartPicks5: first(text('Smart Picks 5')),
            smartPicks10: first(text('Smart Picks 10')),
            smartPicks15: first(text('Smart Picks 15')),
            smartPicks20: first(text('Smart Picks 20')),
            smartPicks25: first(text('Smart Picks 25')),
            smartPicks30: first(text('Smart Picks 30')),

            // --- Market Dropdowns ---
            // Source options ({"text": "..."}) aren't a valid getByLabel option (only `exact` is),
            // so they were always ignored at runtime.
            marketsDropdown: label('Total Goals'),
            drawNoBetMarket: label('Draw No Bet'),
            betSaverTextInDetail: first(text('You have qualified for Bet Saver on this bet.')),
        }) };
    }

    // goto() and Login() are inherited from BasePage

    // --- Screenshot Utility Methods (Kept for external calls from spec file) ---
    async captureScreenshot(locatorName: string, screenshotDir: string, fileName: string, testInfo: any) {
        const locator = this.loc[locatorName];
        await highlightElements(locator);
        await ScreenshotHelper(this.page, screenshotDir, fileName, testInfo);
    }

    async takeScreenshot(screenshotDir: string, fileName: string, testInfo: any) {
        await ScreenshotHelper(this.page, screenshotDir, fileName, testInfo);
    }
    // --- End Screenshot Utility Methods ---

    // --- Low-Level Safe Wrappers (Moved from Spec Helper) ---

    private async safeClick(locator: Locator, name: string) {
        await expect(locator, `${name} should be visible`).toBeVisible({ timeout: 5000 });
        await locator.click();
    }

    private async safeFill(locator: Locator, value: string, name: string) {
        await expect(locator, `${name} should be visible`).toBeVisible({ timeout: 5000 });
        await locator.fill(value);
    }

    private async safePress(key: string) {
        await this.page.keyboard.press(key);
    }

    async preparePage() {
        await this.page.waitForTimeout(2000);
        await this.page.reload();
        await this.page.waitForLoadState('domcontentloaded');
    }

    async closePopup() {
        const close = this.loc.closePopup;
        if (await close.isVisible({ timeout: 1000 })) {
            await close.click();
            await this.page.waitForTimeout(500);
        }
    }

    async deleteBetslipIfVisible() {
        if (await this.loc.betslipDeleteButton?.isVisible()) {
            await expect(this.loc.betslipDeleteButton).toBeVisible({ timeout: 10000 });
            await this.loc.betslipDeleteButton.click();
        }
    }

    async navigateToMyBets() {
        await this.page.goto('https://new.betway.co.za/sport/soccer/upcoming?account=my-bets');
        await this.page.waitForLoadState('domcontentloaded');
    }

    async outrightsSelection() {
        await this.page.goto('https://new.betway.co.za/sport/football/outrights');
        await this.page.waitForTimeout(2000);
        const firstOdds = this.page.locator('(//div[contains(@class,"odd-value")])[1]');
        if (await firstOdds.isVisible()) {
            await firstOdds.click();
        }
    }

    async clickBookingCode() {
        await this.page.goto('https://new.betway.co.za/sport/soccer');
        await this.page.waitForTimeout(1000);
        await this.loc.clickBookingCode.click();
        await this.page.waitForTimeout(1000);
    }

    async acceptNewWager() {
        const confirmRebet = this.page.locator("//button[contains(.,'Accept Changes') or contains(.,'Confirm')]");
        if (await confirmRebet.isVisible({ timeout: 2000 })) {
            await confirmRebet.click();
        }
    }

    async cashoutBet() {
        const cashoutBtn = this.page.locator("//button[contains(.,'Cash Out')]");
        if (await cashoutBtn.isVisible()) {
            await cashoutBtn.click();
            await this.page.waitForTimeout(1000);
        }
    }

    // Helper used in T26-27, T32
    async tryClick(locator: Locator, name: string, timeout = 2000) {
        try {
            if (await locator.isVisible({ timeout })) {
                console.log(`Clicking on ${name}`);
                await locator.click();
                return true;
            } else {
                console.log(`${name} not visible, skipping...`);
                return false;
            }
        } catch {
            console.log(`${name} not found, skipping...`);
            return false;
        }
    }

    async continueBetSaverPopupFlow() {
        await this.safeClick(this.loc.betSaverInfo, 'BetSaver Info');
    }

    async closeBetSaverPopupFlow() {
        await this.safeClick(this.loc.continueInBetSaverInfo, 'Continue in BetSaver Info');
    }

    async clickDetailViewButton() {
        await this.safeClick(this.loc.detailViewButton, 'Detail View Button');
    }

    // Active BetSaver: the BetSaver text SHOULD be shown in the bet's Detail View.
    async verifyBetSaverTextVisibleInDetail() {
        await expect(
            this.loc.betSaverTextInDetail,
            'BetSaver text should be visible in Detail View'
        ).toBeVisible({ timeout: 10000 });
        await highlightElements(this.loc.betSaverTextInDetail);
    }

    // Grayed-out / non-qualifying BetSaver: the BetSaver text should NOT be shown in the Detail View.
    async verifyBetSaverTextNotVisibleInDetail() {
        await expect(
            this.loc.betSaverTextInDetail,
            'BetSaver text should NOT be visible in Detail View'
        ).toBeHidden({ timeout: 10000 });
    }

    async clickSettledBetsButton() {
        await this.safeClick(this.loc.settledBetsButton, 'Settled Bets Button');
        await this.page.waitForTimeout(3000);
    }

    async verifyBetsaverNotActiveForFewSelections() {
        await this.loc.gotit.click().catch(() => { });
        // await this.preparePage();
        await OddsSelectionAbove(2, 1.5, this.page);
        await this.safeClick(this.loc.multiBetSlip, 'BetSaver Not Active');
        await this.safeClick(this.loc.betSaverNotActive, 'BetSaver Not Active');
    }

    async setupBetsaverActive() {
        await this.loc.gotit.click().catch(() => { });
        await this.preparePage();
        await this.safeClick(this.loc.upcomingButton, 'Upcoming Button');
        await OddsSelectionAbove(7, 2, this.page);
        await this.safeClick(this.loc.multiBetSlip, 'BetSaver Not Active');
        await this.safeClick(this.loc.betSaverActive, 'BetSaver Active');
    }

    async openBetsaverInfoPopup() {
        await this.safeClick(this.loc.betSaverInfo, 'BetSaver Info');
    }

    async clickContinueInBetsaverInfo() {
        await this.safeClick(this.loc.continueInBetSaverInfo, 'Continue in BetSaver Info');
    }

    async placeQualifyingBetAndNavigateToMyBets(numberOfOdds: number = 3) {
        await this.loc.gotit.click().catch(() => { });
        await this.preparePage();
        // await this.safeClick(this.loc.upcomingButton, "Upcoming Button");
        await OddsSelectionAbove(numberOfOdds, 2.0, this.page);
        await this.safeClick(this.loc.multiBetSlip, 'BetSaver Not Active');
        await this.safeClick(this.loc.betNowButton, 'BetNow Button');
        await this.page.waitForTimeout(3000);
        await this.closePopup();
        await this.navigateToMyBets();
        await this.page.waitForTimeout(2000);
    }

    async placeBetsaverActiveBetAndNavigateToMyBets(numberOfOdds: number = 7, oddsAbove: number = 2.0) {
        await this.preparePage();
        await OddsSelectionAbove(numberOfOdds, oddsAbove, this.page);
        // await this.safeClick(this.loc.multiBetSlip, "BetSaver Not Active");
        // Scroll the Bet Now button into view before clicking it
        await this.loc.betNowButton.scrollIntoViewIfNeeded();
        await this.safeClick(this.loc.betNowButton, 'BetNow Button');
        await this.page.waitForTimeout(3000);
        await this.closePopup();
        await this.navigateToMyBets();
    }

    async selectOutrightBet() {
        await this.outrightsSelection();
        await this.safeClick(this.loc.multiBetSlip, 'Multi BetSlip');
    }

    async selectSportBetForMixedSlip() {
        await this.safeClick(this.loc.sportButton, 'Sport Button');
        // await this.safeClick(this.loc.upcomingButton, "Upcoming Button");
        await this.preparePage();
        await OddsSelectionAbove(2, 2.0, this.page);
        await this.safeClick(this.loc.multiBetSlip, 'BetSaver Not Active');
        await this.safeClick(this.loc.betSaverNotActive, 'BetSaver Not Active');
    }

    async loadBetFromBookingCodeAndCheckStatus() {
        await this.clickBookingCode();
        await this.safeClick(this.loc.addToBetSlip, 'Add To BetSlip');
        await this.safeClick(this.loc.multiBetSlip, 'Multi BetSlip');
        try {
            await this.safeClick(this.loc.betSaverActive, 'BetSaver Active');
            return 'Active';
        }
        catch {
            await this.safeClick(this.loc.betSaverNotActive, 'BetSaver Active');
            return 'NotActive';
        }
    }

    async selectLowOddsSmartPicks5() {
        await this.safeClick(this.loc.sportButton, 'Sport Button');
        await this.safeClick(this.loc.smartPicksButton, 'Smart Picks Button');
        await this.safeClick(this.loc.smartPicks5, 'Smart Picks 5');
        await this.safeClick(this.loc.multiBetSlip, 'BetSaver Not Active');
        await this.safeClick(this.loc.betSaverNotActive, 'BetSaver Not Active');
    }

    async selectMediumOddsSmartPicksAndVerifyActive() {
        await this.safeClick(this.loc.smartPicksButton, 'Smart Picks Button');

        // Complex logic for selecting suitable smart picks
        if (await this.tryClick(this.loc.smartPicks30, 'Smart Picks 30')) {
            await this.preparePage();
            await this.safeClick(this.loc.upcomingButton, 'Upcoming Button');
            await OddsSelection(6, this.page);
        } else if (await this.tryClick(this.loc.smartPicks25, 'Smart Picks 25')) {
            await this.preparePage();
            await this.safeClick(this.loc.upcomingButton, 'Upcoming Button');
            await OddsSelection(8, this.page);
        } else if (await this.tryClick(this.loc.smartPicks20, 'Smart Picks 20')) {
            await this.preparePage();
            await this.safeClick(this.loc.upcomingButton, 'Upcoming Button');
            await OddsSelection(10, this.page);
        } else if (await this.tryClick(this.loc.smartPicks15, 'Smart Picks 15')) {
            await this.preparePage();
            await this.safeClick(this.loc.upcomingButton, 'Upcoming Button');
            await OddsSelection(12, this.page);
        } else {
            console.warn('No Smart Picks option available (30, 25, or 20).');
        }

        await this.safeClick(this.loc.multiBetSlip, 'BetSaver Not Active');
        await this.safeClick(this.loc.betSaverActive, 'BetSaver Active');
    }

    async placeBetWithNewWagerChangeAndCheckMyBets() {
        await this.safeClick(this.loc.sportButton, 'Sport Button');
        await this.preparePage();
        await this.page.waitForTimeout(2000);
        await this.safeClick(this.loc.upcomingButton, 'Upcoming Button');
        await OddsSelection(12, this.page);
        await this.safeClick(this.loc.multiBetSlip, 'Multi BetSlip');
        await this.acceptNewWager();
        await this.page.waitForTimeout(2000);
        await this.closePopup();
        await this.page.waitForTimeout(5000);
        await this.navigateToMyBets();
    }

    async shareAndLoadBookingCode() {
        await this.safeClick(this.loc.sportButton, 'Sport Button');
        await this.preparePage();
        await this.safeClick(this.loc.upcomingButton, 'Upcoming Button');
        await OddsSelection(10, this.page);
        await this.safeClick(this.loc.multiBetSlip, 'Multi BetSlip');
        await this.safeClick(this.loc.shareButton, 'Share Button');
        await this.safeClick(this.loc.copyBookingCode, 'Copy Booking Code');
        await this.closePopup();

        await this.safeFill(this.loc.betSlipTextBox, '', 'BetSlip TextBox');
        await this.safePress('Control+V');
        await this.safeClick(this.loc.betSlipsearchIcon, 'BetSlip Search Icon');
        await this.safeClick(this.loc.betSaverActive, 'BetSaver Active');
    }

    async checkBetsaverNotActiveForHighWager() {
        await this.safeClick(this.loc.sportButton, 'Sport Button');
        await this.safeClick(this.loc.smartPicksButton, 'Smart Picks Button');
        await this.safeClick(this.loc.smartPicks5, 'Smart Picks 5');
        await this.safeClick(this.loc.multiBetSlip, 'Multi BetSlip');
        await this.safeFill(this.loc.wagerAmountInput, '2000', 'Wager Amount Input');
        await this.safeClick(this.loc.betSaverNotActive, 'BetSaver Not Active');
    }

    async checkBetsaverNotActiveForLowOddsAndFewLegs() {
        await this.safeClick(this.loc.sportButton, 'Sport Button');
        await this.safeClick(this.loc.smartPicksButton, 'Smart Picks Button');
        await this.safeClick(this.loc.smartPicks10, 'Smart Picks 10');
        await this.safeClick(this.loc.multiBetSlip, 'Multi BetSlip');
        await this.safeClick(this.loc.betSaverNotActive, 'BetSaver Not Active');
    }

    async checkBetsaverActiveForLowOddsAndManyLegs() {
        await this.safeClick(this.loc.sportButton, 'Sport Button');
        await this.safeClick(this.loc.smartPicksButton, 'Smart Picks Button');

        // Complex logic for selecting suitable smart picks (ensuring enough legs for activation)
        if (await this.tryClick(this.loc.smartPicks30, 'Smart Picks 30')) {
            await this.preparePage();
            await this.safeClick(this.loc.upcomingButton, 'Upcoming Button');
            await OddsSelection(6, this.page);
        } else if (await this.tryClick(this.loc.smartPicks25, 'Smart Picks 25')) {
            await this.preparePage();
            await this.safeClick(this.loc.upcomingButton, 'Upcoming Button');
            await OddsSelection(8, this.page);
        } else if (await this.tryClick(this.loc.smartPicks20, 'Smart Picks 20')) {
            await this.preparePage();
            await this.safeClick(this.loc.upcomingButton, 'Upcoming Button');
            await OddsSelection(10, this.page);
        } else if (await this.tryClick(this.loc.smartPicks15, 'Smart Picks 15')) {
            await this.preparePage();
            await this.safeClick(this.loc.upcomingButton, 'Upcoming Button');
            await OddsSelection(12, this.page);
        } else {
            throw new Error('No Smart Picks option available (30, 25, or 20) for T32 flow.');
        }

        await this.safeClick(this.loc.multiBetSlip, 'Multi BetSlip');
        await this.safeClick(this.loc.betSaverActive, 'BetSaver Active');
    }

    async checkBetsaverNotActiveForDrawNoBet() {
        await this.safeClick(this.loc.sportButton, 'Sport Button');
        await this.preparePage();
        await this.safeClick(this.loc.upcomingButton, 'Upcoming Button');
        await DrawNoBetOddsSelection(1, this.page);
        await this.safeClick(this.loc.multiBetSlip, 'Multi BetSlip');
        await this.safeClick(this.loc.betSaverNotActive, 'BetSaver Not Active');
    }

    async checkBetsaverNotActiveForMixedMarkets() {
        await this.safeClick(this.loc.sportButton, 'Sport Button');
        await this.safeClick(this.loc.smartPicksButton, 'Smart Picks Button');
        await this.safeClick(this.loc.smartPicks5, 'Smart Picks 5');
        await this.safeClick(this.loc.multiBetSlip, 'Multi BetSlip');
        await this.outrightsSelection(); // second market
        await this.safeClick(this.loc.betSaverNotActive, 'BetSaver Not Active');
        await this.safeClick(this.loc.sportButton, 'Sport Button'); // Cleanup step
    }

    async selectEsportsOddsAndVerifyActive() {
        await this.safeClick(this.loc.eSportsButton, 'Esports Button');
        const clickedOdds = await EsportsOddsSelection(10, this.page);

        // if (clickedOdds === 0) {
        //     throw new Error("No odds were selected for Esports even after retries");
        // }

        await this.safeClick(this.loc.multiBetSlip, 'Multi BetSlip');

        const isBetSaverVisible = await this.loc.betSaverActive.isVisible();
        if (!isBetSaverVisible) {
            throw new Error('BetSaver not active after odds selection');
        }
    }

    async selectLiveGameOddsAndVerifyActive() {
        await LiveOddsSelection(8, this.page);
        await this.safeClick(this.loc.multiBetSlip, 'Multi BetSlip');
        await this.safeClick(this.loc.betSaverActive, 'BetSaver Active');
    }
}
