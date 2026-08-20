import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';
import { SafeActions } from '../actions/SafeActions';
import { css, role, text, first } from '../locators/sel';
import { highlightElements } from '../flows/HighlightElements';

export class MyBetsPage extends BasePage {
    constructor(page: Page, safeActions: SafeActions) {
        super(page, safeActions);

        this.loc = { ...this.loc, ...this.build('myBets', {
            closePromotionPopup: css('#modal-close-btn'),
            mobileInput: first(role('textbox', { name: 'Mobile Number' })),
            passwordInput: first(role('textbox', { name: 'Enter Password' })),
            myBetsButton: first(text('My Bets')),
            openBetsTab: first(text('Open Bets')),
            settledBetsTab: first(text('Settled Bets')),
            categoryDropdown: first(text('Sports', { exact: true })),
            betgamesOption: (root) => root.getByLabel('Betgames').getByText('Betgames'),
            luckyNumbersOption: (root) => root.getByLabel('Lucky Numbers').getByText('Lucky Numbers'),
            jackpotsOption: (root) => root.getByLabel('Betway Jackpots').getByText('Betway Jackpots'),
            toteOption: first(text('Tote', { exact: true })),
            filterDropdown: first(text('All', { exact: true })),
            cashoutOption: first(text('Cashout')),
            winOption: first(text('Win', { exact: true })),
            lossOption: (root) => root.getByLabel('Loss').getByText('Loss'),
            searchBox: first(role('textbox', { name: 'Search bets...' })),
            detailViewButton: first(text('Detail View')),
            detailViewContainer: (root) => root.locator('xpath=//*[@id="my-bets-container"]/div[3]/div[1]/div[2]'),
            shareButton: first(css('.cursor-pointer.w-5.h-5.rounded')),
            placeBetButton: first(role('button', { name: 'Bet Now' })),
            editBetButton: first(text('Edit', { exact: true })),
            editBetCheckbox: (root) => root.locator('xpath=/html/body/div[20]/div/div[2]/div/div[1]/div/div[1]'),
            editContinueButton: first(role('button', { name: 'Continue' })),
            editCancelButton: first(role('button', { name: 'Cancel' })),
            cashoutButton: first(text('Cashout')),
            cashoutConfirmButton: first(role('button', { name: 'Cashout' })),
            cashoutSuccessMessage: first(text('You have successfully cashed out')),
            hideLossesToggle: first(css('#my-bets-container div label span')),
            paginationNext: first(css('#transaction-history-next')),
        }) };
    }

    // ------------------------------------------------------------------
    // 1. Navigation & Login
    // ------------------------------------------------------------------

    async gotoSports() {
        await this.goto();
    }

    // login()/Login() are inherited from BasePage

    // ------------------------------------------------------------------
    // 2. Main Actions
    // ------------------------------------------------------------------

    async clickMyBets() {
        await this.loc.myBetsButton.click();
    }

    async clickOpenBetsTab() {
        await this.loc.openBetsTab.click();
    }

    async clickSettledBetsTab() {
        await this.loc.settledBetsTab.click();
    }

    async selectCategory(categoryName: 'Betgames' | 'Betway Jackpots' | 'Jackpots' | 'Tote' | 'Sports') {
        const currentDropdown = this.loc.categoryDropdown;

        switch (categoryName) {
            case 'Betgames':
                await currentDropdown.click();
                await this.loc.betgamesOption.click();
                break;
            case 'Betway Jackpots':
                await this.loc.betgamesOption.click(); // Click previous to open
                await this.loc.luckyNumbersOption.click();
                break;
            case 'Jackpots':
                await this.loc.luckyNumbersOption.click(); // Click previous to open
                await this.loc.jackpotsOption.click();
                break;
            // case 'Tote':
            //     await this.loc.jackpotsOption.click(); // Click previous to open
            //     await this.loc.toteOption.click();
            //     break;
            case 'Sports':
                await this.loc.toteOption.click(); // Click previous to open
                await this.loc.categoryDropdown.click(); // 'categoryDropdown' is 'Sports'
                break;
        }
        await this.page.waitForTimeout(1000);
    }

