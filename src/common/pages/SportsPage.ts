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
        await this.page.getByText('Log out').click();
        await this.page.getByRole('button', { name: 'Proceed' }).click();
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
}
