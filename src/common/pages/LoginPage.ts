import { expect, Page } from '@playwright/test';
import { HomePage } from './HomePage';
import { SafeActions } from '../actions/SafeActions';
import { css, role, text, at } from '../locators/sel';
import { highlightElementBorder, highlightElements } from '../flows/HighlightElements';
import { loadRegionData } from '../config/regionData';
import { activeRegion } from '../config/oddsApiUrl';

const userData = loadRegionData('json-data/userData.json');
const apidata = loadRegionData('apis/Sign-upPage/api.json')[0];

export class LoginPage extends HomePage {
    constructor(page: Page, safeActions: SafeActions) {
        super(page, safeActions);

        // Merge HomePage's already-resolved locators (set by super() above) with this class's own —
        // build() only ever takes unresolved Sel functions, so the merge happens after resolution,
        // not before (unlike the old repo's `{...this.HomePagelocatorsRegistry, mobileInput: ...}`
        // pattern, which could spread already-resolved Locators directly).
        const inherited = this.loc;
        this.loc = { ...inherited, ...this.build('login', {
            mobileInput: role('textbox', { name: 'Mobile Number' }),
            formPasswordInput: at(role('textbox', { name: 'Password' }), 1),
            passwordInput: role('textbox', { name: 'Password' }),
            formMobileInput: at(role('textbox', { name: 'Mobile Number' }), 1),
            loginButton: css('#login-btn'),
            // Same locator both these keys share in the old repo: a 2nd "Login"-named button that
            // doesn't actually exist in the hamburger drawer — see clickLoginButtonFromHamburger()
            // and the specs that call it, which are disabled everywhere for exactly this reason.
            hamburgerloginButton: at(role('button', { name: 'Login' }), 1),
            signUpButton: css('#sign-up-btn'),
            hamburgerMenu: css('#header-hamburger-btn'),
            SportButton: text('Sport'),
            CasinoButton: text('Casino'),
            signUpButtonfromHamburger: at(role('button', { name: 'Sign Up' }), 1),
            loginButtonFromPopup: at(role('button', { name: 'Login' }), 1),
            welcomeUser: text('Welcome'),
            betInfluencer: text('Bet Influencer'),
        }) };
        this.loc.eyeButton = this.loc.formPasswordInput.locator('..').getByRole('img').first();
    }

    // ── Verify presence functions ────────────────────────────────────────────
    async verifyLoginWindow() {
        await this.loc.formMobileInput.waitFor({ state: 'visible', timeout: 15000 });
        await highlightElements(this.loc.formMobileInput.locator('..').locator('..').locator('..').locator('..'));
    }

    async verifyHamburgerLoginButton() {
        await this.loc.hamburgerloginButton.waitFor({ state: 'visible', timeout: 15000 });
        await highlightElements(this.loc.hamburgerloginButton);
    }

    async verifyHeaderLoginButton() {
        await expect(this.loc.loginButton).toBeVisible({ timeout: 15000 });
        await highlightElements(this.loc.loginButton);
    }

    async verifyLoginButtonFromPopupThroughHamburger() {
        const loginButtonSignUpPopup = this.page.getByRole('button', { name: 'Login' }).nth(2);
        await expect(loginButtonSignUpPopup).toBeVisible({ timeout: 15000 });
        await highlightElementBorder(loginButtonSignUpPopup);
    }

    async verifyLoginButtonFromPopupWithoutHamburger() {
        await expect(this.loc.loginButtonFromPopup).toBeVisible({ timeout: 15000 });
        await this.loc.loginButtonFromPopup.click();
        await highlightElementBorder(this.loc.loginButtonFromPopup);
    }

    async verifyLoginButtonInSignUp() {
        await this.loc.loginButtonFromPopup.waitFor({ state: 'visible', timeout: 15000 });
        await highlightElementBorder(this.loc.loginButtonFromPopup);
    }

    async verifyWelcomeUser(username: string) {
        if (activeRegion() === 'TZ') {
            // Confirmed live (user-supplied header DOM): TZ shows a profile avatar icon after
            // login, not a "Welcome <name>" text anywhere in the header — there is no username
            // string to match, so verify login success via the avatar instead.
            const avatar = this.page.locator('feeds-avatar-image');
            await expect(avatar).toBeVisible({ timeout: 15000 });
            await highlightElements(avatar);
            return;
        }
        await expect(this.page.getByText(`${username}`)).toBeVisible({ timeout: 15000 });
        await highlightElements(this.page.getByText(`${username}`).locator('..'));
    }

