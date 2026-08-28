import type { test as BetwayTest } from '../fixtures/betwayFixture';
import { ScreenshotHelper } from '../flows/ScreenshotHelper';
import { loadRegionData } from '../config/regionData';

const userData = loadRegionData('json-data/userData.json');

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
    });
}
