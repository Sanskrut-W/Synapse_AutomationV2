import { expect, Page } from '@playwright/test';
import { SportsPage } from './SportsPage';
import { SafeActions } from '../actions/SafeActions';
import { css, role, text, at } from '../locators/sel';
import { highlightElementBorder, highlightElements } from '../flows/HighlightElements';
import { loadRegionData } from '../config/regionData';

const userData = loadRegionData('json-data/userData.json');

export class BetslipPage extends SportsPage {
    constructor(page: Page, safeActions: SafeActions) {
        super(page, safeActions);

        const inherited = this.loc;
        this.loc = { ...inherited, ...this.build('betslip', {
            mobileNumberInput: css('#header-username'),
            passwordInput: css('#header-password'),
            closePromotionPopup: css('#modal-close-btn'),
            sportButton: css('img[alt="Sport"]'),
            betslipButton: text('Betslip 0'),
            betslipCount: css('[data-testid="betslip-count"]'),
            singleTab: css('#betslip-single-tab'),
            multiTab: css('#betslip-multi-tab'),
            bookingCodeInput: role('textbox', { name: 'Booking Code' }),
            settingsButton: css('#betslip-setting-btn'),
            warningText: text("No selected betsYou don't"),
            loadButton: role('button', { name: 'load' }),
            settingsText: text('Betslip Settings'),
            acceptOddsToggleLabel: text('Accept all odds & line changes'),
            acceptOddsToggle: css('#settings-accept-odds-toggle'),
            keepBetsToggleLabel: text('Keep bets in betslip'),
            keepBetsToggle: css('#settings-keep-bets-in-betslip-toggle'),
            continueButton: css('#settings-continue-btn'),
            closeIcon: css('#modal-close-btn'),
            simpleViewToggle: css('#simple-view-toggle'),
            deleteIcon: css('#betslip-remove-all'),
            selectAllCheckbox: css('#betslip-select-all'),
            removeLegIcon: css('#remove-event-betslip'),
            betAmountInput: css('#bet-amount-input'),
            loginBtnBetslip: css('#betslip-container'),
            betNowBtn: css('#betslip-strike-btn'),
            shareBtn: css('#betslip-share-btn'),
            cashBtnSingle: css('#single-cash-tab'),
            freebetBtnSingle: css('#single-free-tab'),
            cashBtnMulti: css('#multi-cash-balance-tab'),
            freebetBtnMulti: css('#multi-freebet-tab'),
            cashOutIcon: css('.w-4.h-4.fill-primary-300 > path'),
            winBoostToolTip: text('Win Boost 2%. 1 more for 3% (Min odds 1.2)'),
            winBoostValue: text('Win Boost (2%): R'),
            betSaverText: text('Bet Saver is active'),
            totalBetwayReturnMulti: at(text('Total Betway Return'), 0),
            totalBetwayReturnSingle: at(text('Total Betway Return:'), 0),
            potentialReturnSingle: text('Potential Return:'),
            potentialReturnMulti: text('Potential Return:'),
            soccerLink: text('Soccer'),
            firstMatchOdds: at(css('[data-testid="market-odd-button"]'), 0),
            secondMatchOdds: at(css('[data-testid="market-odd-button"]'), 1),
            thirdMatchOdds: at(css('[data-testid="market-odd-button"]'), 2),
            betslipContainer: css('#betslip-container'),
            emptyBetslipMessage: text('No selected bets'),
            betslipCloseBtn: css('#betslip-close-btn'),
            multiTabInactive: css('#betslip-multi-tab.inactive'),
            totalOdds: css('.total-odds'),
            totalStake: css('.total-stake'),
            // Special handling for winBoostInfoIcon (complex locator) — kept out of the sheet
            // originally too, added as a raw locator after the registry literal.
            winBoostInfoIcon: (root) => root
                .locator('div', { hasText: /^Win Boost 2%\. 1 more for 3% \(Min odds 1\.2\)Bet Saver not active$/ })
                .getByRole('img')
                .nth(1),
        }) };
    }

    // goto() and Login() are inherited from BasePage (via SportsPage chain)

