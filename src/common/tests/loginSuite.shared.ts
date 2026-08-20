import type { test as BetwayTest } from '../fixtures/betwayFixture';
import { ScreenshotHelper } from '../flows/ScreenshotHelper';

export function runLoginSuite(test: typeof BetwayTest, screenshotDir: string) {
    test.describe('Login Page Tests', () => {
        // test('T5 - Verify that user should able to see the "Login" button on signup popup window', async ({ loginPage }, testInfo) => {
        //     await loginPage.clickLoginButtonFromHamburger();
        //     await loginPage.verifyLoginButtonFromPopupThroughHamburger();
        //     await ScreenshotHelper(loginPage.page, screenshotDir, 'T5-loginPage', testInfo);
        // });

        test('T9 - Verify user is able to login', async ({ loginPage }, testInfo) => {
            await loginPage.Login();
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
