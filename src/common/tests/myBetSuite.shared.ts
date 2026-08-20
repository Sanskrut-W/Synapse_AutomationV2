import type { test as BetwayTest } from '../fixtures/betwayFixture';
import { ScreenshotHelper } from '../flows/ScreenshotHelper';
import { activeRegion } from '../config/oddsApiUrl';

export function runMyBetSuite(test: typeof BetwayTest, screenshotDir: string) {
    test.describe('My Bets Page Functionality', () => {
        // Logs in before any test in this suite
        test.beforeEach(async ({ myBetsPage, testData }) => {
            await myBetsPage.gotoSports();
            await myBetsPage.login();
            // await myBetsPage.closePromotionPopup();
        });

        // --- OPEN BETS TESTS ---
        test.describe('Open Bets Section', () => {

            // Clicks "My Bets" and "Open Bets" tab before each test in this group
            test.beforeEach(async ({ myBetsPage }) => {
                await myBetsPage.clickMyBets();
                await myBetsPage.clickOpenBetsTab();
            });

            test('T1,2,3. Verify contents and structure of My Bets page', async ({ page, myBetsPage }, testInfo) => {
                await myBetsPage.highlightOpenBetsTab();
                await myBetsPage.highlightSettledBetsTab();
                await ScreenshotHelper(page, screenshotDir, 'my-bets-structure', testInfo);
            });

            test('T5. Verify category dropdown options in Open Bets', async ({ page, myBetsPage }, testInfo) => {
                // Confirmed live: TZ's My Bets category dropdown has no Betgames/Betway Jackpots
                // options at all (TZ doesn't offer those products — its main nav lacks them too).
                test.skip(activeRegion() === 'TZ', 'Betgames/Betway Jackpots categories do not exist for TZ');
                await myBetsPage.selectCategory('Betgames');
                await ScreenshotHelper(page, screenshotDir, 'open-bets-cat-betgames', testInfo);

                // await myBetsPage.selectCategory('Lucky Numbers');
                // await ScreenshotHelper(page, screenshotDir, 'open-bets-cat-lucky-numbers', testInfo);

                await myBetsPage.selectCategory('Betway Jackpots');
                await ScreenshotHelper(page, screenshotDir, 'open-bets-cat-jackpots', testInfo);

                await myBetsPage.selectCategory('Sports');
                await ScreenshotHelper(page, screenshotDir, 'open-bets-cat-tote', testInfo);
            });

            // test('T6. Verify "All Drop-down" result data options in Open Bets', async ({ page, myBetsPage }, testInfo) => {
            //     // Note: This test seems identical to T38. It's testing the same dropdown.
            //     // Assuming this dropdown is for "Filter"
            //     await myBetsPage.selectFilter('All');
            //     await ScreenshotHelper(page, screenshotDir, 'open-bets-filter-all', testInfo);

            //     await myBetsPage.selectFilter('Cashout');
            //     await ScreenshotHelper(page, screenshotDir, 'open-bets-filter-cashout', testInfo);
            // });

            test('T7. Verify search text box in Open Bets', async ({ page, myBetsPage }, testInfo) => {
                await myBetsPage.highlightSearchBox();
                await myBetsPage.searchFor('fc');
                await ScreenshotHelper(page, screenshotDir, 'open-bets-search-fc', testInfo);
            });

            test('T9. Open Bets>>Verify Detail view button functionality', async ({ page, myBetsPage }, testInfo) => {
                await myBetsPage.clickDetailView(0);
                await myBetsPage.highlightDetailViewContainer(0);
                await ScreenshotHelper(page, screenshotDir, 'open-bets-detail-view', testInfo);
            });

            test('T11. Open Bets>>Verify share functionality', async ({ page, myBetsPage }, testInfo) => {
                await myBetsPage.clickShare(0);
                await ScreenshotHelper(page, screenshotDir, 'open-bets-share-click', testInfo);
            });

            //below test failing due to before each opening mybets  wothout adding 6 legs

            // test('T23-26. My Bets Cashout flow and success highlight', async ({ page, myBetsPage }, testInfo) => {
            //     // Note: This test requires a bet to be in a cashout-able state.
            //     await myBetsPage.attemptCashout('confirm', 0);

            //     await expect(myBetsPage.getCashoutSuccessMessage()).toBeVisible();
            //     await myBetsPage.highlightCashoutSuccess();
            //     await ScreenshotHelper(page, screenshotDir, 'cashout-success', testInfo);
            // });
        });

        //  test('T17-22. Select 6 odds and check edit functionality', async ({ page, myBetsPage }, testInfo) => {
        //         await OddsSelectionAbove(6, 1,page );
        //         // await myBetsPage.closePromotionPopup();
        //         await myBetsPage.placeBet();
        //         await ScreenshotHelper(page, screenshotDir, 'select-6-odds', testInfo);
        //         await myBetsPage.closePromotionPopup();

        //         // Navigate back to My Bets (placing bet might close it)
        //         await myBetsPage.clickMyBets();
        //         await myBetsPage.clickOpenBetsTab();

        //         // Perform edit and continue
        //         await myBetsPage.performEditBetFlow('continue', 0);
        //         await ScreenshotHelper(page, screenshotDir, 'edit-bet-continue', testInfo);

        //         // Perform edit and cancel
        //         await myBetsPage.performEditBetFlow('cancel', 0);
        //         await ScreenshotHelper(page, screenshotDir, 'edit-bet-cancel', testInfo);
        //     });

        // // --- SETTLED BETS TESTS ---
        test.describe('Settled Bets Section', () => {

            // Clicks "My Bets" and "Settled Bets" tab before each test in this group
            test.beforeEach(async ({ myBetsPage }) => {
                await myBetsPage.clickMyBets();
                await myBetsPage.clickSettledBetsTab();
            });

            // test('T36,40,42. Verify Settled Bets section loads', async ({ page, myBetsPage }, testInfo) => {
            //     await expect(myBetsPage.getSettledBetsTab()).toBeVisible();
            //     await page.waitForTimeout(2000);
            //     await ScreenshotHelper(page, screenshotDir, 'settled-bets-section', testInfo);
            // });

            // test('T37. Verify category dropdown options in Settled Bets', async ({ page, myBetsPage }, testInfo) => {
            //     await myBetsPage.selectCategory('Betgames');
            //     await ScreenshotHelper(page, screenshotDir, 'settled-bets-cat-betgames', testInfo);

            //     await myBetsPage.selectCategory('Lucky Numbers');
            //     await ScreenshotHelper(page, screenshotDir, 'settled-bets-cat-lucky-numbers', testInfo);

            //     await myBetsPage.selectCategory('Jackpots');
            //     await ScreenshotHelper(page, screenshotDir, 'settled-bets-cat-jackpots', testInfo);

            //     await myBetsPage.selectCategory('Tote');
            //     await ScreenshotHelper(page, screenshotDir, 'settled-bets-cat-tote', testInfo);
            // });

            //     // test('T38. Verify "All Drop-down" result data options in Settled Bets', async ({ page, myBetsPage }, testInfo) => {
            //     //     await myBetsPage.selectFilter('All');
            //     //     await ScreenshotHelper(page, screenshotDir, 'settled-bets-filter-all', testInfo);

            //     //     await myBetsPage.selectFilter('Cashout');
            //     //     await ScreenshotHelper(page, screenshotDir, 'settled-bets-filter-cashout', testInfo);

            //     //     await myBetsPage.selectFilter('Win');
            //     //     await ScreenshotHelper(page, screenshotDir, 'settled-bets-filter-win', testInfo);

            //     //     await myBetsPage.selectFilter('Loss');
            //     //     await ScreenshotHelper(page, screenshotDir, 'settled-bets-filter-loss', testInfo);
            //     // });

            test('T39. Verify search text box in Settled Bets', async ({ page, myBetsPage }, testInfo) => {
                await myBetsPage.highlightSearchBox();
                await myBetsPage.searchFor('fc');
                await ScreenshotHelper(page, screenshotDir, 'settled-bets-search-fc', testInfo);
            });

            test('T41. Verify "Hide Losses" toggle functionality', async ({ page, myBetsPage }, testInfo) => {
                await myBetsPage.highlightHideLossesToggle();
                await myBetsPage.toggleHideLosses();
                await ScreenshotHelper(page, screenshotDir, 'settled-bets-hide-losses-on', testInfo);
            });

            test('T43 & T45. Settled Bets>>Verify Detail view button', async ({ page, myBetsPage }, testInfo) => {
                await myBetsPage.clickDetailView(0);
                await myBetsPage.highlightDetailViewContainer(0);
                await ScreenshotHelper(page, screenshotDir, 'settled-bets-detail-view', testInfo);
            });

            test('T44. settled bets verify pagination', async ({ page, myBetsPage }, testInfo) => {
                await myBetsPage.clickNextPage();
                await page.waitForTimeout(1000);
                await ScreenshotHelper(page, screenshotDir, 'settled-bets-pagination-next', testInfo);
            });
        });
    });
}