    async loginWithoutFreebet() {
        await this.Login(userData.user5);
    }

    async closePromotionPopup() {
        try {
            const popup = this.loc.closePromotionPopup;
            if (await popup.isVisible({ timeout: 50000 })) {
                await popup.click();
                await this.page.waitForTimeout(500);
            }
        } catch (error) {
            console.log('Promotion popup not found or already closed.');
        }
    }
    // Verification Methods
    async verifyBetslipButton() {
        await this.loc.betslipButton.waitFor({ state: 'visible', timeout: 15000 });
        await highlightElementBorder(this.loc.betslipButton);
    }

    async verifySingleTab() {
        await this.loc.singleTab.waitFor({ state: 'visible', timeout: 15000 });
        await highlightElementBorder(this.loc.singleTab);
    }

    async verifyMultiTab() {
        await this.loc.multiTab.waitFor({ state: 'visible', timeout: 15000 });
        await highlightElementBorder(this.loc.multiTab);
    }

    async verifyWarningText() {
        await this.loc.warningText.waitFor({ state: 'visible', timeout: 15000 });
        await highlightElementBorder(this.loc.warningText);
    }

    async verifyBookingCodeInput() {
        await this.loc.bookingCodeInput.waitFor({ state: 'visible', timeout: 15000 });
        await highlightElementBorder(this.loc.bookingCodeInput);
    }

    async verifyLoadButton() {
        await this.loc.loadButton.waitFor({ state: 'visible', timeout: 15000 });
        await highlightElementBorder(this.loc.loadButton);
    }

    async verifySettingsText() {
        await this.loc.settingsText.waitFor({ state: 'visible', timeout: 15000 });
        await highlightElementBorder(this.loc.settingsText);
    }

    async verifyAcceptOddsToggle() {
        await this.loc.acceptOddsToggleLabel.waitFor({ state: 'visible', timeout: 15000 });
        await highlightElementBorder(this.loc.acceptOddsToggleLabel);
    }

    async verifyKeepBetsToggle() {
        await this.loc.keepBetsToggleLabel.waitFor({ state: 'visible', timeout: 15000 });
        await highlightElementBorder(this.loc.keepBetsToggleLabel);
    }

    async verifyDeleteIcon() {
        await this.loc.deleteIcon.waitFor({ state: 'visible', timeout: 15000 });
        await highlightElementBorder(this.loc.deleteIcon);
    }

    async verifySelectAllCheckbox() {
        await this.loc.selectAllCheckbox.waitFor({ state: 'visible', timeout: 15000 });
        await highlightElementBorder(this.loc.selectAllCheckbox);
    }

    async verifyRemoveLegIcon() {
        await this.loc.removeLegIcon.waitFor({ state: 'visible', timeout: 15000 });
        await highlightElementBorder(this.loc.removeLegIcon);
    }

    async verifyBetAmountInput() {
        await this.loc.betAmountInput.waitFor({ state: 'visible', timeout: 15000 });
        await highlightElementBorder(this.loc.betAmountInput);
    }

    async verifyLoginBtnBetslip() {
        const loginBtn = this.loc.loginBtnBetslip.getByRole('button', { name: 'Login' });
        await loginBtn.waitFor({ state: 'visible', timeout: 15000 });
        await highlightElementBorder(loginBtn);
    }

    async verifyBetNowBtn() {
        await this.loc.betNowBtn.waitFor({ state: 'visible', timeout: 15000 });
        await highlightElementBorder(this.loc.betNowBtn);
    }

    async verifyShareBtn() {
        await this.loc.shareBtn.waitFor({ state: 'visible', timeout: 15000 });
        await highlightElementBorder(this.loc.shareBtn);
    }

    async verifyCashBtnSingle() {
        await this.loc.cashBtnSingle.waitFor({ state: 'visible', timeout: 15000 });
        await highlightElementBorder(this.loc.cashBtnSingle);
    }

    async verifyFreebetBtnSingle() {
        await this.loc.freebetBtnSingle.waitFor({ state: 'visible', timeout: 15000 });
        await highlightElementBorder(this.loc.freebetBtnSingle);
    }

