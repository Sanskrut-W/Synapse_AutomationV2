import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';
import { SafeActions } from '../actions/SafeActions';
import { css, role, text, first, within } from '../locators/sel';
import { highlightElements } from '../flows/HighlightElements';
import { activeRegion } from '../config/oddsApiUrl';

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
            // Confirmed live on NG: unscoped, `first(text('Sports', {exact:true}))` does NOT
            // resolve to the modal's own category dropdown at all — NG's page carries an SEO/
            // help-content block ("How to Place a Football Bet": "Go to the **Sports** section
            // and select **Football**") whose bolded "Sports" sits earlier in the DOM than the My
            // Bets modal, so .first() matched that background text instead. Because it sits behind
            // the modal's full-screen overlay, every click on it was blocked ("... subtree
            // intercepts pointer events"), looping until the 60s action timeout — this was T5's
            // real failure, not a popup or an empty-account state. Scoping to the modal's own
            // `#my-bets-container` (already used below by detailViewContainer/hideLossesToggle)
            // resolves to the real in-modal label and clicks cleanly — verified live via a
            // standalone script.
            categoryDropdown: within(css('#my-bets-container'), first(text('Sports', { exact: true }))),
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
        // Confirmed live on NG: a delayed marketing/promo interstitial (an "EPL Leaderboard" toast
        // — same #modal-close-btn every generic modal in this flow reuses, see BasePage's own
        // comment on that id) can appear well after goto()/Login() already ran their own dismissal
        // window, sitting on top as a fixed, full-screen overlay and intercepting the click on
        // myBetsButton ("... subtree intercepts pointer events") until the action times out.
        // BasePage's closePromotionPopupIfVisible() already exists for exactly this (safe no-op
        // when nothing is showing) but was previously only invoked right after goto()/Login() —
        // call it once more here, at the point this was actually observed live blocking My Bets.
        await this.closePromotionPopupIfVisible(3000);
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

        if (activeRegion() === 'GH') {
            // Confirmed live: GH's dropdown has only 3 options — Sports, Betgames, Betway Jackpots
            // — no Lucky Numbers or Tote at all, so the ZA-style 5-option cascade (which clicks
            // through Lucky Numbers/Tote as intermediate "reopen" anchors) doesn't apply here.
            switch (categoryName) {
                case 'Betgames':
                    await currentDropdown.click();
                    await this.loc.betgamesOption.click();
                    break;
                case 'Betway Jackpots':
                    await this.loc.betgamesOption.click(); // Betgames is the current label — click to reopen
                    await this.loc.jackpotsOption.click();
                    break;
                case 'Sports':
                    await this.loc.jackpotsOption.click(); // Betway Jackpots is the current label — click to reopen
                    await this.loc.categoryDropdown.click();
                    break;
                default:
                    // 'Jackpots'/'Tote' don't apply as distinct GH categories.
                    break;
            }
            await this.page.waitForTimeout(1000);
            return;
        }

        switch (categoryName) {
            case 'Betgames':
                await currentDropdown.click();
                await this.loc.betgamesOption.click();
                break;
            case 'Betway Jackpots':
                // Confirmed live on NG: this ended on `luckyNumbersOption.click()` — which selects
                // "Lucky Numbers", not "Betway Jackpots". `jackpotsOption` (getByLabel('Betway
                // Jackpots')) already existed as a loc entry and is the correct target; it just
                // wasn't being used here. Live-reproduced via the T5 test hanging on
                // getByLabel('Lucky Numbers') afterwards in the 'Sports' case below (which assumed,
                // consistent with this same bug, that "Lucky Numbers" was the current label). This
                // branch runs for every non-GH region T5 executes against (NG/ZA/ZM/MW/BW/MZ), not
                // just NG.
                await this.loc.betgamesOption.click(); // Betgames is the current label — click to reopen
                await this.loc.jackpotsOption.click();
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
                // Confirmed live on NG: now that 'Betway Jackpots' above correctly ends on
                // "Betway Jackpots" (see that case's own comment), the current label entering this
                // case is "Betway Jackpots" — reopen via jackpotsOption, not luckyNumbersOption.
                await this.loc.jackpotsOption.click(); // Betway Jackpots is the current label — click to reopen
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

    // Confirmed live on NG: with too few Settled Bets to fill a second page (the shared demo
    // account can even have zero), the "Next" control stays in the DOM but renders with
    // `pointer-events-none opacity-50` classes rather than a real `disabled` attribute/aria-disabled
    // — so Playwright sees it as visible/enabled/stable and retries the click forever ("... intercepts
    // pointer events") until the action timeout, since it structurally can never receive a pointer
    // event. Check the CSS-disabled state up front instead of clicking blind.
    async isNextPageDisabled(): Promise<boolean> {
        const classAttr = await this.loc.paginationNext.getAttribute('class').catch(() => null);
        return !!classAttr && classAttr.includes('pointer-events-none');
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
