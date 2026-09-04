import type { test as BetwayTest } from '../fixtures/betwayFixture';
import { expect } from '@playwright/test';
import { ScreenshotHelper } from '../flows/ScreenshotHelper';
import { loadRegionData } from '../config/regionData';

const userData = loadRegionData('json-data/userData.json');

// Confirmed live on ZA: the header shows a single "Login" button; the inline
// mobile/password fields (loginPage.loc.mobileInput/passwordInput) only render after it's
// clicked — same fallback BasePage.Login() already uses internally.
async function revealLoginForm(loginPage: any) {
    try {
        await loginPage.loc.mobileInput.waitFor({ state: 'visible', timeout: 3000 });
    } catch {
        await loginPage.clickLogin();
        await loginPage.loc.mobileInput.waitFor({ state: 'visible', timeout: 10000 });
    }
}

export function runLoginSuite(test: typeof BetwayTest, screenshotDir: string) {
    test.describe('Login Page Tests', () => {
        // test('T5 - Verify that user should able to see the "Login" button on signup popup window', async ({ loginPage }, testInfo) => {
        //     await loginPage.clickLoginButtonFromHamburger();
        //     await loginPage.verifyLoginButtonFromPopupThroughHamburger();
        //     await ScreenshotHelper(loginPage.page, screenshotDir, 'T5-loginPage', testInfo);
        // });

        test('T9 - Verify user is able to login', async ({ loginPage }, testInfo) => {
            // Login() alone never asserts anything — it only fills the form and presses Enter, so
            // this test previously passed even when the login itself failed (e.g. a live "Access
            // Denied" error after too many attempts, confirmed on BW). verifyWelcomeUser() is the
            // same proven-robust success check T11 already uses for its own login path (handles
            // TZ's avatar-only header specially); passing user1 here (not the default user4, which
            // has no "name" field) is what makes that check possible.
            await loginPage.Login(userData.user1);
            await loginPage.verifyWelcomeUser(userData.user1.name);
            await ScreenshotHelper(loginPage.page, screenshotDir, 'T9-loginPage', testInfo);
        });

        // test('T10 - Verify user is able to login from hamburger menu', async ({ loginPage }, testInfo) => {
        //     await loginPage.LoginFromHamburgerMenu(userData.user1.mobile, userData.user1.password);
        //     await ScreenshotHelper(loginPage.page, screenshotDir, 'T10-loginPage', testInfo);
        // });

        test('T11 - Verify user is able to login from signup popup', async ({ loginPage }, testInfo) => {
            await loginPage.LoginThroughPopUp();
            await ScreenshotHelper(loginPage.page, screenshotDir, 'T11-loginPage', testInfo);
        });

        // --- Below: ported from the old repo's modules/regression tier. Most of that tier's login
        // coverage (T10, T14-29, T39-68) routed through clickLoginButtonFromHamburger(), which
        // clicks a "2nd Login button inside the hamburger drawer" that's confirmed live not to
        // exist anymore (only 1 real "Login"-named element on the whole page) — a real site
        // redesign (Login/Sign Up moved inline into the header), not a locator typo. Rather than
        // port dozens of tests built on that dead path, these are rebuilt on the two entry points
        // confirmed live and working today: the header's own Login button, and the Sign Up popup's
        // Login link (already proven by T9/T11 above).

        test('T7-Verify Login button is visible in the header', async ({ loginPage }, testInfo) => {
            await loginPage.verifyHeaderLoginButton();
            await ScreenshotHelper(loginPage.page, screenshotDir, 'T7-loginPage', testInfo);
        });

        test('T8-Verify clicking the header Login button reveals the login form', async ({ loginPage, page }, testInfo) => {
            await loginPage.clickLogin();
            await expect(loginPage.loc.mobileInput).toBeVisible({ timeout: 10000 });
            await expect(loginPage.loc.passwordInput).toBeVisible();
            await ScreenshotHelper(page, screenshotDir, 'T8-loginPage', testInfo);
        });

        // Consolidates the old repo's ~16 near-duplicate negative-mobile/password variants (empty,
        // too short, too long, alphanumeric, special characters), which never actually asserted
        // anything beyond a screenshot. Confirmed live: any NON-EMPTY-but-invalid mobile/password
        // combination is rejected server-side with "Access Denied. Check Username and/or Password"
        // — a real, checkable signal the old tests never verified.
        test('T14-29-Verify login is rejected with "Access Denied" for invalid mobile/password combinations', async ({ loginPage, page }, testInfo) => {
            const invalidCases: { mobile: string; password: string; label: string }[] = [
                { mobile: 'abc!@#', password: userData.user1.password, label: 'alphanumeric-special-mobile' },
                { mobile: '12', password: userData.user1.password, label: 'too-short-mobile' },
                { mobile: userData.user1.mobile, password: 'ab', label: 'too-short-password' },
                { mobile: userData.user1.mobile, password: 'x'.repeat(25), label: 'too-long-password' },
            ];
            for (const { mobile, password, label } of invalidCases) {
                await loginPage.goto();
                await revealLoginForm(loginPage);
                await loginPage.loc.mobileInput.fill(mobile);
                await loginPage.loc.passwordInput.fill(password);
                await page.keyboard.press('Enter');
                await expect(page.getByText('Access Denied')).toBeVisible({ timeout: 10000 });
                await ScreenshotHelper(page, screenshotDir, `T14-29-invalid-${label}`, testInfo);
            }
        });

        // Confirmed live: an EMPTY mobile or password field is blocked client-side — the form
        // simply doesn't submit (no "Access Denied", no navigation), unlike a non-empty-but-invalid
        // value above. The old tests for these cases never checked anything either way.
        test('T14-29b-Verify empty mobile/password fields do not submit the login form', async ({ loginPage, page }, testInfo) => {
            await loginPage.goto();
            await revealLoginForm(loginPage);
            await loginPage.loc.passwordInput.fill(userData.user1.password);
            await page.keyboard.press('Enter');
            await page.waitForTimeout(1500);
            await expect(loginPage.loc.mobileInput).toBeVisible();
            await ScreenshotHelper(page, screenshotDir, 'T14-29b-empty-mobile', testInfo);

            await loginPage.goto();
            await revealLoginForm(loginPage);
            await loginPage.loc.mobileInput.fill(userData.user1.mobile);
            await page.keyboard.press('Enter');
            await page.waitForTimeout(1500);
            await expect(loginPage.loc.passwordInput).toBeVisible();
            await ScreenshotHelper(page, screenshotDir, 'T14-29b-empty-password', testInfo);
        });
    });
}
