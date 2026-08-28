import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';
import { SafeActions } from '../actions/SafeActions';
import { css, role, at, first, text } from '../locators/sel';
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
            // Confirmed live: this id is duplicated on 2 structurally-identical elements, only one
            // of which is actually visible at a time (which one is first in DOM order isn't
            // consistent across regions — confirmed live on MZ it can be the second) — filtering to
            // the visible match is more robust than assuming DOM order.
            betslipBackButton: first((root) => root.locator('#detail-view-back-btn').filter({ visible: true })),

            exportBtn: css('#transaction-history-export-btn'),

            nextPageButton: css('#transaction-history-next'),
            prevPageButton: css('#transaction-history-prev'),

            smartPicksButton: css('.flex > .col-span-6 > div:nth-child(4)'),
            smartPicks5: (root) => root.getByText('Smart Picks 5'),
            betNowButton: css('#betslip-strike-btn'),
            multipleBetsButton: css('#betslip-multi-tab'),
            // Betslip panel counter button (e.g. "Betslip 2") — clicking it opens the panel when
            // it isn't already showing, matching BetslipPage.clickMultiTab()'s established pattern.
            betslipCounter: first(text(/Betslip\s*\d+/)),

            // Confirmed live on MZ: this id is duplicated on 3 elements at once (unlike the 1-2
            // seen on other regions) — an unscoped match hits a strict-mode violation on isVisible().
            closePopup: first(css('#modal-close-btn')),
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
        // Confirmed live on MZ: the panel's own backdrop can still be settling right after opening
        // — interacting with tabs/buttons too soon can have the backdrop transiently intercept the
        // click. Waiting for the panel's own content instead of a flat timeout reduces that window.
        await this.loc.accountMain.waitFor({ state: 'visible', timeout: 15000 }).catch(() => { });
        await this.page.waitForTimeout(1500);
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
        // Confirmed live on MZ: below Tailwind's `xl` breakpoint a mobile-style bottom tab bar
        // renders and can intercept the odd-price clicks inside OddsSelectionAbove (each click
        // failure there is silently swallowed, so it can end with zero legs selected and no Bet
        // Now button at all) — same class of responsive-layout issue already worked around in
        // NewHomePage/BetSaverPage via an explicit desktop viewport.
        await this.page.setViewportSize({ width: 1920, height: 1080 });
        await this.loc.gotitButton?.click().catch(() => { /* Ignore if not present */ });
        // Confirmed live on MZ: the betslip panel doesn't auto-open just because a leg was
        // selected, and Bet Now stays hidden until both the panel is opened (via its "Betslip N"
        // counter button) and the Multi tab is active — the same sequence already established for
        // MW's betslip flow (see BetslipPage.clickMultiTab()). No-op when the panel is already open.
        if (!(await this.loc.betNowButton.isVisible().catch(() => false))) {
            await this.loc.betslipCounter.click({ timeout: 5000 }).catch(() => { });
            await this.loc.multipleBetsButton.click({ timeout: 5000 }).catch(() => { });
            await this.page.waitForTimeout(500);
        }
        await this.loc.betNowButton.scrollIntoViewIfNeeded();
        await this.loc.betNowButton.click();
        await this.page.waitForTimeout(3000);
        await this.closePopupIfVisible();
    }

    // --- Methods for Page Interactions ---

    /**
     * Clicks `locator`, dismissing a promotional popup that appears in between retries. Confirmed
     * live on MZ: a promotional interstitial (its own dedicated close button) can layer on top of
     * an already-open panel on a delay and intercept clicks meant for the panel's own content.
     * Closes only the LAST (topmost, most-recently-mounted) `#modal-close-btn` match — the panel
     * itself was already open before any promo layered on top of it, so its own close button is
     * never the last match, and clicking it here would incorrectly close the panel we're using.
     */
    private async clickDismissingPromo(locator: Locator, attempts = 4) {
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

    async clickTransactionTab(tabName: string) {
        const tabLocator = this.loc[tabName];
        await this.clickDismissingPromo(tabLocator);
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
        await this.clickDismissingPromo(this.loc.exportBtn);
        await this.page.waitForTimeout(1000);
    }

    async openTransactionDetailView() {
        await this.clickDismissingPromo(this.loc.transactionDetailView);
        await this.page.waitForTimeout(1000);
    }

    async clickDetailViewBackButton() {
        await this.page.waitForTimeout(2000);
        await this.clickDismissingPromo(this.loc.detailViewBackButton);
        await this.page.waitForTimeout(1000);
    }

    async openFirstTransactionBetslip() {
        await this.clickDismissingPromo(this.loc.transactionIDButton);
        await this.page.waitForTimeout(1000);
    }

    async clickBetslipBackButton() {
        await this.page.waitForTimeout(1000);
        await this.clickDismissingPromo(this.loc.betslipBackButton);
        await this.page.waitForTimeout(1000);
    }
}
