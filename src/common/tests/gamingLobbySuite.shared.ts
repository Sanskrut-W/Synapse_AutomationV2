import type { test as BetwayTest } from '../fixtures/betwayFixture';

export function runGamingLobbySuite(test: typeof BetwayTest, screenshotDir: string) {
    test.describe('GamingLobby Tests', () => {

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
        // Re-verified live (2026-09-07): "Most Liked" now matches 5 elements (was a strict-mode
        // violation on click) — fixed via .first() in GamingLobbyPage.selectFilter().
        test('Casino: T4 Filter.', async ({ gamingLobbyPage }, testInfo) => {
            await gamingLobbyPage.navigateToVertical('casinoGames');
            await gamingLobbyPage.selectFilter('mostLikedFilter');
            await gamingLobbyPage.takeScreenshot(screenshotDir, 'T4-Casino', testInfo);
        });
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
        // Confirmed live (2026-09-07): "BetGames" and "Virtuals" no longer exist as their own
        // top-level gaming-lobby verticals — the live nav now only has Casino / Slots / Crash /
        // Live Casino / Quick Games. A live scan of all 142 lobby links found no navigable
        // "Virtuals" entry point anywhere, and the one surviving "/lobby/betgames" link is inert
        // (force-clicking it doesn't navigate — it reads as leftover/unlinked, not a real nav
        // item). This is a platform-wide lobby restructuring, not a per-test locator problem, so
        // every test in both sections (already-active ones included, not just the TODO-flagged
        // Promotions/Filter ones) is skipped here rather than chased individually.
        test.describe('BetGames Tests', () => {
            test.beforeEach(async () => {
                test.skip(true, 'BetGames is no longer a navigable top-level gaming-lobby vertical on the live site');
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
        // See the BetGames section above — same confirmed-live vertical removal applies here.
        test.describe('Virtuals Tests', () => {
            test.beforeEach(async () => {
                test.skip(true, 'Virtuals is no longer a navigable top-level gaming-lobby vertical on the live site');
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
            test('Virtuals: T3 Search.', async ({ gamingLobbyPage }, testInfo) => {
                await gamingLobbyPage.navigateToVertical('virtuals');
                await gamingLobbyPage.searchGame('soccer');
                await gamingLobbyPage.captureScreenshot('casinoSearch', screenshotDir, 'T3-Virtuals', testInfo);
            });
            // TODO: fix — failing in ZA smoke run (2026-07-07, ~59.7s). Commented out temporarily.
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