    async verifyCashBtnMulti() {
        await this.loc.cashBtnMulti.waitFor({ state: 'visible', timeout: 15000 });
        await highlightElementBorder(this.loc.cashBtnMulti);
    }

    async verifyFreebetBtnMulti() {
        await this.loc.freebetBtnMulti.waitFor({ state: 'visible', timeout: 15000 });
        await highlightElementBorder(this.loc.freebetBtnMulti);
    }

    async verifyCashOutIcon() {
        await this.loc.cashOutIcon.waitFor({ state: 'visible', timeout: 15000 });
        await highlightElementBorder(this.loc.cashOutIcon);
    }

    async verifyWinBoostToolTip() {
        await expect(this.loc.winBoostToolTip).toBeVisible();
        await highlightElements(this.loc.winBoostToolTip);
    }

    async verifyWinBoostValue() {
        await expect(this.loc.winBoostValue).toBeVisible();
        await highlightElements(this.loc.winBoostValue);
    }

    async verifyWinBoostInfoIcon() {
        await expect(this.loc.winBoostInfoIcon).toBeVisible();
        await highlightElementBorder(this.loc.winBoostInfoIcon);
    }

    async verifyBetSaverText() {
        await expect(this.loc.betSaverText).toBeVisible();
        await highlightElements(this.loc.betSaverText);
    }

    async verifyTotalBetwayReturnMulti() {
        await expect(this.loc.totalBetwayReturnMulti).toBeVisible();
        await highlightElements(this.loc.totalBetwayReturnMulti);
    }

    async verifyTotalBetwayReturnSingle() {
        await expect(this.loc.totalBetwayReturnSingle).toBeVisible();
        await highlightElements(this.loc.totalBetwayReturnSingle);
    }

    async verifyPotentialReturnSingle() {
        await expect(this.loc.potentialReturnSingle).toBeVisible();
        await highlightElements(this.loc.potentialReturnSingle);
    }

    async verifyPotentialReturnMulti() {
        await expect(this.loc.potentialReturnMulti).toBeVisible();
        await highlightElements(this.loc.potentialReturnMulti);
    }

    async verifyEmptyBetslipMessage() {
        await this.loc.emptyBetslipMessage.waitFor({ state: 'visible', timeout: 15000 });
        await highlightElementBorder(this.loc.emptyBetslipMessage);
    }

    async verifySimpleViewToggle() {
        await this.loc.simpleViewToggle.waitFor({ state: 'visible', timeout: 15000 });
        await highlightElementBorder(this.loc.simpleViewToggle);
    }

    // --- NEW VERIFICATION METHODS ---
    async verifySettingsButtonVisible() {
        await expect(this.loc.settingsButton).toBeVisible();
        await highlightElementBorder(this.loc.settingsButton);
    }

    async verifyAcceptOddsToggleVisible() {
        await expect(this.loc.acceptOddsToggle).toBeVisible();
        await highlightElementBorder(this.loc.acceptOddsToggle);
    }

    async verifyKeepBetsToggleVisible() {
        await expect(this.loc.keepBetsToggle).toBeVisible();
        await highlightElementBorder(this.loc.keepBetsToggle);
    }

    async verifyContinueButtonVisible() {
        await expect(this.loc.continueButton).toBeVisible();
        await highlightElementBorder(this.loc.continueButton);
    }

    async verifyCloseIconVisible() {
        await expect(this.loc.closeIcon).toBeVisible();
        await highlightElementBorder(this.loc.closeIcon);
    }

    async verifyCashBtnSingleNotVisible() {
        await expect(this.loc.cashBtnSingle).toHaveCount(0);
    }

    async verifyFreebetBtnSingleNotVisible() {
        await expect(this.loc.freebetBtnSingle).toHaveCount(0);
    }

    async verifyBetSaverTextVisible() {
        await this.loc.betSaverText.scrollIntoViewIfNeeded();
        await this.page.waitForTimeout(1000); // Allow for scroll
        await expect(this.loc.betSaverText).toBeVisible();
        await highlightElements(this.loc.betSaverText);
    }

