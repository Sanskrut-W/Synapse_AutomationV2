import type { test as BetwayTest } from '../fixtures/betwayFixture';

export function runBetSaverSuite(test: typeof BetwayTest, screenshotDir: string) {
    test.describe('BetSaver Module Tests', () => {

        // T6-9 Betsaver Active in My Bets
        test('T6-9 - Betsaver Active in My Bets', async ({ betSaverPage }, testInfo) => {
            await betSaverPage.placeBetsaverActiveBetAndNavigateToMyBets(7);
            // T7 Detail View — BetSaver text SHOULD be visible
            await betSaverPage.clickDetailViewButton();
            await betSaverPage.verifyBetSaverTextVisibleInDetail();
            await betSaverPage.captureScreenshot('betSaverTextInDetail', screenshotDir, 'T7', testInfo);

            // T9 Opened Detail View — BetSaver text SHOULD be visible
            await betSaverPage.clickDetailViewButton();
            await betSaverPage.verifyBetSaverTextVisibleInDetail();
            await betSaverPage.captureScreenshot('betSaverTextInDetail', screenshotDir, 'T9', testInfo);
        });

        // T1: Verify Betsaver not active
        test('T1 - Verify Betsaver not active', async ({ betSaverPage }, testInfo) => {
            await betSaverPage.verifyBetsaverNotActiveForFewSelections();

            await betSaverPage.captureScreenshot('betSaverNotActive', screenshotDir, 'T1', testInfo);
            await betSaverPage.deleteBetslipIfVisible();
        });
        // T2-3: Betsaver Popup Flow
        test('T2- Verify the Bet saver offer on betslip when it is active. T3-Verify the click functionality of "i" button and details  when Bet Saver is active', async ({ betSaverPage }, testInfo) => {

            await betSaverPage.setupBetsaverActive();
            await betSaverPage.captureScreenshot('betSaverActive', screenshotDir, 'T2', testInfo);

            await betSaverPage.openBetsaverInfoPopup();
            await betSaverPage.takeScreenshot(screenshotDir, 'T3', testInfo);

        });

        // T4-5: Betsaver gray out in My Bets
        test('T4-5 - Betsaver gray out in My Bets', async ({ betSaverPage }, testInfo) => {
            // T4 Upcoming
            await betSaverPage.placeQualifyingBetAndNavigateToMyBets(3);
            // await betSaverPage.captureScreenshot('betSaverInMyBets', screenshotDir, 'T4', testInfo);

            // T5 Settled — BetSaver text should NOT be visible in the Detail View (grayed out / non-qualifying)
            await betSaverPage.clickSettledBetsButton();
            await betSaverPage.clickDetailViewButton();
            await betSaverPage.verifyBetSaverTextNotVisibleInDetail();
            await betSaverPage.takeScreenshot(screenshotDir, 'T5', testInfo);
        });
    });
}
