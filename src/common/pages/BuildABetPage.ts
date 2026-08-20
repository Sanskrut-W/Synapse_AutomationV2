import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';
import { SafeActions } from '../actions/SafeActions';
import { css, role, text, first } from '../locators/sel';
import { highlightElements } from '../flows/HighlightElements';

export class BuildABetPage extends BasePage {
    constructor(page: Page, safeActions: SafeActions) {
        super(page, safeActions);

        this.loc = { ...this.loc, ...this.build('buildABet', {
            mobileInput: first(role('textbox', { name: 'Mobile Number' })),
            passwordInput: first(role('textbox', { name: 'Enter Password' })),
            upcomingTab: first(text('Upcoming', { exact: true })),
            closePromotionPopup: css('#modal-close-btn'),
            firstMatchContainer: first(css('div.flex.flex-row.w-full.gap-1.text-xs')),
            buildABetTab: first(text('Build A Bet')),
            randomMarketButton: first(css('.bg-light-200.dark\\:bg-dark-900.sticky.left-0.z-\\[11\\].md\\:z-10.md\\:pt-2.md\\:-mt-2.top-\\[112px\\].lg\\:top-\\[152px\\].hidden > .bg-dark-800 > .flex.items-center.w-full > div:nth-child(7) > .w-6')),
            infoMessage1x2: first(text('1X2 Bets Can Be Placed By Either Selecting A Home Win, A Draw, Or An Away Win.')),
            infoMessageDoubleChance: first(text('Double Chance Allows You To')),
            infoMessageBothTeamsScore: first(text('Both Teams To Score (GG/NG) Predict Whether Both Teams Will Score At Least One')),
            infoMessageTotalGoals: first(text('Total Goals Predict the Total Number Of Goals In A Match.')),
            favoriteButton: first(css('.w-6.h-6.flex-shrink-0')),
            infoButton: first(css('.w-6.h-6.fill-light-50.prevent-trigger')),
            marketExpandIcon: first(css('.z-10.w-6.h-6.fill-light-50')),
            // oddOver0_5/oddUnder0_5/oddOver1_5 never resolved via their own Excel rows in the old
            // repo — the constructor took the `oddDraw` locator (#more-market-container) as root and
            // chained a hardcoded .getByText(...) on top of it. Preserved exactly: same root, same
            // literal text.
            oddOver0_5: (root) => root.locator('#more-market-container').getByText('Over (0.5)'),
            oddUnder0_5: (root) => root.locator('#more-market-container').getByText('Under (0.5)'),
            oddOver1_5: (root) => root.locator('#more-market-container').getByText('Over (1.5)'),
            oddDraw: css('#more-market-container'),
            // Source Excel options (`hasText`) are never even read by the "css" branch of the old
            // resolver (it only ever calls `page.locator(config.value)`), so they were always inert.
            totalOddsBar: css('.bg-dark-800 div'),
            addToBetslipButton: first(role('button', { name: 'Add to Betslip', exact: true })),
            clearAllButton: first(role('button', { name: 'Clear all', exact: true })),
            selectedOddsScroller: first(css('#build-a-bet-selection-scroller')),
            removeOddIcon: first(css('#build-a-bet-selection-scroller path')),
            invalidCombinationMessage: first(text('This combination is not')),
        }) };
    }

    // 1. Navigation & Setup Methods
    // goto() and Login() are inherited from BasePage

    /**
     * This is the main setup method. It handles all navigation
     * from the sports page to the Build A Bet tab for a match.
     */
    async navigateToBuildABet() {
        await this.loc.upcomingTab.click();

        // This logic finds the first match container to click
        const firstMatch = this.loc.firstMatchContainer.first();
        await firstMatch.waitFor({ state: 'visible', timeout: 10000 });
        await firstMatch.click();

        // Now that we are on the match page, click the "Build A Bet" tab
        await this.loc.buildABetTab.click();
        await this.page.waitForLoadState('domcontentloaded');
    }

    // 2. Action Methods
    async clickRandomMarketButton() {
        await this.loc.randomMarketButton.click();
        await this.page.waitForTimeout(7000); // Wait for action
    }

    async clickFavorite() {
        await this.loc.favoriteButton.click();
    }

    async clickInfo() {
        await this.loc.infoButton.click();
    }

    async expandMarket() {
        await this.loc.marketExpandIcon.click();
    }

    async clickOdd(oddName: 'Over (0.5)' | 'Under (0.5)' | 'Over (1.5)' | 'Draw') {
        switch (oddName) {
            case 'Over (0.5)':
                await this.loc.oddOver0_5.click();
                break;
            case 'Under (0.5)':
                await this.loc.oddUnder0_5.click();
                break;
            case 'Over (1.5)':
                await this.loc.oddOver1_5.click();
                break;
            case 'Draw':
                // This assumes the "Draw" locator is inside the #more-market-container
                await this.loc.oddDraw.getByText('Draw', { exact: true }).first().click();
                break;
        }
    }

    async clickTotalOddsBar() {
        await this.loc.totalOddsBar.click();
    }

    async clickAddToBetslip() {
        await this.loc.addToBetslipButton.click();
    }

    async clickClearAll() {
        await this.loc.clearAllButton.click();
    }

    async clickRemoveOddIcon() {
        await this.loc.removeOddIcon.click();
    }

    // 3. Highlight & Accessor (Get) Methods
    async highlightBuildABetTab() {
        await highlightElements(this.loc.buildABetTab);
    }

    async highlightInfoMessages() {
        await highlightElements(this.loc.infoMessage1x2);
        await highlightElements(this.loc.infoMessageDoubleChance);
        // await highlightElements(this.loc.infoMessageBothTeamsScore);
        await highlightElements(this.loc.infoMessageTotalGoals);
    }

    async highlightFavorite(index = 0) {
        await highlightElements(this.loc.favoriteButton.nth(index));
    }

    async highlightInfo(index = 0) {
        await highlightElements(this.loc.infoButton.nth(index));
    }

    async highlightMarket(index = 0) {
        await highlightElements(this.loc.marketExpandIcon.nth(index));
    }

    async highlightTotalOddsBar() {
        await highlightElements(this.loc.totalOddsBar);
    }

    async highlightAddAndClearButtons() {
        await highlightElements(this.loc.addToBetslipButton);
        await highlightElements(this.loc.clearAllButton);
    }

    async highlightSelectedOddsScroller() {
        await highlightElements(this.loc.selectedOddsScroller);
    }

    async highlightRemoveOddIcon() {
        await highlightElements(this.loc.removeOddIcon);
    }

    async highlightInvalidCombinationMessage() {
        await highlightElements(this.loc.invalidCombinationMessage);
    }

    getInvalidCombinationMessage(): Locator {
        return this.loc.invalidCombinationMessage;
    }
}
