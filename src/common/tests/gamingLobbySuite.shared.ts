import type { test as BetwayTest } from '../fixtures/betwayFixture';
import { activeRegion } from '../config/oddsApiUrl';

export function runGamingLobbySuite(test: typeof BetwayTest, screenshotDir: string) {
    test.describe('GamingLobby Tests', () => {

        test.beforeEach(async () => {
            // Confirmed live (2026-09-25): MW and MZ have no Casino product at all — no "Casino"
            // nav link anywhere in the header (MW's real nav is Home/Sport/Live/ESports/
            // Promotions; MZ's is Home/Sport/Live/Aviator/Instant Games/Lucky Numbers/Betgames/
            // ESports/Promotions). Same conclusion already reached for these two regions in
            // newHomePageSuite.shared.ts's Casino-CTA checks. Skipping the whole module rather
            // than chasing a feature that isn't there.
            test.skip(['MW', 'MZ'].includes(activeRegion()), 'This region has no Casino product; no gaming lobby to test');
        });

        // AVIATOR SECTION (3 tests combined in 1 flow as per your requirement)
        // TODO: fix — failing in ZA smoke run (2026-07-07, ~2.9m). Commented out temporarily.
        // Investigated live (2026-09-07): the `Aviator` locator's href was stale
        // ('/lobby/Casino/featured/Aviator', 0 matches) — the real link is now
        // 'a[href="/lobby/casino-games/game/aviator"]'. With that fix, presence + click + login
        // popup all confirmed working live. But `interactWithGameFrame()`'s in-iframe locators
        // (the game's own "Bet" button/tab, targeted via absolute xpath) timed out — the
        // third-party game UI inside the iframe appears to have changed too, and unlike the outer
        // page this is a vendor-controlled surface that's much harder to keep verified. Also note
        // the original code has a real bug independent of all this: `waitForAviatorVisibility`
        // is referenced without calling it (missing `()`), a no-op. Leaving disabled rather than
        // shipping a fix that's only 2/3 verified — worth a closer look specifically at the game
        // iframe's current button markup before re-enabling.
        // test('Aviator: T1-T3 Verify Presence, Login Popup, and Game Launch.', async ({ gamingLobbyPage }, testInfo) => {
        //     await gamingLobbyPage.LogOut();
        //     await gamingLobbyPage.waitForAviatorVisibility();
        //     await gamingLobbyPage.captureScreenshot('Aviator', screenshotDir, 'T1-Aviator', testInfo);
        //     await gamingLobbyPage.clickAviatorAndWaitForLoginPopup();
        //     await gamingLobbyPage.captureScreenshot('loginInPopup', screenshotDir, 'T2-Aviator', testInfo);
        //     await gamingLobbyPage.loginToAviator();
        //     await gamingLobbyPage.interactWithGameFrame();
        //     await gamingLobbyPage.takeScreenshot(screenshotDir, 'T3-Aviator', testInfo);
        // });

        // CASINO SECTION (T1 - T8)
        test('Casino: T1 Presence.', async ({ gamingLobbyPage }, testInfo) => {
            await gamingLobbyPage.navigateToVertical('casinoGames');
            await gamingLobbyPage.captureScreenshot('casinoGames', screenshotDir, 'T1-Casino', testInfo);
        });
        // test('Casino: T2 Promotions.', async ({ gamingLobbyPage }, testInfo) => {
        //     await gamingLobbyPage.navigateToVertical('casinoGames');
        //     await gamingLobbyPage.clickVisiblePromotion('promotionsInCasino');
        //     await gamingLobbyPage.takeScreenshot(screenshotDir, 'T2-Casino', testInfo);
        // });
        // Confirmed live (2026-09-07): the casino lobby's search feature has been removed — only 3
        // inputs exist in the entire lobby (a provider-sort checkbox, a date filter, a booking-code
        // field), no search box/searchbox anywhere. Not a locator typo; the feature is gone.
        // test('Casino: T3 Search.', async ({ gamingLobbyPage }, testInfo) => {
        //     await gamingLobbyPage.navigateToVertical('casinoGames');
        //     await gamingLobbyPage.searchGame('hot');
        //     await gamingLobbyPage.captureScreenshot('casinoSearch', screenshotDir, 'T3-Casino', testInfo);
        // });
        // TODO: fix — confirmed live (2026-09-25) that "Most Liked" no longer exists at all for a
        // logged-in user (this test's real, always-logged-in state via the shared fixture); the
        // logged-in Casino lobby instead shows a vertically-stacked, virtualized list of category
        // sections (Trending, Providers, Featured Live, ...) whose ORDER isn't stable between page
        // loads (confirmed: the "first" category icon resolved to "Trending icon" on one load and
        // "providers icon" on the next — a virtualized/recycled list, not a fixed filter bar).
        // Clicking a category row also navigates to that category's own sub-page
        // (e.g. /lobby/casino/providers) rather than filtering in place — this is a genuine lobby
        // redesign (category sub-pages replacing an in-place filter chip bar), not a locator bug,
        // so there's no single stable "select a filter" action left to test here.
        // test('Casino: T4 Filter.', async ({ gamingLobbyPage }, testInfo) => {
        //     await gamingLobbyPage.navigateToVertical('casinoGames');
        //     await gamingLobbyPage.selectFilter('mostLikedFilter');
        //     await gamingLobbyPage.takeScreenshot(screenshotDir, 'T4-Casino', testInfo);
        // });
        test('Casino: T5 Launch Game.', async ({ gamingLobbyPage }, testInfo) => {
            await gamingLobbyPage.navigateToVertical('casinoGames');
            await gamingLobbyPage.launchGame('gameDiv');
            await gamingLobbyPage.takeScreenshot(screenshotDir, 'T5-Casino', testInfo);
        });
        test('Casino: T6 Favourite.', async ({ gamingLobbyPage }, testInfo) => {
            await gamingLobbyPage.navigateToVertical('casinoGames');
            await gamingLobbyPage.toggleFavourite();
            await gamingLobbyPage.takeScreenshot(screenshotDir, 'T6-Casino', testInfo);
        });
        // Re-verified live (2026-09-07): root cause was the dead `gameDiv` positional xpath (fixed
        // in GamingLobbyPage.ts) — confirmed working end-to-end with the corrected locator.
        test('Casino: T7 Play (Logged Out).', async ({ gamingLobbyPage }, testInfo) => {
            await gamingLobbyPage.LogOut();
            await gamingLobbyPage.navigateToVertical('casinoGames');
            await gamingLobbyPage.triggerLoginPopupViaAction('play', 'gameDiv');
            await gamingLobbyPage.takeScreenshot(screenshotDir, 'T7-Casino', testInfo);
        });
        test('Casino: T8 Favourite (Logged Out).', async ({ gamingLobbyPage }, testInfo) => {
            await gamingLobbyPage.LogOut();
            await gamingLobbyPage.navigateToVertical('casinoGames');
            await gamingLobbyPage.triggerLoginPopupViaAction('favourite', 'gameDiv');
            await gamingLobbyPage.takeScreenshot(screenshotDir, 'T8-Casino', testInfo);
        });

        // BETGAMES SECTION (T1 - T8)
        // Re-checked live (2026-10-07), since Virtuals (see below) turned out to have come back
        // after the 2026-09-07 "removed" finding: BetGames has NOT come back the same way.
        // A pre-login scan of GH/NG's homepages still turns up a "/lobby/betgames" link with
        // visible text "Betgames", but after logging in (the same state every test here actually
        // runs in) that link is gone from the page entirely on both regions — it's some kind of
        // logged-out-only promo placement, not a stable nav item, so there's nothing for a
        // logged-in test to click. BW/TZ/ZA/ZM have no "betgame"-href link in any state. Still
        // skipping the whole module rather than chasing a target that isn't reliably there.
        test.describe('BetGames Tests', () => {
            test.beforeEach(async () => {
                test.skip(true, 'BetGames is not a stable, navigable gaming-lobby vertical for a logged-in user on any region (re-confirmed live 2026-10-07)');
            });

            test('BetGames: T1 Presence.', async ({ gamingLobbyPage }, testInfo) => {
                await gamingLobbyPage.navigateToVertical('betGames');
                await gamingLobbyPage.captureScreenshot('betGames', screenshotDir, 'T1-BetGames', testInfo);
            });
            // TODO: fix — failing in ZA smoke run (2026-07-07, ~59.8s). Commented out temporarily.
            // test('BetGames: T2 Promotions.', async ({ gamingLobbyPage }, testInfo) => {
            //     await gamingLobbyPage.navigateToVertical('betGames');
            //     await gamingLobbyPage.clickVisiblePromotion('promotionsInBetGames');
            //     await gamingLobbyPage.takeScreenshot(screenshotDir, 'T2-BetGames', testInfo);
            // });
            test('BetGames: T3 Search.', async ({ gamingLobbyPage }, testInfo) => {
                await gamingLobbyPage.navigateToVertical('betGames');
                await gamingLobbyPage.searchGame('lucky');
                await gamingLobbyPage.captureScreenshot('casinoSearch', screenshotDir, 'T3-BetGames', testInfo);
            });
            test('BetGames: T4 Filter.', async ({ gamingLobbyPage }, testInfo) => {
                await gamingLobbyPage.navigateToVertical('betGames');
                await gamingLobbyPage.selectFilter('betGamesFilter');
                await gamingLobbyPage.takeScreenshot(screenshotDir, 'T4-BetGames', testInfo);
            });
            test('BetGames: T5 Launch.', async ({ gamingLobbyPage }, testInfo) => {
                await gamingLobbyPage.navigateToVertical('betGames');
                await gamingLobbyPage.launchGame('gameDivBetGames');
                await gamingLobbyPage.takeScreenshot(screenshotDir, 'T5-BetGames', testInfo);
            });
            test('BetGames: T6 Favourite.', async ({ gamingLobbyPage }, testInfo) => {
                await gamingLobbyPage.navigateToVertical('betGames');
                await gamingLobbyPage.toggleFavourite();
                await gamingLobbyPage.takeScreenshot(screenshotDir, 'T6-BetGames', testInfo);
            });
            test('BetGames: T7 Play (Logged Out).', async ({ gamingLobbyPage }, testInfo) => {
                await gamingLobbyPage.LogOut();
                await gamingLobbyPage.navigateToVertical('betGames');
                await gamingLobbyPage.triggerLoginPopupViaAction('play', 'gameDivBetGames');
                await gamingLobbyPage.takeScreenshot(screenshotDir, 'T7-BetGames', testInfo);
            });
            test('BetGames: T8 Favourite (Logged Out).', async ({ gamingLobbyPage }, testInfo) => {
                await gamingLobbyPage.LogOut();
                await gamingLobbyPage.navigateToVertical('betGames');
                await gamingLobbyPage.triggerLoginPopupViaAction('favourite', 'gameDivBetGames');
                await gamingLobbyPage.takeScreenshot(screenshotDir, 'T8-BetGames', testInfo);
            });
        });

        // VIRTUALS SECTION (T1 - T8)
        // Re-checked live (2026-10-07): contrary to the 2026-09-07 finding above, Virtuals IS back
        // as a real, stable top-level nav item — confirmed on ZA, GH, NG, TZ and ZM: a single,
        // unambiguous "Virtuals" nav link (no strict-mode risk, 1 exact-text match both logged-in
        // and logged-out), landing on a real lobby with 23-56 game tiles and working favourite
        // buttons on every one of those 5 regions. Only BW has no such link at all (confirmed live:
        // 0 matches for any virtuals-related href or text, logged in or out). MW/MZ never reach
        // this describe block — the outer beforeEach above already skips them (no Casino product).
        test.describe('Virtuals Tests', () => {
            test.beforeEach(async () => {
                test.skip(activeRegion() === 'BW', "BW's lobby has no Virtuals vertical — confirmed live, no /lobby/virtuals (or equivalent) link anywhere on the site");
            });

            test('Virtuals: T1 Presence.', async ({ gamingLobbyPage }, testInfo) => {
                await gamingLobbyPage.navigateToVertical('virtuals');
                await gamingLobbyPage.captureScreenshot('virtuals', screenshotDir, 'T1-Virtuals', testInfo);
            });
            // TODO: fix — failing in ZA smoke run (2026-07-07, ~1.8m). Commented out temporarily.
            // test('Virtuals: T2 Promotions.', async ({ gamingLobbyPage }, testInfo) => {
            //     await gamingLobbyPage.navigateToVertical('virtuals');
            //     await gamingLobbyPage.clickVisiblePromotion('promotionsInVirtuals');
            //     await gamingLobbyPage.takeScreenshot(screenshotDir, 'T2-Virtuals', testInfo);
            // });
            // Confirmed live (2026-10-07) on ZA: the search box on the Virtuals lobby (#casino-search,
            // shared with Casino) is visible and accepts typed input, but typing a real game title
            // ("keno", matching a tile actually on screen) changes nothing — the body's rendered
            // HTML is unchanged byte-for-byte (bar the typed characters in the input's own value)
            // and the game grid stays exactly as before, with no dropdown/results panel appearing
            // either. Same non-functional-search behavior already confirmed for Casino's lobby,
            // just with the input element left in the DOM this time instead of removed outright.
            // test('Virtuals: T3 Search.', async ({ gamingLobbyPage }, testInfo) => {
            //     await gamingLobbyPage.navigateToVertical('virtuals');
            //     await gamingLobbyPage.searchGame('soccer');
            //     await gamingLobbyPage.captureScreenshot('casinoSearch', screenshotDir, 'T3-Virtuals', testInfo);
            // });
            // TODO: fix — failing in ZA smoke run (2026-07-07, ~59.7s), predating the vertical-
            // removal/restore cycle above; not yet re-verified against the current live Trending/
            // Horses sidebar layout. Leaving disabled rather than re-enabling an unverified fix.
            // test('Virtuals: T4 Filter.', async ({ gamingLobbyPage }, testInfo) => {
            //     await gamingLobbyPage.navigateToVertical('virtuals');
            //     await gamingLobbyPage.selectFilter('trendingFilter');
            //     await gamingLobbyPage.takeScreenshot(screenshotDir, 'T4-Virtuals', testInfo);
            // });
            test('Virtuals: T5 Launch.', async ({ gamingLobbyPage }, testInfo) => {
                await gamingLobbyPage.navigateToVertical('virtuals');
                await gamingLobbyPage.launchGame('gameDivVirtuals');
                await gamingLobbyPage.takeScreenshot(screenshotDir, 'T5-Virtuals', testInfo);
            });
            test('Virtuals: T6 Favourite.', async ({ gamingLobbyPage }, testInfo) => {
                await gamingLobbyPage.navigateToVertical('virtuals');
                await gamingLobbyPage.toggleFavourite();
                await gamingLobbyPage.takeScreenshot(screenshotDir, 'T6-Virtuals', testInfo);
            });
            test('Virtuals: T7 Play (Logged Out).', async ({ gamingLobbyPage }, testInfo) => {
                await gamingLobbyPage.LogOut();
                await gamingLobbyPage.navigateToVertical('virtuals');
                await gamingLobbyPage.triggerLoginPopupViaAction('play', 'gameDivVirtuals');
                await gamingLobbyPage.takeScreenshot(screenshotDir, 'T7-Virtuals', testInfo);
            });
            test('Virtuals: T8 Favourite (Logged Out).', async ({ gamingLobbyPage }, testInfo) => {
                await gamingLobbyPage.LogOut();
                await gamingLobbyPage.navigateToVertical('virtuals');
                await gamingLobbyPage.triggerLoginPopupViaAction('favourite', 'gameDivVirtuals');
                await gamingLobbyPage.takeScreenshot(screenshotDir, 'T8-Virtuals', testInfo);
            });
        });
    });
}
