import { Page } from '@playwright/test';
import { LoginPage } from './LoginPage';
import { BasePage } from './BasePage';
import { SafeActions } from '../actions/SafeActions';
import { css, role, text, first } from '../locators/sel';
import { highlightElements } from '../flows/HighlightElements';
import { OddsSelection } from '../flows/OddSelection';
import { loadRegionData } from '../config/regionData';

const userData = loadRegionData('json-data/userData.json');

export class SportsPage extends LoginPage {
    constructor(page: Page, safeActions: SafeActions) {
        super(page, safeActions);

        const inherited = this.loc;
        this.loc = { ...inherited, ...this.build('sports', {
            // SportButton overrides LoginPage's own `SportButton` key (text('Sport')) — the
            // more specific class wins, same precedence the old repo got from spreading
            // `...this.LoginPagelocatorsRegistry` first and listing its own keys after.
            //
            // SportButton/live/esports/soccerTote/betwayJackpots below all sourced `hasText` in
            // the Excel `options` cell — not a valid getByRole() option (that's a .filter() key),
            // so Playwright silently ignored it and these resolved unfiltered (first `link` role
            // on the page) at runtime too. Preserved verbatim, same as the LuckyNumbers typo below.
            SportButton: first(role('link')),
            aviator: first(role('link', { name: 'Aviator' })),
            live: first(role('link')),
            esports: first(role('link')),
            soccerTote: first(role('link')),
            betwayJackpots: first(role('link')),
            betgames: first(role('link', { name: 'Betgames' })),
            // Source Excel row has a typo ("namet" instead of "name"), so this never actually
            // filtered by text — it resolved to the first `link` role element on the page.
            // Preserved verbatim rather than silently fixed.
            LuckyNumbers: first(role('link')),
            HorseRacing: first(role('link', { name: 'Horse Racing' })),
            Jetx: first(role('link', { name: 'JetX' })),
            ChickenGame: first(role('link', { name: 'Chicken Game' })),
            OldSite: first(role('link', { name: 'Old Site' })),
            Home: first(role('link', { name: 'Home' })),
            CasinoGames: first(role('link', { name: 'Casino Games' })),
            Virtuals: first(role('link', { name: 'Virtuals' })),
            promotionPage: first(role('link', { name: 'Promotions' })),
            betslip: css('#betslip-container'),
            betslipButton: text('Betslip 0'),
            loginButtonFromBetslip: role('button', { name: 'Login' }),
            betNow: css('#betslip-strike-btn'),
            shareButton: css('#betslip-share-btn'),
            betConfirmation: first(text('Bet Confirmation')),
            bookingCodeMessage: first(text('Booking Code:')),
            enterBookingCodeTextbox: css('#booking-code'),
            modalCloseButton: css('#modal-close-btn'),

            // Hoisted out of LogOut(), which called page.getByText()/getByRole() inline — those
            // bypassed the loc map entirely, so no region could override them. Both definitions
            // are exactly what LogOut() used before, so resolution is unchanged in every region;
            // only the click strategy for logOutProceed differs. See LogOut().
            logOutMenuItem: text('Log out'),
            logOutProceed: role('button', { name: 'Proceed' }),

            // Sports Grid page (the main /sport/soccer listing: A-Z Sports panel, sport icon
            // strip, Live/Highlights/Upcoming/Outrights tabs, Top Leagues chips, league filter,
            // team/league search) — added fresh alongside the keys above rather than reusing them,
            // since every key above is a confirmed-broken carryover (see the class-level comment).
            // Every locator here was confirmed live on GH before being added.
            azSportsButton: text('A-Z Sports', { exact: true }),
            searchTeamsOrLeaguesInput: css('#search-teams-or-leagues'),
            sportsTabsContainer: css('#sports-tabs'),
            topLeaguesScroller: css('#top-events-scroller'),
            sportIconScroller: css('#sport-games-list-scroller'),
            // Confirmed live: this row renders twice (a mobile copy and an `lg:` desktop copy of
            // the same "Leagues"/"Filters" toolbar) — only one is actually visible at a time.
            leaguesFilterButton: (root) => root.getByText('Leagues', { exact: true }).filter({ visible: true }),
        }) };
    }

    // ── Navigation functions ─────────────────────────────────────────────────
    // Sports/betslip branch takes goto() directly from BasePage so it always lands
    // on the sports page, independent of LoginPage's goto.
    async goto(path: string = '/sport/soccer') {
        await BasePage.prototype.goto.call(this, path);
    }

    async gotoSportsPage() {
        await this.goto('/sport/soccer');
    }

    async gotoAviator() {
        await this.page.getByRole('link', { name: 'Aviator' }).first().click();
    }