    async selectFilter(filterName: 'All' | 'Cashout' | 'Win' | 'Loss') {
        const currentDropdown = this.loc.filterDropdown;

        switch (filterName) {
            case 'All':
                await currentDropdown.click();
                break;
            case 'Cashout':
                await currentDropdown.click();
                await this.loc.cashoutOption.click();
                break;
            case 'Win':
                await this.loc.cashoutOption.click(); // Click previous to open
                await this.loc.winOption.click();
                break;
            case 'Loss':
                await this.loc.winOption.click(); // Click previous to open
                await this.loc.lossOption.click();
                break;
        }
        await this.page.waitForTimeout(1000);
    }

    async searchFor(term: string) {
        await this.loc.searchBox.fill(term);
        await this.loc.searchBox.press('Enter');
        await this.page.waitForTimeout(3000);
    }

    async clickDetailView(index = 0) {
        await this.loc.detailViewButton.nth(index).click();
        await this.page.waitForTimeout(1000);
    }

    async clickShare(index = 0) {
        await this.loc.shareButton.nth(index).click();
    }

    async placeBet() {
        await this.loc.placeBetButton.click();
        await this.page.waitForTimeout(1000);
    }

    async performEditBetFlow(action: 'continue' | 'cancel', checkboxIndex = 0) {
        await this.clickDetailView(0);
        await this.loc.editBetButton.click();
        await this.page.waitForTimeout(800);

        await this.loc.editBetCheckbox.nth(checkboxIndex).click({ force: true });
        await this.page.waitForTimeout(500);

        if (action === 'continue') {
            await this.loc.editContinueButton.click();
        } else {
            await this.loc.editCancelButton.click();
        }
        await this.page.waitForTimeout(1000);
    }

    async attemptCashout(action: 'confirm' | 'cancel', index = 0) {
        await this.clickDetailView(index);
        await this.loc.cashoutButton.nth(index).click();
        await this.page.waitForTimeout(800);
        await this.loc.cashoutConfirmButton.click();

        if (action === 'confirm') {
            await this.loc.cashoutConfirmButton.click();
        } else {
            // No "Cancel" button in this flow, clicking confirm to proceed
            // A real "Cancel" would be `this.page.getByRole('button', { name: 'Cancel' }).click();`
            await this.loc.cashoutConfirmButton.click();
        }
        await this.page.waitForTimeout(800);
    }

    async toggleHideLosses() {
        await this.loc.hideLossesToggle.click();
        await this.page.waitForTimeout(5000);
    }

    async clickNextPage() {
        await this.loc.paginationNext.click();
    }

    // ------------------------------------------------------------------
    // 3. Highlight & Accessor (Get) Methods
    // ------------------------------------------------------------------

    async highlightOpenBetsTab() {
        await highlightElements(this.loc.openBetsTab);
    }

    async highlightSettledBetsTab() {
        await highlightElements(this.loc.settledBetsTab);
    }

    async highlightSearchBox() {
        await highlightElements(this.loc.searchBox);
    }

    async highlightDetailViewContainer(index = 0) {
        await highlightElements(this.loc.detailViewContainer.nth(index));
    }

    async highlightCashoutSuccess() {
        await highlightElements(this.loc.cashoutSuccessMessage);
    }

    async highlightHideLossesToggle() {
        await highlightElements(this.loc.hideLossesToggle);
    }

    getOpenBetsTab(): Locator {
        return this.loc.openBetsTab;
    }

    getSettledBetsTab(): Locator {
        return this.loc.settledBetsTab;
    }

    getCashoutSuccessMessage(): Locator {
        return this.loc.cashoutSuccessMessage;
    }

    async closePromotionPopup() {
        await this.loc.closePromotionPopup.click();
    }
}