    // ── Navigation functions ─────────────────────────────────────────────────
    async gotoSignUpfromLoginPopUp() {
        await this.loc.signUpButtonfromHamburger.click();
    }

    async gotoLoginFromSignUp() {
        await this.loc.loginButtonFromPopup.click();
    }

    // goto() is inherited from BasePage (via HomePage)

    async gotoAviatorPage() {
        // Relative path — resolves against the active region's baseURL, not a hardcoded ZA domain.
        await this.page.goto('/lobby/casino-games/game/aviator');
        await this.page.waitForLoadState('domcontentloaded');
    }

    async gotoSportsPage() {
        await this.goto();
        await this.loc.SportButton.click();
        await this.page.waitForLoadState('domcontentloaded');
    }

    // ── Clicking functions ───────────────────────────────────────────────────
    async clickLogin() {
        await this.safeActions.safeClick('loginButton', this.loc.loginButton);
    }

    async clickHamburgerMenu() {
        await this.page.waitForLoadState('domcontentloaded');
        await this.safeActions.safeClick('hamburgerMenu', this.loc.hamburgerMenu);
    }

    async clickLoginButtonFromHamburger() {
        await this.clickHamburgerMenu();
        await this.loc.hamburgerloginButton.click();
    }

    async clickSignUp() {
        await this.loc.signUpButton.click();
        const apiPromise = this.page.waitForResponse((response) =>
            response.url().includes(apidata.signupButtonClick) && response.status() === 200
        );
        await apiPromise;
        // A promotional "Informative" interstitial can layer on top of the Sign Up popup and
        // intercept clicks on the Login link underneath it — see closeInformativeInterstitialIfVisible.
        await this.closeInformativeInterstitialIfVisible();
    }

    async clickSignUpFromHeader() {
        await this.clickHamburgerMenu();
        await this.loc.signUpButtonfromHamburger.click();
    }

    // ── Login functions ──────────────────────────────────────────────────────
    // Login() is inherited from BasePage (via HomePage)

    async LoginArgs(mobile: string, password: string) {
        await this.goto();
        await this.safeActions.safeFill('mobileInput', this.loc.mobileInput, mobile);
        await this.safeActions.safeFill('passwordInput', this.loc.passwordInput, password);
        await this.page.keyboard.press('Enter');
        await this.page.waitForTimeout(5000); // Wait for login to complete
    }

    async LoginFromSignupPopupHamburgerMenu() {
        await this.clickSignUpFromHeader();
        await this.loc.loginButtonFromPopup.click();
        await this.page.waitForTimeout(2000);
        await this.LoginFromPopUp();
        await this.verifyWelcomeUser(userData.user1.name);
    }

    async LoginFromSignupPopupHamburgerMenuArgs(mobile: string, password: string) {
        await this.clickLoginButtonFromHamburger();
        await this.safeActions.safeFill('formMobileInput', this.loc.formMobileInput, mobile);
        await this.safeActions.safeFill('formPasswordInput', this.loc.formPasswordInput, password);
        await this.page.keyboard.press('Enter');
        await this.page.waitForTimeout(2000);
        await this.loc.eyeButton.click();
        await highlightElements(this.loc.formMobileInput);
        await highlightElements(this.loc.formPasswordInput);
    }

    async LoginThroughPopUp() {
        await this.clickSignUp();
        await this.loc.loginButtonFromPopup.click();
        await this.LoginFromPopUp();
    }

    async LoginFromPopUp() {
        await this.safeActions.safeFill('formMobileInput', this.loc.formMobileInput, userData.user1.mobile);
        await this.safeActions.safeFill('formPasswordInput', this.loc.formPasswordInput, userData.user1.password);
        await this.page.keyboard.press('Enter');
        await this.page.waitForTimeout(2000); // Wait for login to complete
        await this.verifyWelcomeUser(userData.user1.name);
    }

    async LoginFromHamburgerMenu(mobile: string, password: string) {
        await this.page.waitForLoadState('domcontentloaded');
        await this.clickLoginButtonFromHamburger();
        await this.safeActions.safeFill('formMobileInput', this.loc.formMobileInput, mobile);
        await this.safeActions.safeFill('formPasswordInput', this.loc.formPasswordInput, password);
        await this.page.keyboard.press('Enter');
        await this.page.waitForLoadState('domcontentloaded');
        await this.verifyWelcomeUser(userData.user1.name);
    }
}
