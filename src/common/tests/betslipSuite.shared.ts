import type { test as BetwayTest } from '../fixtures/betwayFixture';
import { ScreenshotHelper } from '../flows/ScreenshotHelper';
import { OddsSelectionAbove } from '../flows/OddSelection';

export function runBetslipSuite(test: typeof BetwayTest, screenshotDir: string) {
    test.describe('Betslip Module - ZA', () => {

        test('T1-Verify Betslip Section without selecting any odd ', async ({ betslipPage }, testInfo) => {
            await betslipPage.verifyBetslipSection();
            await ScreenshotHelper(betslipPage.page, screenshotDir, 'T1-betslipButton.png', testInfo);
        });

        test('T2-Verify betslip settings section', async ({ betslipPage, page }, testInfo) => {
            await betslipPage.verifyBetslipSettingsSection();
            await ScreenshotHelper(page, screenshotDir, 'T2-betslip-settings-1.png', testInfo);
            await betslipPage.clickContinueButton();
            await betslipPage.clickSettingsButton();
            await betslipPage.clickCloseIcon();
        });

        test('T3-Verify functionality of "Setting" button on betslip', async ({ betslipPage, page }, testInfo) => {
            await betslipPage.clickBetslipButton();
            await betslipPage.verifySettingsButtonVisible();
            await betslipPage.clickSettingsButton();
            await ScreenshotHelper(page, screenshotDir, 'T3-betslip-settings-button.png', testInfo);
        });

        test('T4-Verify functionality of "Accept all odds & line changes" toggle button', async ({ betslipPage, page }, testInfo) => {
            await betslipPage.clickBetslipButton();
            await betslipPage.clickSettingsButton();
            await betslipPage.verifyAcceptOddsToggleVisible();
            // await betslipPage.clickAcceptOddsToggle();
            await ScreenshotHelper(page, screenshotDir, 'T4-betslip-toggle-button.png', testInfo);
        });

        test('T6-Verify functionality of "Keep bets in betslip" toggle button', async ({ betslipPage, page }, testInfo) => {
            await betslipPage.clickBetslipButton();
            await betslipPage.clickSettingsButton();
            await betslipPage.verifyKeepBetsToggleVisible();
            // await betslipPage.clickKeepBetsToggle();
            await ScreenshotHelper(page, screenshotDir, 'T6-betslip-toggle-button.png', testInfo);
        });

        test('T7-Verify functionality of "Continue" button on betslip settings popup', async ({ betslipPage, page }, testInfo) => {
            await betslipPage.clickBetslipButton();
            await betslipPage.clickSettingsButton();
            await betslipPage.verifyContinueButtonVisible();
            await ScreenshotHelper(page, screenshotDir, 'T7-betslip-continue-button.png', testInfo);
            await betslipPage.clickContinueButton();
            await ScreenshotHelper(page, screenshotDir, 'T7-betslip-continue-button.png', testInfo);
        });

        test('T8-Verify functionality of "Close" icon on betslip settings popup', async ({ betslipPage, page }, testInfo) => {
            await betslipPage.clickBetslipButton();
            await betslipPage.clickSettingsButton();
            await betslipPage.verifyCloseIconVisible();
            await ScreenshotHelper(page, screenshotDir, 'T8-betslip-close-icon.png', testInfo);
            await betslipPage.clickCloseIcon();
        });

        test('T9-Verify functionality of "Delete" icon  on Betslip', async ({ betslipPage, page }, testInfo) => {
            await OddsSelectionAbove(1, 1, page);
            await betslipPage.verifyDeleteIcon();
            await ScreenshotHelper(page, screenshotDir, 'T9-betslip-delete-icon.png', testInfo);
            await betslipPage.clickDeleteIcon();
            await ScreenshotHelper(page, screenshotDir, 'T9-betslip-delete-icon-after-click.png', testInfo); // Renamed for clarity
        });

        test('T10-Verify functionality of "Select All" checkbox on Betslip', async ({ betslipPage, page }, testInfo) => {
            await OddsSelectionAbove(2, 1, page);
            await betslipPage.verifySelectAllCheckbox();
            await betslipPage.uncheckSelectAllCheckbox();
            await ScreenshotHelper(page, screenshotDir, 'T10-betslip-select-all-unchecked.png', testInfo);
            await betslipPage.checkSelectAllCheckbox();
            await ScreenshotHelper(page, screenshotDir, 'T10-betslip-select-all-checked.png', testInfo);
        });

        test('T11-Single section- Verify Content of the of the betslip by selecting odd', async ({ betslipPage, page }, testInfo) => {
            await OddsSelectionAbove(1, 1, page);
            await betslipPage.verifySingleTab();
            await ScreenshotHelper(page, screenshotDir, 'T11-betslip-single-tab.png', testInfo);
        });

        test('T12-Multi section- Verify Content of the of the betslip by selecting odd', async ({ betslipPage, page }, testInfo) => {
            await OddsSelectionAbove(2, 1, page);
            await betslipPage.verifyMultiTab();
            await betslipPage.clickMultiTab();
            await ScreenshotHelper(page, screenshotDir, 'T12-betslip-multi-tab.png', testInfo);
        });

        test('T13-Verify functionality of "Close" button of leg on Betslip inside single section of the betslip', async ({ betslipPage, page }, testInfo) => {
            await OddsSelectionAbove(1, 1, page);
            await betslipPage.verifyRemoveLegIcon();
            await ScreenshotHelper(page, screenshotDir, 'T13-betslip-remove-leg-icon-Single.png', testInfo);
            await betslipPage.clickRemoveLegIcon();
            await betslipPage.clickBetslipButton();
            await ScreenshotHelper(page, screenshotDir, 'T13-betslip-remove-leg-after-click-Single.png', testInfo);
        });

        test('T14-Verify functionality of Wager amount text box inside single section of the betslip', async ({ betslipPage, page }, testInfo) => {
            await OddsSelectionAbove(1, 1, page);
            await betslipPage.verifyBetAmountInput();
            await betslipPage.enterBetAmount('10');
            await ScreenshotHelper(page, screenshotDir, 'T14-betslip-bet-amount-input-Single.png', testInfo);
        });

        test('T35-Verify functionality of Wager amount text box inside multi section of the betslip', async ({ betslipPage, page }, testInfo) => {
            await OddsSelectionAbove(2, 1, page);
            // await betslipPage.clickMultiTab();
            await betslipPage.verifyBetAmountInput();
            await betslipPage.enterBetAmount('10');
            await ScreenshotHelper(page, screenshotDir, 'T35-betslip-bet-amount-input-multi.png', testInfo);
        });

        test('T15-Verify "Bet Saver" presence on betslip when be saver gets active.', async ({ betslipPage, page }, testInfo) => {
            await OddsSelectionAbove(7, 2, page);
            await betslipPage.verifyBetSaverTextVisible();
            await ScreenshotHelper(page, screenshotDir, 'T15-betslip-Bet-Saver-presence-multi.png', testInfo);
        });

        // test('T16-Verify presence of Cashout icon if cashout is available for the odds inside single and multi section', async ({ betslipPage, page }, testInfo) => {
        //   await OddsSelectionAbove(1, 1, page);
        //   await betslipPage.clickSimpleViewToggle();
        //   await betslipPage.verifyCashOutIcon();
        //   await ScreenshotHelper(page, screenshotDir, 'T16-betslip-cashout-icon-Single.png', testInfo);

        //   await betslipPage.clickMultiTab();
        //   await betslipPage.verifyCashOutIcon();
        //   await ScreenshotHelper(page, screenshotDir, 'T16-betslip-cashout-icon-multi.png', testInfo);
        // });

        //     // // test('T17-Verify Cashout icon should not display if cashout is not  available for selected odds inside single and multi section', async ({ betslipPage, page }, testInfo) => {
        //     // // });

        // test('T18-Verify functionality of "Use cash balance" checkbox on betslip for single section', async ({ betslipPage, page }, testInfo) => {
        //   await OddsSelection(1, page);
        //   await betslipPage.Login();
        //   await betslipPage.closePromotionPopup();
        //   await page.waitForTimeout(1000);
        //   await betslipPage.verifyCashBtnSingle();
        //   await betslipPage.clickCashBtnSingle();
        //   await ScreenshotHelper(page, screenshotDir, 'T18-betslip-use-cash-balance-checked-Single.png', testInfo);
        // });

        // test('T36-Verify functionality of "Use cash balance" checkbox on betslip for multi section', async ({ betslipPage, page }, testInfo) => {
        //   await OddsSelection(1, page);
        //   await betslipPage.Login();
        //   await betslipPage.closePromotionPopup();
        //   await page.waitForTimeout(1000);
        //   await betslipPage.clickMultiTab();
        //   await betslipPage.verifyCashBtnMulti();
        //   await betslipPage.clickCashBtnMulti();
        //   await ScreenshotHelper(page, screenshotDir, 'T36-betslip-use-cash-balance-checked-multi.png', testInfo);
        // });

        // test('T19-Verify functionality of "Use free bet" checkbox on betslip for single section', async ({ betslipPage, page }, testInfo) => {
        //   await OddsSelection(1, page);
        //   await betslipPage.Login();
        //   await betslipPage.closePromotionPopup();
        //   await betslipPage.verifyFreebetBtnSingle();
        //   await betslipPage.clickFreebetBtnSingle();
        //   await ScreenshotHelper(page, screenshotDir, 'T19-betslip-use-free-bet-checked-Single.png', testInfo);
        // });

        // test('T37-Verify functionality of "Use free bet" checkbox on betslip for multi section', async ({ betslipPage, page }, testInfo) => {
        //   await OddsSelection(1, page);
        //   await betslipPage.Login();
        //   await betslipPage.closePromotionPopup();
        //   await betslipPage.clickMultiTab();
        //   await betslipPage.verifyFreebetBtnMulti();
        //   await betslipPage.clickFreebetBtnMulti();
        //   await ScreenshotHelper(page, screenshotDir, 'T37-betslip-use-free-bet-checked-multi.png', testInfo); // Updated name
        // });

        test('T20-Single- Verify  "Total betway return" Wager(Calculation)', async ({ betslipPage, page }, testInfo) => {
            await OddsSelectionAbove(1, 1, page);
            await betslipPage.verifyTotalBetwayReturnSingle();
            await ScreenshotHelper(page, screenshotDir, 'T20-betslip-total-betway-return-calculation-Single.png', testInfo);
        });

        test('T21-Single-Verify "Potential Return" Wager(Calculation)', async ({ betslipPage, page }, testInfo) => {
            await OddsSelectionAbove(1, 1, page);
            await betslipPage.verifyPotentialReturnsSingle();
            await ScreenshotHelper(page, screenshotDir, 'T21-betslip-Potential-Return-calculation.png', testInfo);
        });

        test('T22-Multi- Verify  "Total betway return" Wager(Calculation)', async ({ betslipPage, page }, testInfo) => {
            await OddsSelectionAbove(1, 1, page);
            await betslipPage.clickMultiTab();
            await betslipPage.verifyTotalBetwayReturnMulti();
            await ScreenshotHelper(page, screenshotDir, 'T22-betslip-total-betway-return-calculation-multi.png', testInfo);
        });

        test('T23-Multi- Verify  "Potential Return" Wager(Calculation)', async ({ betslipPage, page }, testInfo) => {
            await OddsSelectionAbove(1, 1, page);
            await betslipPage.verifyPotentialReturnsMulti();
            await ScreenshotHelper(page, screenshotDir, 'T23-betslip-Potential-Return-calculation-multi.png', testInfo);
        });

        test('T24-Multi- Verify "Win boost" amount calculation on betslip.', async ({ betslipPage, page }, testInfo) => {
            await OddsSelectionAbove(2, 2, page);
            await betslipPage.verifyWinBoostCalculation();
            await ScreenshotHelper(page, screenshotDir, 'T24-betslip-Win-boost-amount-calculation-multi.png', testInfo);
        });

        // test('T25-Verify Bet Wager field is NOT accepting invalid Inputs', async ({ betslipPage, page }, testInfo) => {
        //   await OddsSelectionAbove(1, 1, page);
        //   await betslipPage.verifyBetAmountInput();

        //   const invalidInputs = ['e', '!@#', '12!@#34'];

        //   for (const [i, input] of invalidInputs.entries()) {
        //     // Using the new POM method to perform the validation
        //     await betslipPage.validateInvalidBetAmountInput(input);
        //     await ScreenshotHelper(page, screenshotDir, `T25-bet-amount-invalid-${i + 1}.png`, testInfo);
        //   }
        // });

        test('T26-Multi-Verify Win Boost tool tip', async ({ betslipPage, page }, testInfo) => {
            await OddsSelectionAbove(2, 2, page);
            await betslipPage.verifyWinBoostToolTip();
            await ScreenshotHelper(page, screenshotDir, 'T26-betslip-Win-boost-tool-tip-multi.png', testInfo);
        });

        test('T27-Multi-Verify Win Boost pop up window', async ({ betslipPage, page }, testInfo) => {
            await OddsSelectionAbove(2, 1.21, page);
            await betslipPage.verifyWinBoostInfoIcon();
            await betslipPage.clickWinBoostInfoIcon();
            await page.waitForTimeout(2000);
            await ScreenshotHelper(page, screenshotDir, 'T27-betslip-Win-boost-pop-up-window-multi.png', testInfo);
        });

        test('T28-Verify functionality of "Login" button on betslip for single tab', async ({ betslipPage, page }, testInfo) => {
            await OddsSelectionAbove(1, 1, page);
            await betslipPage.verifyLoginBtnBetslip();
            await ScreenshotHelper(page, screenshotDir, 'T28-betslip-login-button-Single.png', testInfo);
            await betslipPage.clickLoginBtnBetslip();
            await ScreenshotHelper(page, screenshotDir, 'T28-betslip-login-after-click-Single.png', testInfo);
        });

        test('T38-Verify functionality of "Login" button on betslip for multi tab', async ({ betslipPage, page }, testInfo) => {
            await OddsSelectionAbove(1, 1, page);
            await betslipPage.clickMultiTab();
            await betslipPage.verifyLoginBtnBetslip();
            await betslipPage.clickLoginBtnBetslip();
            await ScreenshotHelper(page, screenshotDir, 'T38-betslip-login-after-click-multi.png', testInfo);
        });

        test('T29-Single- Insufficient funds error pop-up on clicking "Bet Now" button', async ({ betslipPage, page }, testInfo) => {
            await OddsSelectionAbove(1, 2, page);
            await betslipPage.Login();
            await betslipPage.closePromotionPopup();
            await betslipPage.enterBetAmount('100000');
            await betslipPage.clickBetNowBtn();
            await ScreenshotHelper(page, screenshotDir, 'T29-betslip-insufficient-funds-error.png', testInfo);
        });

        // test('T30-Multi- Insufficient funds error pop-up on clicking "Bet Now" button', async ({ betslipPage, page }, testInfo) => {
        //   await OddsSelectionAbove(2, 1, page);
        //   await betslipPage.Login();
        //   await betslipPage.closePromotionPopup();
        //   await betslipPage.enterBetAmount('100000');
        //   await betslipPage.clickBetNowBtn();
        //   await ScreenshotHelper(page, screenshotDir, 'T30-betslip-insufficient-funds-error.png', testInfo);
        // });

        // test('T31-Verify functionality of "Share" button on betslip for single tab', async ({ betslipPage, page }, testInfo) => {
        //   await OddsSelectionAbove(1, 1, page);
        //   await betslipPage.Login();
        //   await page.waitForTimeout(4000);
        //   await betslipPage.closePromotionPopup();
        //   await betslipPage.verifyShareBtn();
        //   await ScreenshotHelper(page, screenshotDir, 'T31-betslip-share-button-Single.png', testInfo);
        //   await betslipPage.clickShareBtn();
        //   await page.waitForTimeout(4000);
        //   await ScreenshotHelper(page, screenshotDir, 'T31-betslip-share-after-click-Single.png', testInfo);
        // });

        // test('T32-Verify functionality of "Share" button on betslip for multi tab', async ({ betslipPage, page }, testInfo) => {
        //   await OddsSelectionAbove(1, 1, page);
        //   await betslipPage.Login();
        //   await page.waitForTimeout(4000);
        //   await betslipPage.closePromotionPopup();
        //   await betslipPage.clickMultiTab();
        //   await betslipPage.verifyShareBtn();
        //   await ScreenshotHelper(page, screenshotDir, 'T32-betslip-share-button-multi.png', testInfo);
        //   await betslipPage.clickShareBtn();
        //   await page.waitForTimeout(4000);
        //   await ScreenshotHelper(page, screenshotDir, 'T32-betslip-share-after-click-multi.png', testInfo);
        // });

        // test('T33-Verify Use Free Bet and Use Cash Balance options are NOT available', async ({ betslipPage, page }, testInfo) => {
        //   await OddsSelectionAbove(1, 1, page);
        //   await betslipPage.loginWithoutFreebet();
        //   await betslipPage.verifyCashBtnSingleNotVisible();
        //   await betslipPage.verifyFreebetBtnSingleNotVisible();
        //   await ScreenshotHelper(page, screenshotDir, 'T33-no-freebet-cash-options.png', testInfo);
        // });

        test('T34-Verify functionality of "Close" button of leg on Betslip inside multi section', async ({ betslipPage, page }, testInfo) => {
            await OddsSelectionAbove(1, 1, page);
            await betslipPage.clickMultiTab();
            await betslipPage.verifyRemoveLegIcon();
            await ScreenshotHelper(page, screenshotDir, 'T34-betslip-remove-leg-icon-multi.png', testInfo);
            await betslipPage.clickRemoveLegIcon();
            await betslipPage.clickBetslipButton();
            await ScreenshotHelper(page, screenshotDir, 'T34-betslip-remove-leg-after-clickmulti.png', testInfo);
        });
    });
}
