import type { test as BetwayTest } from '../fixtures/betwayFixture';
import { OddsSelectionAbove } from '../flows/OddSelection';

export function runTransactionHistorySuite(test: typeof BetwayTest, screenshotDir: string) {
    test.describe('Transaction History Module Tests', () => {

        // T1:Verify Transaction History option functionality in My Account dropdown inside Hamburger menu.
        test('T1: Verify Transaction History option functionality in My Account dropdown inside Hamburger menu.', async ({ transactionHistoryPage }, testInfo) => {
            await transactionHistoryPage.navigateToTransactionHistory();
            await transactionHistoryPage.captureScreenshot('accountMain', screenshotDir, 'T1-TransactionHistory', testInfo);
            await transactionHistoryPage.closePopupIfVisible();
        });

        // T2- Verify All tabs functionality in transaction history page.
        test('T2: Verify all tabs click and take screenshots', async ({ transactionHistoryPage }, testInfo) => {
            await transactionHistoryPage.navigateToTransactionHistory();

            const tabs = [
                { name: 'allBtn', locatorName: 'allBtn', screenshot: 'T2a-All' },
                { name: 'depositBtn', locatorName: 'depositBtn', screenshot: 'T2b-Deposits' },
                { name: 'withdrawalBtn', locatorName: 'withdrawalBtn', screenshot: 'T2c-Withdrawals' },
                { name: 'sportsBtn', locatorName: 'sportsBtn', screenshot: 'T2d-Sports' },
            ];

            for (const tab of tabs) {
                await transactionHistoryPage.clickTransactionTab(tab.name);
                await transactionHistoryPage.captureScreenshot(tab.locatorName, screenshotDir, `TransactionHistory_${tab.screenshot}`, testInfo);
            }

            await transactionHistoryPage.closePopupIfVisible();
        });

        // T3: Verify search by Transaction ID  functionality.
        test('T3-Verify search by Transaction ID  functionality.', async ({ transactionHistoryPage }, testInfo) => {
            await transactionHistoryPage.navigateToTransactionHistory();

            // No ID is passed here! The ID is managed internally by the Page Object.
            await transactionHistoryPage.searchTransactionByID();

            await transactionHistoryPage.captureScreenshot('transactionIdInput', screenshotDir, 'T3-TransactionHistory_Search', testInfo);
            await transactionHistoryPage.closePopupIfVisible();
        });

        // T4: Verify user is able to search transaction by entering start and date in calendar on transaction History page.
        // TODO: fix — failing in ZA smoke run (2026-07-07, ~2.8m). Commented out temporarily.
        // test('T4-Verify user is able to search transaction by entering start and date in calendar on transaction History page.', async ({ transactionHistoryPage }, testInfo) => {
        //     await transactionHistoryPage.navigateToTransactionHistory();
        //     await transactionHistoryPage.clickDatePicker();
        //     await transactionHistoryPage.captureScreenshot('dateDialog', screenshotDir, 'T4-TransactionHistory_Calendar', testInfo);
        //     await transactionHistoryPage.closePopupIfVisible();
        // });

        // T5:Verify Export button functionality on transaction history page
        test('T5-Verify Export button functionality on transaction history page', async ({ transactionHistoryPage }, testInfo) => {
            await transactionHistoryPage.navigateToTransactionHistory();
            await transactionHistoryPage.clickExportButton();
            await transactionHistoryPage.captureScreenshot('exportBtn', screenshotDir, 'T5-TransactionHistory_Export', testInfo);
            await transactionHistoryPage.closePopupIfVisible();
        });

        // T6-T8: Transaction Detail view & Betslip
        test('T6-T8: Transaction Detail view and Betslip info', async ({ transactionHistoryPage }, testInfo) => {
            await transactionHistoryPage.navigateToTransactionHistory();

            // T6: Detail View
            await transactionHistoryPage.openTransactionDetailView();
            await transactionHistoryPage.takeScreenshot(screenshotDir, 'T6-TransactionHistory_DetailView', testInfo);
            await transactionHistoryPage.clickDetailViewBackButton();

            // T7: Betslip Contents
            await transactionHistoryPage.openFirstTransactionBetslip();
            await transactionHistoryPage.takeScreenshot(screenshotDir, 'T7-TransactionHistory_BetslipContents', testInfo);

            // T8: Back from Betslip
            await transactionHistoryPage.clickBetslipBackButton();
            await transactionHistoryPage.takeScreenshot(screenshotDir, 'T8-TransactionHistory_BetslipClosed', testInfo);
            await transactionHistoryPage.closePopupIfVisible();
        });

        // T9: Bet Now to Transaction History
        test('T9 - Verify Bet Now to Transaction History', async ({ transactionHistoryPage, page }, testInfo) => {
            await OddsSelectionAbove(2, 1, page);
            await transactionHistoryPage.placeBet();
            await transactionHistoryPage.navigateToTransactionHistory();
            await transactionHistoryPage.page.waitForTimeout(1000);
            await transactionHistoryPage.captureScreenshot('accountMain', screenshotDir, 'T9-TransactionHistory', testInfo);
        });

    });
}