    // ── Login functions ──────────────────────────────────────────────────────
    async AviatorLoginPopUp() {
        await this.safeActions.safeFill('formMobileInput', this.loc.formMobileInput, userData.user1.mobile);
        await this.safeActions.safeFill('formPasswordInput', this.loc.formPasswordInput, userData.user1.password);
        await this.page.keyboard.press('Enter');
        await this.page.waitForTimeout(2000); // Wait for login to complete
    }

    async AviatorLoginPopUpArgs(mobile: string, password: string) {
        await this.safeActions.safeFill('formMobileInput', this.loc.formMobileInput, mobile);
        await this.safeActions.safeFill('formPasswordInput', this.loc.formPasswordInput, password);
        await this.page.keyboard.press('Enter');
        await this.page.waitForTimeout(2000); // Wait for login to complete
        await this.loc.eyeButton.click();
        await highlightElements(this.loc.formMobileInput);
        await highlightElements(this.loc.formPasswordInput);
    }

    async LogOut() {
        await this.loc.hamburgerMenu.click();
        // await this.page.getByText('All Balances').waitFor({ state: 'visible' });
        await this.loc.logOutMenuItem.click();
        // Confirmed live on NG (betInfluencer T17): the logout confirmation modal lays a notice
        // box over its own full-width "Proceed" button, so a plain .click() is intercepted for
        // the whole 60s actionability timeout and takes the test down with it. The button itself
        // resolves fine and reports visible/enabled/stable — this is purely a hit-test problem,
        // so escalate HOW we click instead of re-querying for a different element.
        await this.safeActions.clickThroughOverlay('logOutProceed', this.loc.logOutProceed);
        await this.loc.loginButton.waitFor({ state: 'visible' });
    }

    async PlaceBets(legsCount: number) {
        await OddsSelection(legsCount, this.page);
        await this.loc.betNow.click();
        const bookingCode = await this.loc.bookingCodeMessage.innerText();
        console.log(bookingCode);
        await this.loc.modalCloseButton.click();
        return bookingCode;
    }

    // ── Sports Grid page ─────────────────────────────────────────────────────
    async openAZSportsPanel() {
        // Same button toggles the panel open and closed — confirmed live. A promo popup can open
        // on top of the page at any point (confirmed live: intercepts this exact click on GH) — a
        // defensive dismiss before clicking avoids that flake, same fix already applied to
        // HeaderPage.clickHamburgerMenu().
        await this.closePromotionPopupIfVisible(2000);
        await this.loc.azSportsButton.first().click();
    }

    async clickSportInAZPanel(sportName: string) {
        // Confirmed live: every sport in the A-Z panel is wrapped in its own <a href="/sport/...">,
        // distinct from the icon strip's plain <button>/<strong> (no <a> there). Scoping to
        // href^="/sport/" (not just hasText) matters on ZA specifically: ZA also has a "soccer
        // tote" promo link (href="/tote/soccer") that a plain hasText:'Soccer' match picks up
        // instead of the real A-Z entry, since it appears earlier in DOM order.
        await this.closePromotionPopupIfVisible(2000);
        await this.page.locator('a[href^="/sport/"]', { hasText: sportName }).first().click();
    }

    async clickSportsTab(tabName: 'Live' | 'Highlights' | 'Upcoming' | 'Outrights') {
        // Confirmed live on TZ: this page can show a recurring promo popup more persistently than
        // other regions — defensive dismiss before every interactive click here, not just the A-Z
        // button, to avoid the same class of interception on any region.
        await this.closePromotionPopupIfVisible(2000);
        await this.loc.sportsTabsContainer.getByText(tabName, { exact: true }).click();
    }

    async clickSportIcon(sportName: string) {
        // Confirmed live: clicking the <strong> label text below the icon is a no-op — the real
        // click target is the <button> itself.
        await this.closePromotionPopupIfVisible(2000);
        await this.loc.sportIconScroller.locator('div', { hasText: sportName }).locator('button').first().click();
    }

    async clickTopLeagueChip(leagueName: string) {
        await this.closePromotionPopupIfVisible(2000);
        await this.loc.topLeaguesScroller.getByText(leagueName, { exact: true }).click();
    }

    // Confirmed live: the Top Leagues chip set is live-schedule-driven, not a fixed per-region
    // list — GH showed "Premier League" but ZM's real list at the same moment was UEFA
    // competitions + Ligue 1 + Championship + Liga Portugal, no Premier League at all. Hardcoding
    // any one league name is fragile across regions AND over time, so tests click whichever chip
    // is actually first instead of a fixed name.
    async clickFirstTopLeagueChip() {
        await this.closePromotionPopupIfVisible(2000);
        await this.loc.topLeaguesScroller.locator('strong').first().click();
    }

    async openLeaguesFilterPanel() {
        await this.closePromotionPopupIfVisible(2000);
        await this.loc.leaguesFilterButton.first().click();
    }

    async focusTeamOrLeagueSearch() {
        await this.closePromotionPopupIfVisible(2000);
        await this.loc.searchTeamsOrLeaguesInput.click();
    }
}
