import { Page } from '@playwright/test';
import { SportsPage } from './SportsPage';
import { SafeActions } from '../actions/SafeActions';
import { css, role, first } from '../locators/sel';

/**
 * Same situation as VirtualsPage: the old repo's import of `loadLocatorsFromExcel` from
 * `tests/modules/footer/excelReader` never resolved to a real export (that file's contents are
 * entirely commented out), and no smoke test ever requests the `betgamesPage`/`betGamesPage`
 * fixture. The real "BetGamesPage" sheet does exist in `locators(2).xlsx` — used directly here.
 */
export class BetGamesPage extends SportsPage {
    constructor(page: Page, safeActions: SafeActions) {
        super(page, safeActions);

        const inherited = this.loc;
        this.loc = { ...inherited, ...this.build('betGames', {
            // Source Excel role is "input", not a valid ARIA role (same bug as
            // CasinoPage.searchBox / VirtualsPage.searchBox) — preserved verbatim.
            searchBox: first(role('input' as any, { name: 'Search' })),
            playButton: first(role('button', { name: 'Play' })),
            favouriteGames: first(css('a[aria-label="Favourite Game"]')),
        }) };
    }

    async gotoBetgames() {
        await this.goto('/lobby/betgames');
    }

    async searchgame(gameName: string) {
        await this.loc.searchBox.fill(gameName);
        await this.page.keyboard.press('Enter');
        await this.page.waitForTimeout(2000);
    }

    async playGame(gameName: string) {
        await this.page.getByText(gameName).first().hover();
        await this.page.getByText('Play').first().click();
        await this.loc.formMobileInput.waitFor({ state: 'visible', timeout: 15000 });
    }

    async FavouriteGame() {
        await this.loc.favouriteGames.click();
        await this.page.waitForLoadState('domcontentloaded');
    }
}
