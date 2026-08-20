import { Page } from '@playwright/test';
import { SportsPage } from './SportsPage';
import { SafeActions } from '../actions/SafeActions';
import { role, first } from '../locators/sel';
import { highlightElements } from '../flows/HighlightElements';

/**
 * NOTE: the old repo's VirtualsPage imported `loadLocatorsFromExcel` from
 * `tests/modules/footer/excelReader` — a file whose entire contents are commented out, so that
 * import didn't even resolve to a real export. Combined with no smoke test ever requesting the
 * `virtualsPage` fixture (Playwright fixtures are lazy), this page has never actually run. The
 * real "VirtualPage" sheet does exist in `locators(2).xlsx` though — values below are sourced
 * from it directly, giving this page a real shot at working now that the broken import is gone.
 */
export class VirtualsPage extends SportsPage {
    constructor(page: Page, safeActions: SafeActions) {
        super(page, safeActions);

        const inherited = this.loc;
        this.loc = { ...inherited, ...this.build('virtuals', {
            // Source Excel role is "input", which Playwright doesn't recognize as a valid ARIA
            // role (the real role would be "textbox") — same bug as CasinoPage.searchBox.
            // Preserved verbatim.
            searchBox: first(role('input' as any, { name: 'Search' })),
            playButton: first(role('button', { name: 'Play' })),
            favouriteGames: first(role('button', { name: 'Favourite Game' })),
            homePage: first(role('link', { name: 'Home' })),
        }) };
    }

    async gotoVirtuals() {
        await this.goto('/lobby/virtuals');
    }

    async searchgame(gameName: string) {
        await this.loc.searchBox.fill(gameName);
        await this.page.keyboard.press('Enter');
        await this.page.waitForTimeout(2000);
    }

    async playGame(gameName: string) {
        await this.page.getByText(gameName).hover();
        await this.page.getByText('Play').first().click();
        await this.loc.formMobileInput.waitFor({ state: 'visible', timeout: 15000 });
    }

    async FavouriteGame() {
        await this.loc.favouriteGames.first().click();
        await this.loc.formMobileInput.waitFor({ state: 'visible', timeout: 15000 });
        await highlightElements(this.loc.formMobileInput.locator('..').locator('..').locator('..').locator('..'));
    }
}
