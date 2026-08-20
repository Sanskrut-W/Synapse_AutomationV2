import type { test as BetwayTest } from '../fixtures/betwayFixture';

export function runBookABetSuite(test: typeof BetwayTest, screenshotDir: string) {
    test.describe('BookABet Module Tests', () => {

        // T1: Verify Booking code button presence and functionality in sport section.
        test('T1-Verify Booking code button presence and functionality in sport section.', async ({ bookABetPage }, testInfo) => {
            await bookABetPage.navigateToBookABetSearch();
            await bookABetPage.captureScreenshot('bookABetSearch', screenshotDir, 'T1-bookabet', testInfo);
        });

        // T2: Verify Search booking code textbox presence and functionality on booking code page.
        test('T2-Verify Search booking code textbox presence and functionality on booking code page.', async ({ bookABetPage }, testInfo) => {
            await bookABetPage.navigateToBookABetSearchViaSport(); // Setup to get to the screen
            await bookABetPage.clickSearchTextBox();
            await bookABetPage.captureScreenshot('bookABetSearch', screenshotDir, 'T2-bookabet', testInfo);
        });

        // T3: Verify user is able to sort the booking code by winboost,odds,outcome and bets taken on booking code page.
        test('T3-Verify user is able to sort the booking code by winboost,odds,outcome and bets taken on booking code page.', async ({ bookABetPage }, testInfo) => {
            await bookABetPage.openSortByOddsDropdown();
            await bookABetPage.captureScreenshot('sortByOddsDropdown', screenshotDir, 'T3-bookabet', testInfo);
        });

        // T4: Verify Ascending and Descending button presence and functionality on booking code page.
        test('T4-Verify Ascending and Descending button presence and functionality on booking code page.', async ({ bookABetPage }, testInfo) => {
            await bookABetPage.clickArrowFilter(); // Click 1 (UP)
            await bookABetPage.clickArrowFilter(); // Click 2 (DOWN)
            await bookABetPage.captureScreenshot('arrowFilterDown', screenshotDir, 'T4-bookabet', testInfo);
        });

        // T5: Verify text message is displayed on clicking "i" icon
        test('T5-Verify text message is displayed on clicking "i" icon', async ({ bookABetPage }, testInfo) => {
            await bookABetPage.clickInfoButton();
            await bookABetPage.captureScreenshot('infoButton', screenshotDir, 'T5-bookabet', testInfo);
        });

        // T6: Verify Booking code dropdown presence and functionality on booking code page.
        test('T6-Verify Booking code dropdown presence and functionality on booking code page.', async ({ bookABetPage }, testInfo) => {
            await bookABetPage.openDetailedViewTabs();
            await bookABetPage.clickDetailedView();
            await bookABetPage.takeScreenshot('T6-bookabet', screenshotDir, testInfo);
        });

        // T7: Verify Share button presence and functionality on booking code page.
        test('T7-Verify Share button presence and functionality on booking code page.', async ({ bookABetPage }, testInfo) => {
            await bookABetPage.openSharePopup();
            await bookABetPage.captureScreenshot('sharePopup', screenshotDir, 'T7-bookabet', testInfo);
        });

        // T8 : Verify Copy booking code functionality on Booking code pop up window.
        test('T8-Verify Copy booking code functionality on Booking code pop up window.', async ({ bookABetPage }, testInfo) => {
            await bookABetPage.openSharePopup();
            await bookABetPage.clickCopyBookingCode();
            await bookABetPage.captureScreenshot('copyBookingCode', screenshotDir, 'T8-bookabet', testInfo);
            await bookABetPage.closePopup();
        });

        // T9 Verify Zoom out feature presence and functionality.
        test('T9-Verify Zoom out feature presence and functionality.', async ({ bookABetPage }, testInfo) => {
            await bookABetPage.openSharePopup();
            await bookABetPage.zoomIn();
            await bookABetPage.scrollToBottom();
            await bookABetPage.takeScreenshot('T9-bookabet', screenshotDir, testInfo);
        });

        // T 10 Verify user is able to share booking code by using social media options.
        test('T10-Verify user is able to share booking code by using social media options.', async ({ bookABetPage }, testInfo) => {
            await bookABetPage.openSharePopup();
            //  WhatsApp Functionality
            const newPage = await bookABetPage.clickWhatsAppButtonAndGetNewPage();
            await bookABetPage.takeScreenshot('T10-bookabet-whatsapp', screenshotDir, testInfo);
            await newPage.close();
        });

        // T11: Verify Presence of Key Betting Options on Booking Code Page.
        test('T11-Verify Presence of Key Betting Options on Booking Code Page.', async ({ bookABetPage }, testInfo) => {
            await bookABetPage.openDetailedViewTabs();
            await bookABetPage.clickDetailedView();
            await bookABetPage.takeScreenshot('T11-bookabet', screenshotDir, testInfo);
        });

        // T12: Verify user able to place a bet by adding legs from Booking code to betslip.
        test('T12-Verify user able to place a bet by adding legs from Booking code to betslip.', async ({ bookABetPage }, testInfo) => {
            await bookABetPage.openDetailedViewTabs(); // Setup
            await bookABetPage.clickAddToBetSlip();
            await bookABetPage.takeScreenshot('T12-bookabet', screenshotDir, testInfo);
        });

        // T13: Verify user able to place a bet by adding legs from Booking code to betslip.
        test('T13-Verify user able to place a bet by adding legs from Booking code to betslip.', async ({ bookABetPage }, testInfo) => {
            await bookABetPage.openDetailedViewTabs(); // Setup
            await bookABetPage.clickAddToBetSlip();
            await bookABetPage.Login();

            await bookABetPage.clickBetNow();
            await bookABetPage.navigateToMyBets();
            await bookABetPage.takeScreenshot('T13a-bookabet', screenshotDir, testInfo);
            await bookABetPage.navigateToTransactionHistory();
            await bookABetPage.takeScreenshot('T13b-bookabet', screenshotDir, testInfo);
        });

        // T14: Verify pagination at the bottom on booking code page.
        test('T14-Verify pagination at the bottom on booking code page.', async ({ bookABetPage }, testInfo) => {
            await bookABetPage.navigateToBookABetSearchViaSport();
            await bookABetPage.clickNextPagination();
            await bookABetPage.takeScreenshot('T14-bookabet', screenshotDir, testInfo);
        });
    });
}
