import { Page } from '@playwright/test';
import { BasePage } from './BasePage';
import { SafeActions } from '../actions/SafeActions';
import { css, role, at, first } from '../locators/sel';
import { highlightElements } from '../flows/HighlightElements';
import { ScreenshotHelper } from '../flows/ScreenshotHelper';

export class TransactionHistoryPage extends BasePage {
    // New Private Property to store the specific ID for testing
    private readonly TEST_TRANSACTION_ID = '12345678';

    constructor(page: Page, safeActions: SafeActions) {
        super(page, safeActions);

        this.loc = { ...this.loc, ...this.build('transactionHistory', {
            hamburgerBtn: css('#header-hamburger-btn'),
            transactionHistoryButton: role('link', { name: 'Transaction History' }),

            allBtn: css('#transaction-history-All-btn'),
            depositBtn: css('#transaction-history-deposit-btn'),
            withdrawalBtn: css('#transaction-history-withdrawal-btn'),
            sportsBtn: css('#transaction-history-sports-btn'),
            casinoBtn: css('#transaction-history-casino-btn'),
            betgamesBtn: css('#transaction-history-betgames-btn'),
            virtualsBtn: css('#transaction-history-virtual-btn'),
            jackpotsBtn: css('//*[@id="date"]'),

            accountMain: css('#my-account-main'),

            // Old resolver chained a SECOND .nth(1) on top of the Excel row's own .nth(0), which
            // narrows the locator to a single element and then re-indexes into it — an
            // out-of-bounds, effectively broken lookup. Preserved verbatim rather than "fixed" to
            // a single .nth(1).
            datePicker: at(at(css('#date'), 0), 1),
            dateDialog: role('dialog', { name: 'Choose Date' }),

            // Neither was scoped to a single row — with only 0-1 transactions on an account these
            // matched at most one element, but once the account accumulates real history (25
            // transactions, confirmed live) both hit a strict-mode violation. Both methods that use
            // these operate on the first/most-recent transaction, so .first() matches real intent.
            transactionIDButton: first(css('span.underline.cursor-pointer')),
            transactionIdInput: (root) => root.getByPlaceholder('Transaction ID'),
            transactionDetailView: first(css('svg.w-6.h-6.cursor-pointer.fill-dark-600')),
            detailViewBackButton: role('button', { name: 'Back' }),
            // Confirmed live: this id is duplicated on 2 structurally-identical elements.
            betslipBackButton: first(css('#detail-view-back-btn')),

            exportBtn: css('#transaction-history-export-btn'),

            nextPageButton: css('#transaction-history-next'),
            prevPageButton: css('#transaction-history-prev'),

            smartPicksButton: css('.flex > .col-span-6 > div:nth-child(4)'),
            smartPicks5: (root) => root.getByText('Smart Picks 5'),
            betNowButton: css('#betslip-strike-btn'),
            multipleBetsButton: css('#betslip-multi-tab'),

            closePopup: css('#modal-close-btn'),
            mobileNumber: role('textbox', { name: 'Mobile Number' }),
            password: role('textbox', { name: 'Enter Password' }),
            loginButton: role('button', { name: 'Login' }),
        }) };
    }

    // --- Navigation & Utility Functions (Kept as is) ---

    // goto() and Login() are inherited from BasePage

    async navigateToTransactionHistory() {
        await this.loc.hamburgerBtn.click();
        await this.page.waitForTimeout(1000);
        await this.loc.transactionHistoryButton.click();
        await this.page.waitForTimeout(1000);
    }

    async captureScreenshot(locatorName: string, screenshotDir: string, fileName: string, testInfo: any) {
        const locator = this.loc[locatorName];
        await highlightElements(locator);
        await ScreenshotHelper(this.page, screenshotDir, fileName, testInfo);
    }
    async takeScreenshot(screenshotDir: string, fileName: string, testInfo: any) {
        await ScreenshotHelper(this.page, screenshotDir, fileName, testInfo);
    }
    async closePopupIfVisible() {
        const closeBtn = this.loc.closePopup;
        if (await closeBtn.isVisible({ timeout: 10000 })) {
            await closeBtn.click();
            await this.page.waitForTimeout(500);
        }
    }

    async placeBet() {
        await this.loc.gotitButton?.click().catch(() => { /* Ignore if not present */ });
        await this.loc.betNowButton.scrollIntoViewIfNeeded();
        await this.loc.betNowButton.click();
        await this.page.waitForTimeout(3000);
        await this.closePopupIfVisible();
    }

    // --- Methods for Page Interactions ---

    async clickTransactionTab(tabName: string) {
        const tabLocator = this.loc[tabName];
        await tabLocator.click();
        await this.page.waitForTimeout(1000);
    }

    async clickDatePicker() {
        await this.loc.datePicker.click();
        await this.page.waitForTimeout(1000);
    }

    /**
     * Searches for a transaction using the internally stored test ID.
     */
    async searchTransactionByID() {
        const transactionButton = this.loc.transactionIDButton;
        const retrievedId = (await transactionButton.textContent())?.trim();

        if (retrievedId) {
            // Use the private property for filling the input
            await this.loc.transactionIdInput.fill(this.TEST_TRANSACTION_ID);
            await this.page.keyboard.press('Enter');
            await this.page.waitForTimeout(1000);
        } else {
            throw new Error('Transaction ID element not visible to proceed with search.');
        }
    }

    async clickExportButton() {
        await this.loc.exportBtn.click();
        await this.page.waitForTimeout(1000);
    }

    async openTransactionDetailView() {
        await this.loc.transactionDetailView.click();
        await this.page.waitForTimeout(1000);
    }

    async clickDetailViewBackButton() {
        await this.page.waitForTimeout(2000);
        await this.loc.detailViewBackButton.click();
        await this.page.waitForTimeout(1000);
    }

    async openFirstTransactionBetslip() {
        await this.loc.transactionIDButton.click();
        await this.page.waitForTimeout(1000);
    }

    async clickBetslipBackButton() {
        await this.page.waitForTimeout(1000);
        await this.loc.betslipBackButton.click();
        await this.page.waitForTimeout(1000);
    }
}
