import { Page } from '@playwright/test';
import { HeaderPage } from './HeaderPage';
import { SafeActions } from '../actions/SafeActions';
import { css, role, text, xpath } from '../locators/sel';
import { highlightElements } from '../flows/HighlightElements';
import { ScreenshotHelper } from '../flows/ScreenshotHelper';
import { loadRegionData } from '../config/regionData';

const userData = loadRegionData('json-data/userData.json');

export class GamingLobbyPage extends HeaderPage {
    constructor(page: Page, safeActions: SafeActions) {
        super(page, safeActions);

        const inherited = this.loc;
        this.loc = { ...inherited, ...this.build('gamingLobby', {
            mobileNumber: role('textbox', { name: 'Mobile Number' }),
            password: role('textbox', { name: 'Enter Password' }),
            loginButton: role('button', { name: 'Login' }),
            Aviator: css("a[href='/lobby/Casino/featured/Aviator']"),
            loginInPopup: css('#login-mobile'),
            passwordInPopup: css('#login-password'),
            submitInPopup: css("button[aria-label='Login'][type='submit']"),
            myBetTabSelector: xpath('//*[@class="tab ng-star-inserted"]'),
            frameSelector: css('iframe[id*="lobby_game"]'),
            betNowButtonSelector: xpath('//*[@class="btn btn-success bet ng-star-inserted"]'),
            // Source Excel options were `{hasText: true}` — not a valid getByText() option (that's
            // a .filter() key), so it was ignored at runtime; these resolve as plain getByText().
            // casinoGames specifically was `text('Casino')`, which on the live site now also
            // matches unrelated promo copy ("Take your crash game wins...") -> strict-mode
            // violation confirmed by a live run. Scoped to the actual nav link's href instead,
            // matching the pattern already used for betGames/virtuals below.
            casinoGames: css("a[href='/lobby/casino-games']"),
            promotionsInCasino: xpath("//img[@alt='/Betway/South-Africa/SA_Hacksaw_LeBandit_DeulAtDawn_NewGames/']"),
            casinoSearch: css('#casino-search'),
            mostLikedFilter: text('Most Liked'),
            // FIXED (was a positional xpath, '//*[@id="tab"]/div/.../div[1]', confirmed 0 live
            // matches after a lobby layout change). Confirmed live: every game tile wraps a real,
            // stable `a[href*="/lobby/casino-games/game/"]` Play link — anchoring on the first one's
            // container div is robust to layout/position changes in a way an absolute xpath isn't.
            gameDiv: (root) => root.locator('a[href*="/lobby/casino-games/game/"]').first().locator('xpath=ancestor::div[1]'),
            playButton: text('Play'),
            favouriteButton: role('button', { name: 'Favourite Game' }),
            betGames: css("a[href='/lobby/betgames']"),
            promotionsInBetGames: role('img', { name: '/Betway/South-Africa/Betgames_New_Lobby_Skyward/' }),
            betGamesFilter: css("a[href='/lobby/betgames/betgames'].flex.gap-2.items-center"),
            gameDivBetGames: xpath('//*[@id="tab"]/div/div[3]/div/div[2]/div/div/div[1]/div[1]/div[1]'),
            virtuals: text('Virtuals'),
            closePopup: css('#modal-close-btn'),
            promotionsInVirtuals: role('img', { name: '/Betway/South-Africa/Virtuals-_New_Lobby_PlatHounds/' }),
            trendingFilter: text('Trending', { exact: true }),
            logOut: css('#Log\\ Out-hamburger-menu-btn'),
            gameDivVirtuals: xpath('//*[@id="tab"]/div/div[3]/div/div[2]/div/div/div[1]/div[1]'),
        }) };
    }

    // goto() and Login() are inherited from BasePage (via HeaderPage)

    async navigateToVertical(verticalKey: string) {
        await this.loc[verticalKey].click();
    }

    async searchGame(term: string) {
        await this.loc.casinoSearch.click();
        await this.loc.casinoSearch.fill(term);
    }

    async selectFilter(filterKey: string) {
        // Confirmed live: "Most Liked" now matches 5 elements (repeated across sections/carousels),
        // a strict-mode violation on a bare .click() — .first() is the real, clickable nav filter.
        await this.loc[filterKey].first().click();
    }

    async launchGame(gameDivKey: string) {
        await this.loc[gameDivKey].first().hover();
        await this.loc.playButton.first().waitFor({ state: 'visible' });
        await this.loc.playButton.first().click({ force: true });
    }

    async toggleFavourite() {
        await this.loc.favouriteButton.first().click();
    }

    async clickVisiblePromotion(promoKey: string) {
        const promo = this.loc[promoKey].filter({ visible: true });
        await promo.waitFor({ state: 'visible', timeout: 30000 });
        await promo.click({ force: true });
        await this.page.waitForTimeout(3000);
    }

    async triggerLoginPopupViaAction(actionType: 'play' | 'favourite', gameDivKey?: string) {
        if (actionType === 'play' && gameDivKey) {
            await this.loc[gameDivKey].first().hover();
            await this.loc.playButton.first().click();
        } else {
            await this.loc.favouriteButton.first().click();
        }
    }

    // --- Core Flows ---

    async LogOut() {
        // Only attempt logout if Deposit is visible (logged in state)
        if (await this.page.getByRole('button', { name: 'Deposit' }).isVisible()) {
            await this.loc.hamburgerMenu.click();
            await this.loc.logOut.click();
            await this.page.getByRole('button', { name: 'Proceed' }).click();
        }
    }

    async loginToAviator() {
        await this.safeActions.safeFill('loginInPopup', this.loc.loginInPopup, userData.user4.mobile);
        await this.safeActions.safeFill('passwordInPopup', this.loc.passwordInPopup, userData.user4.password);
        await this.loc.submitInPopup.click();
    }

    async waitForAviatorVisibility() {
        await this.loc.Aviator.waitFor({ state: 'visible' });
    }

    async clickAviatorAndWaitForLoginPopup() {
        await this.loc.Aviator.click();
        await this.page.waitForTimeout(1000);
    }

    async completeAviatorLoginAndInteractionFlow() {
        await this.loginToAviator();
        await this.loc.closePopup.waitFor({ state: 'visible', timeout: 30000 });
        await this.loc.closePopup.click();
        await this.loc.Aviator.click();
        await this.loc.closePopup.waitFor({ state: 'visible', timeout: 30000 });
        await this.loc.closePopup.click();
        await this.interactWithGameFrame();
    }

    async interactWithGameFrame() {
        await this.loc.Aviator.click();
        const frameSelector = 'iframe[id*="lobby_game"]';
        const gameFrame = this.page.frameLocator(frameSelector);
        await gameFrame.locator('//*[@class="btn btn-success bet ng-star-inserted"]').first().waitFor({ state: 'visible' });
        await gameFrame.locator('//*[@class="btn btn-success bet ng-star-inserted"]').first().click();
        await this.page.waitForTimeout(5000);
        await gameFrame.locator('//*[@class="tab ng-star-inserted"]').first().click();
    }

    // --- Screenshot Helpers ---

    async captureScreenshot(locatorName: string, screenshotDir: string, fileName: string, testInfo: any) {
        const locator = this.loc[locatorName];
        await highlightElements(locator);
        await ScreenshotHelper(this.page, screenshotDir, fileName, testInfo);
    }

    async takeScreenshot(screenshotDir: string, fileName: string, testInfo: any) {
        await ScreenshotHelper(this.page, screenshotDir, fileName, testInfo);
    }
}
