import type { test as BetwayTest } from '../fixtures/betwayFixture';
import { expect } from '@playwright/test';
import { ScreenshotHelper } from '../flows/ScreenshotHelper';

// New module: the main Sports Grid page (/sport/soccer) — A-Z Sports panel, sport icon strip,
// Live/Highlights/Upcoming/Outrights tabs, Top Leagues quick-filter chips, the Leagues filter
// panel, and team/league search — had zero test coverage. SportsPage's pre-existing locators were
// all confirmed-broken carryovers from the old Excel-driven repo (see SportsPage.ts's class-level
// comment) and were never wired into any suite. Every behavior below was confirmed live on GH
// before being written here.
//
// Confirmed live href for every sport in the A-Z Sports panel (source of truth for T2 below — not
// derived/guessed slugs, each one was actually clicked and the resulting URL recorded):
const SPORT_HREFS: Record<string, string> = {
    'American Football': '/sport/american-football/highlights',
    'Basketball': '/sport/basketball/highlights',
    'Boxing': '/sport/boxing/highlights',
    'Baseball': '/sport/baseball/highlights',
    'Cricket': '/sport/cricket/highlights',
    'Darts': '/sport/darts/highlights',
    'Formula 1': '/sport/formula-1/outrights',
    'Futsal': '/sport/futsal/highlights',
    'Golf': '/sport/golf/outrights',
    'Handball': '/sport/handball/highlights',
    'Ice Hockey': '/sport/ice-hockey/highlights',
    'Rugby': '/sport/rugby-union/highlights',
    'Soccer': '/sport/soccer/highlights',
    'Table Tennis': '/sport/table-tennis/highlights',
    'Volleyball': '/sport/volleyball/highlights',
    'Water Polo': '/sport/water-polo/highlights',
};

export function runSportsGridSuite(test: typeof BetwayTest, screenshotDir: string) {
    test.describe('Sports Grid Page Tests', () => {
        // Confirmed live: below the responsive `md` breakpoint, "Search teams or leagues" opens a
        // different, full-screen "Search" modal (still real and functional, just a different DOM
        // shape/copy than the desktop inline dropdown this suite targets) — and this environment's
        // actual window size can render that mobile layout even with `viewport: null` +
        // `--start-maximized`. Same class of responsive-layout issue already worked around
        // elsewhere in this codebase (OddSelection.ts's OddsSelectionAbove) — force a real desktop
        // viewport so every test below hits the same DOM shape that was confirmed live.
        test.beforeEach(async ({ page }) => {
            await page.setViewportSize({ width: 1920, height: 1080 });
        });

        test('T1-Verify A-Z Sports button opens and closes the full sports list panel', async ({ sportsPage, page }, testInfo) => {
            await sportsPage.openAZSportsPanel();
            // "Water Polo" is the last entry in the A-Z list — confirmed only rendered while open.
            await expect(page.getByText('Water Polo', { exact: true })).toBeVisible({ timeout: 10000 });
            await ScreenshotHelper(page, screenshotDir, 'T1-azsports-open', testInfo);

            await sportsPage.openAZSportsPanel(); // same button toggles it closed
            await expect(page.getByText('Water Polo', { exact: true })).toBeHidden({ timeout: 10000 });
            await ScreenshotHelper(page, screenshotDir, 'T1-azsports-closed', testInfo);
        });

        for (const [sportName, expectedPath] of Object.entries(SPORT_HREFS)) {
            test(`T2-Verify "${sportName}" opens its correct page from the A-Z Sports panel`, async ({ sportsPage, page }, testInfo) => {
                await sportsPage.gotoSportsPage();
                await sportsPage.openAZSportsPanel();
                await sportsPage.clickSportInAZPanel(sportName);
                
                await expect(page).toHaveURL(new RegExp(`${expectedPath}$`), { timeout: 15000 });
                await ScreenshotHelper(page, screenshotDir, `T2-sport-${sportName.replace(/\s+/g, '-')}`, testInfo);
            });
        }

        for (const tabName of ['Live', 'Highlights', 'Upcoming', 'Outrights'] as const) {
            test(`T3-Verify the "${tabName}" sports tab navigates correctly`, async ({ sportsPage, page }, testInfo) => {
                await sportsPage.gotoSportsPage();
                await sportsPage.clickSportsTab(tabName);
                await expect(page).toHaveURL(new RegExp(`/sport/soccer/${tabName.toLowerCase()}$`), { timeout: 15000 });
                await ScreenshotHelper(page, screenshotDir, `T3-tab-${tabName}`, testInfo);
            });
        }

        test('T4-Verify clicking a sport icon in the icon strip switches the active sport', async ({ sportsPage, page }, testInfo) => {
            await sportsPage.gotoSportsPage();
            await sportsPage.clickSportIcon('Tennis');
            await expect(page).toHaveURL(/\/sport\/tennis\//, { timeout: 15000 });
            const activeIconGroup = sportsPage.loc.sportIconScroller.locator('button.sports-list-active-item').locator('xpath=..');
            await expect(activeIconGroup).toContainText('Tennis', { timeout: 10000 });
            await ScreenshotHelper(page, screenshotDir, 'T4-sporticon-tennis', testInfo);
        });

        test('T5-Verify a Top Leagues chip filters the grid by that league', async ({ sportsPage, page }, testInfo) => {
            // The Top Leagues set is live-schedule-driven and differs region to region (and over
            // time even for the same region) — confirmed live GH shows "Premier League" but ZM
            // does not, ZM instead showing Championship/Ligue 1/UEFA competitions. Click whichever
            // chip is actually first rather than a hardcoded name.
            await sportsPage.gotoSportsPage();
            await sportsPage.clickFirstTopLeagueChip();
            await expect(page).toHaveURL(/selectedLeagues=/, { timeout: 15000 });
            await ScreenshotHelper(page, screenshotDir, 'T5-topleague-first', testInfo);
        });

        test('T6-Verify the Leagues filter button opens a real checkbox-based filter panel', async ({ sportsPage, page }, testInfo) => {
            await sportsPage.gotoSportsPage();
            const checkboxesBefore = await page.locator('input[type="checkbox"]').count();
            await sportsPage.openLeaguesFilterPanel();
            await expect
                .poll(() => page.locator('input[type="checkbox"]').count(), { timeout: 10000 })
                .toBeGreaterThan(checkboxesBefore);
            await ScreenshotHelper(page, screenshotDir, 'T6-leagues-filter', testInfo);
        });

        test('T7-Verify the team/league search box surfaces clickable suggestions on focus', async ({ sportsPage, page }, testInfo) => {
            await sportsPage.focusTeamOrLeagueSearch();
            // Confirmed live via the accessibility snapshot on a failed run: the real DOM/accessible
            // text is lowercase "popular" — CSS `text-transform: uppercase` only makes it LOOK like
            // "POPULAR" visually, which is why a case-sensitive `exact` match against 'POPULAR'
            // never found it even though every screenshot clearly showed the panel open.
            await expect(page.getByText('popular', { exact: true })).toBeVisible({ timeout: 15000 });
            await ScreenshotHelper(page, screenshotDir, 'T7-search-popular', testInfo);
        });
    });
}
