import { Page } from '@playwright/test';
import { LoginPage } from './LoginPage';
import { SafeActions } from '../actions/SafeActions';
import { role } from '../locators/sel';
import { highlightElements } from '../flows/HighlightElements';

export class CasinoPage extends LoginPage {
    constructor(page: Page, safeActions: SafeActions) {
        super(page, safeActions);

        const inherited = this.loc;
        this.loc = { ...inherited, ...this.build('casino', {
            // Source Excel row uses ARIA role "input", which Playwright does not recognize (the
            // real role would be "textbox") — this locator has never actually matched anything.
            // Preserved verbatim (no current test exercises CasinoPage) rather than silently fixed.
            searchBox: role('input' as any, { name: 'Search' }),
            playButton: role('button', { name: 'Play' }),
            // Source value is a literal string, not a real RegExp, despite looking like one — it
            // has never matched a real accessible name either. Preserved verbatim, same reason.
            aviatorLink: role('link', { name: '/the-chicken-game-rr/i' }),
            favouriteGames: role('button', { name: 'Favourite Game' }),
        }) };
    }

    async gotoCasino() {
        await this.goto();
        await this.loc.CasinoButton.click();
        await this.page.waitForLoadState('domcontentloaded');
    }

    async searchgame(gameName: string) {
        await this.loc.searchBox.fill(gameName);
        await this.page.keyboard.press('Enter');
        await this.page.waitForTimeout(2000); // Wait for search results to load
    }

    async playGame(gameName: string) {
        await this.page.getByText(gameName).first().hover();
        await this.page.getByText('Play').first().click();
        await this.page.waitForLoadState('domcontentloaded');
    }

    async FavouriteGame() {
        await this.loc.favouriteGames.first().click();
        await this.loc.formMobileInput.waitFor({ state: 'visible', timeout: 15000 });
        await highlightElements(this.loc.formMobileInput.locator('..').locator('..').locator('..').locator('..'));
    }
}