    // Click Methods
    async clickBetslipButton() {
        await this.loc.betslipButton.click();
    }

    async clickSingleTab() {
        await this.loc.singleTab.click();
    }

    async clickMultiTab() {
        await this.loc.multiTab.click();
    }

    async clickSettingsButton() {
        await this.loc.settingsButton.click();
        await this.page.waitForTimeout(1000);
    }

    async clickAcceptOddsToggle() {
        await this.loc.acceptOddsToggle.click();
    }

    async clickKeepBetsToggle() {
        await this.loc.keepBetsToggle.click();
    }

    async clickContinueButton() {
        await this.loc.continueButton.click();
    }

    async clickCloseIcon() {
        await this.loc.closeIcon.click();
    }

    async clickDeleteIcon() {
        await this.loc.deleteIcon.click();
    }

    async clickSelectAllCheckbox() {
        await this.loc.selectAllCheckbox.click();
    }

    async clickRemoveLegIcon() {
        await this.loc.removeLegIcon.click();
    }

    async clickBetNowBtn() {
        await this.loc.betNowBtn.click();
    }

    async clickShareBtn() {
        await this.loc.shareBtn.click();
    }

    async clickCashBtnSingle() {
        await this.loc.cashBtnSingle.click();
    }

    async clickFreebetBtnSingle() {
        await this.loc.freebetBtnSingle.click();
    }

    async clickCashBtnMulti() {
        await this.loc.cashBtnMulti.click();
    }

    async clickFreebetBtnMulti() {
        await this.loc.freebetBtnMulti.click();
    }

    async clickTotalBetwayReturnSingle() {
        await this.loc.totalBetwayReturnSingle.click();
    }

    async clickTotalBetwayReturnMulti() {
        await this.loc.totalBetwayReturnMulti.click();
    }

    async clickFirstMatchOdds() {
        await this.loc.firstMatchOdds.click();
    }

    async clickSecondMatchOdds() {
        await this.loc.secondMatchOdds.click();
    }

    async clickThirdMatchOdds() {
        await this.loc.thirdMatchOdds.click();
    }

    async clickLoadButton() {
        await this.loc.loadButton.click();
    }

    async clickSimpleViewToggle() {
        await this.loc.simpleViewToggle.click();
    }

    async clickBetslipCloseBtn() {
        await this.loc.betslipCloseBtn.click();
    }

    // --- NEW CLICK/ACTION METHODS ---
    async clickWinBoostInfoIcon() {
        await this.loc.winBoostInfoIcon.click();
    }

    async clickLoginBtnBetslip() {
        const loginBtn = this.loc.loginBtnBetslip.getByRole('button', { name: 'Login' });
        await loginBtn.click();
    }

    // Input Methods
    async enterBetAmount(amount: string) {
        await this.loc.betAmountInput.fill(amount);
    }

    async enterBookingCode(code: string) {
        await this.loc.bookingCodeInput.fill(code);
    }

    // --- NEW ACTION METHODS ---
    async checkSelectAllCheckbox() {
        await this.loc.selectAllCheckbox.check();
    }

    async uncheckSelectAllCheckbox() {
        await this.loc.selectAllCheckbox.uncheck();
    }

    // Combined Actions for Tests
    async verifyBetslipSection() {
        await this.verifyBetslipButton();
        await this.clickBetslipButton();
        await this.verifySingleTab();
        await this.verifyMultiTab();
        await this.verifyWarningText();
        await this.verifyBookingCodeInput();
        await this.verifyLoadButton();
    }

    async verifyBetslipSettingsSection() {
        await this.clickBetslipButton();
        await this.clickSettingsButton();
        await this.verifySettingsText();
        await this.verifyAcceptOddsToggle();
        await this.verifyKeepBetsToggle();
        // await this.clickAcceptOddsToggle();
    }

