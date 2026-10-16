import { Page } from '@playwright/test';
import { HeaderPage } from './HeaderPage';
import { SafeActions } from '../actions/SafeActions';
import { css, role, text, xpath, withText } from '../locators/sel';
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
            // Confirmed live (2026-09-25): the Casino nav item's href is NOT stable across
            // regions or even over time — BW is '/lobby/casino/all', GH/NG are '/lobby/casino',
            // ZA is '/lobby/casino-games' (the one this locator used to hardcode, which is why
            // BW/GH/NG all failed here while ZA alone kept passing). A prefix match generalizes
            // across all of them; ZA's sport-page icon strip also has an unrelated
            // '/lobby/casino-games/game/aviator' link with text "aviator", so the exact "casino"
            // text filter is required too, not just the href prefix, to land on the real nav item.
            casinoGames: withText(css('a[href^="/lobby/casino"]'), /^casino$/i),
            promotionsInCasino: xpath("//img[@alt='/Betway/South-Africa/SA_Hacksaw_LeBandit_DeulAtDawn_NewGames/']"),
            casinoSearch: css('#casino-search'),
            mostLikedFilter: text('Most Liked'),
            // FIXED (was a positional xpath, '//*[@id="tab"]/div/.../div[1]', confirmed 0 live
            // matches after a lobby layout change). Confirmed live: every game tile wraps a real,
            // stable Play link — anchoring on the first one's container div is robust to
            // layout/position changes in a way an absolute xpath isn't.
            // Confirmed live (2026-09-25): the Casino vertical has been platform-wide restructured
            // into Crash/Slots/Quick Games/Live Casino sub-tabs on BW/GH/NG (and, separately
            // confirmed, TZ/ZM) — individual game links there are 'a[href*="/lobby/slots/game/"]'
            // or 'a[href*="/lobby/crash/game/"]', NOT the old dedicated
            // '/lobby/casino-games/game/' path, which only ZA still uses. Matching on the shared
            // '/game/' segment under any '/lobby/' path covers both the old (ZA) and new
            // (everywhere else) URL schemes with one locator instead of branching per region.
            gameDiv: (root) => root.locator('a[href*="/lobby/"][href*="/game/"]').first().locator('xpath=ancestor::div[1]'),
            playButton: text('Play'),
            favouriteButton: role('button', { name: 'Favourite Game' }),
            betGames: css("a[href='/lobby/betgames']"),
            promotionsInBetGames: role('img', { name: '/Betway/South-Africa/Betgames_New_Lobby_Skyward/' }),
            betGamesFilter: css("a[href='/lobby/betgames/betgames'].flex.gap-2.items-center"),
            gameDivBetGames: xpath('//*[@id="tab"]/div/div[3]/div/div[2]/div/div/div[1]/div[1]/div[1]'),
            // FIXED (was a bare text('Virtuals'), confirmed live via real smoke runs on ZA and GH
            // to intermittently resolve to 2 elements — a strict-mode violation — because a
            // second "Virtuals" span can mount inside '#sport-games-list-scroller' (a sports-page
            // category/league scroller, unrelated to the gaming lobby nav) once it's had enough
            // time to hydrate; a quick isolated check right after page load only ever saw the one
            // real nav link, which is why this wasn't caught before being wired into live tests.
            // Scoped to the nav item's own href the same way casinoGames is above, since the real
            // link is always some '/lobby/...' path (ZA/GH/NG: '/lobby/virtuals', TZ:
            // '/lobby/virtuals/all', ZM: '/lobby/quick-games/virtuals') and the scroller's
            // duplicate is not an anchor into '/lobby' at all.
            virtuals: withText(css('a[href*="/lobby"]'), /^virtuals$/i),
            closePopup: css('#modal-close-btn'),
            promotionsInVirtuals: role('img', { name: '/Betway/South-Africa/Virtuals-_New_Lobby_PlatHounds/' }),
            trendingFilter: text('Trending', { exact: true }),
            logOut: css('#Log\\ Out-hamburger-menu-btn'),
            // FIXED (was a positional xpath, '//*[@id="tab"]/div/div[3]/...', confirmed 0 live
            // matches — the Virtuals lobby is on the same new Vue/Nuxt layout as Casino's, not the
            // old Angular one that id selector targeted). Confirmed live (2026-10-07): the
            // Virtuals lobby's own game tiles all link under '/game/' paths that do NOT contain
            // "/casino" — the one link that does ('/lobby/casino-games/game/aviator' on ZA,
            // '/lobby/casino/game/...' elsewhere) is a cross-promo banner for a different vertical
            // that happens to render before the real tiles in DOM order, so a bare "first /game/
            // link" match (like the shared gameDiv) would grab the wrong game here.
            gameDivVirtuals: (root) => root.locator('a[href*="/game/"]:not([href*="/casino"])').first().locator('xpath=ancestor::div[1]'),
        }) };
    }

    // goto() and Login() are inherited from BasePage (via HeaderPage)

    async navigateToVertical(verticalKey: string) {
        await this.closePromotionPopupIfVisible(2000);
        await this.loc[verticalKey].click();
    }

    async searchGame(term: string) {
        await this.closePromotionPopupIfVisible(2000);
        await this.loc.casinoSearch.click();
        await this.loc.casinoSearch.fill(term);
    }

    async selectFilter(filterKey: string) {
        // Confirmed live: "Most Liked" now matches 5 elements (repeated across sections/carousels),
        // a strict-mode violation on a bare .click() — .first() is the real, clickable nav filter.
        // Confirmed live on GH (2026-09-25): a recurring promo popup — the same one fixed
        // elsewhere in this codebase, not a one-time thing — can intercept this click for the
        // full actionability timeout. Dismiss first.
        await this.closePromotionPopupIfVisible(2000);
        await this.loc[filterKey].first().click();
    }

    async launchGame(gameDivKey: string) {
        // Same recurring-popup risk as selectFilter() above — confirmed live blocking the hover
        // itself, not just a subsequent click.
        await this.closePromotionPopupIfVisible(2000);
        await this.loc[gameDivKey].first().hover();
        await this.loc.playButton.first().waitFor({ state: 'visible' });
        await this.loc.playButton.first().click({ force: true });
    }

    async toggleFavourite() {
        await this.closePromotionPopupIfVisible(2000);
        await this.loc.favouriteButton.first().click();
    }

    async clickVisiblePromotion(promoKey: string) {
        const promo = this.loc[promoKey].filter({ visible: true });
        await promo.waitFor({ state: 'visible', timeout: 30000 });
        await promo.click({ force: true });
        await this.page.waitForTimeout(3000);
    }

    async triggerLoginPopupViaAction(actionType: 'play' | 'favourite', gameDivKey?: string) {
        await this.closePromotionPopupIfVisible(2000);
        if (actionType === 'play' && gameDivKey) {
            await this.loc[gameDivKey].first().hover();
            await this.loc.playButton.first().click();
        } else {
            await this.loc.favouriteButton.first().click();
        }
    }

    // --- Core Flows ---

    async LogOut() {
        // Only attempt logout if Deposit is visible (logged in state).
        // .first() is load-bearing: getByRole name matching is a substring match, so 'Deposit'
        // also matches the casino tiles’ "Deposit Now" buttons. On GH that is 3 matches and a
        // bare isVisible() throws a strict-mode violation instead of answering the question
        // (confirmed live 2026-10-16, Casino T7). Index 0 is the real header button.
        if (await this.page.getByRole('button', { name: 'Deposit' }).first().isVisible()) {
            await this.loc.hamburgerMenu.click();
            await this.loc.logOut.click();
            // Same overlay interception already confirmed on NG in SportsPage.LogOut(): the
            // confirmation modal lays a notice box over its own full-width Proceed button.
            await this.safeActions.clickThroughOverlay('logOutProceed', this.page.getByRole('button', { name: 'Proceed' }));
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
