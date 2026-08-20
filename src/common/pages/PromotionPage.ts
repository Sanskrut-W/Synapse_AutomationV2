import { Page } from '@playwright/test';
import { SportsPage } from './SportsPage';
import { SafeActions } from '../actions/SafeActions';
import { role } from '../locators/sel';

/**
 * NOTE on locator fidelity: the old repo's PromotionPage constructor pointed at
 * `src/global/utils/file-utils/locators.xlsx` — a file that doesn't exist on disk — so it would
 * have thrown immediately on instantiation. No "PromotionPage" sheet exists in the real
 * `locators(2).xlsx` workbook either (unlike CasinoPage/VirtualPage/BetGamesPage, which do). No
 * currently active or disabled smoke test references `promotionPage` at all (only
 * MasterFixtureFile.ts declares the fixture — Playwright fixtures are lazy, so it's never
 * actually instantiated). `promotionPage` itself doesn't need re-declaring here — SportsPage
 * already builds a real, working `promotionPage` key (role('link', {name:'Promotions'})); this
 * class just inherits it. `mobileInput`/`passwordInput` use the same real values confirmed
 * throughout this codebase (matching BasePage's own hardcoded login fields).
 */
export class PromotionPage extends SportsPage {
    constructor(page: Page, safeActions: SafeActions) {
        super(page, safeActions);

        const inherited = this.loc;
        this.loc = { ...inherited, ...this.build('promotion', {
            mobileInput: role('textbox', { name: 'Mobile Number' }),
            passwordInput: role('textbox', { name: 'Enter Password' }),
        }) };
    }

    async gotoPromotionPages() {
        await this.goto();
        await this.loc.SportButton.click();
        await this.loc.promotionPage.click();
        await this.page.waitForLoadState('domcontentloaded');
    }

    async LoginFromPromotions(mobile: string, password: string) {
        await this.safeActions.safeFill('mobileInput', this.loc.mobileInput, mobile);
        await this.safeActions.safeFill('passwordInput', this.loc.passwordInput, password);
        await this.page.keyboard.press('Enter');
        await this.page.waitForTimeout(3000); // Wait for login to complete
    }
}