    async verifyAndTestInvalidInput(value: string) {
        // This method was in the original, but T25 implemented its own logic.
        await this.verifyBetAmountInput();
        for (const char of value) {
            await this.loc.betAmountInput.type(char);
        }
        const currentValue = await this.loc.betAmountInput.inputValue();
        expect(/^\d*\.?\d*$/.test(currentValue)).toBeTruthy();
    }

    // --- NEW COMBINED ACTION for T25 ---
    async validateInvalidBetAmountInput(input: string) {
        await this.loc.betAmountInput.fill(''); // Clear
        await this.loc.betAmountInput.type(input);
        const enteredValue = await this.loc.betAmountInput.inputValue();

        // The original test threw an error, which is a good pattern for tests
        if (enteredValue === input) {
            throw new Error(`Invalid input '${input}' was accepted in Bet Wager field.`);
        }
        // Alternate assertion style:
        // expect(enteredValue).not.toBe(input);
    }

    async verifyWinBoostCalculation() {
        await this.enterBetAmount('1');
        await this.verifyWinBoostValue();
    }

    async verifyPotentialReturnsSingle() {
        await this.verifyTotalBetwayReturnSingle();
        await this.clickTotalBetwayReturnSingle();
        await this.verifyPotentialReturnSingle();
    }

    async verifyPotentialReturnsMulti() {
        await this.clickMultiTab();
        await this.verifyTotalBetwayReturnMulti();
        await this.clickTotalBetwayReturnMulti();
        await this.verifyPotentialReturnMulti();
    }

    async addSingleBetToSlip() {
        await this.goto();
        await this.clickFirstMatchOdds();
        await this.page.waitForTimeout(1000);
    }

    async addMultipleBetsToSlip() {
        await this.goto();
        await this.clickFirstMatchOdds();
        await this.page.waitForTimeout(500);
        await this.clickSecondMatchOdds();
        await this.page.waitForTimeout(500);
        await this.clickThirdMatchOdds();
        await this.page.waitForTimeout(1000);
    }

    async verifyAndToggleSettings() {
        await this.clickSettingsButton();
        await this.verifySettingsText();
        await this.verifyAcceptOddsToggle();
        await this.verifyKeepBetsToggle();
        await this.clickAcceptOddsToggle();
        await this.page.waitForTimeout(500);
        await this.clickKeepBetsToggle();
        await this.page.waitForTimeout(500);
        await this.clickContinueButton();
    }

    async verifyBetslipWithSingleBet() {
        await this.clickBetslipButton();
        await this.verifySingleTab();
        await this.verifyBetAmountInput();
        await this.verifyRemoveLegIcon();
    }

    async verifyBetslipWithMultipleBets() {
        await this.clickBetslipButton();
        await this.clickMultiTab();
        await this.verifyMultiTab();
        await this.verifyBetAmountInput();
        await this.verifyDeleteIcon();
        await this.verifySelectAllCheckbox();
    }

    async verifyAndClickLoginFromBetslip() {
        await this.clickBetslipButton();
        await this.verifyLoginBtnBetslip();
        await this.clickLoginBtnBetslip(); // Using new dedicated click method
    }

    async verifyBetNowButton() {
        await this.clickBetslipButton();
        await this.enterBetAmount('10');
        await this.verifyBetNowBtn();
    }

    async verifyShareButton() {
        await this.clickBetslipButton();
        await this.verifyShareBtn();
    }

    async verifyCashAndFreebetTabsSingle() {
        await this.clickBetslipButton();
        await this.verifyCashBtnSingle();
        await this.verifyFreebetBtnSingle();
    }

    async verifyCashAndFreebetTabsMulti() {
        await this.clickBetslipButton();
        await this.clickMultiTab();
        await this.verifyCashBtnMulti();
        await this.verifyFreebetBtnMulti();
    }

    async verifyWinBoostSection() {
        await this.clickBetslipButton();
        await this.clickMultiTab();
        await this.verifyWinBoostToolTip();
        await this.verifyWinBoostInfoIcon();
        await this.enterBetAmount('10');
        await this.verifyWinBoostValue();
    }

    async clearBetslip() {
        await this.clickBetslipButton();
        await this.clickDeleteIcon();
        await this.page.waitForTimeout(1000);
    }
}
