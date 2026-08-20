import type { test as BetwayTest } from '../fixtures/betwayFixture';
import { ScreenshotHelper } from '../flows/ScreenshotHelper';

function setupSignupTestSuite(_name: string) {
    // no-op
}

export function runSignUpSuite(test: typeof BetwayTest, screenshotDir: string) {
    test.afterEach(async ({ signupUtils }) => {
        await signupUtils.clearHighlights();
    });

    setupSignupTestSuite('ZALogin Signup Tests');
    test.describe('Main Sign-Up Flow - Step 2', () => {
        // This hook runs before EACH test in THIS group, getting us to Step 2 automatically.
        test.beforeEach(async ({ signupPage, signupUtils, testData }) => {
            await signupPage.goto();
            await signupUtils.resetModalState();
            await signupPage.clickSignUp();
            // Fill step 1 with valid data and proceed
            await signupPage.fillBasicInfo(
                testData.mobileValidation.valid,
                testData.passwordValidation.default,
                testData.basicInfo.firstName,
                testData.basicInfo.lastName,
                testData.basicInfo.email
            );
            await signupPage.clickNext();
            // We are now on Step 2
        });

        test('T5-Register Button (Step 2 Entry)', async ({ signupPage }, testInfo) => {
            // This test is re-purposed from the original T5 to just check Step 2 visibility
            // await expect(signupPage.getRegisterButton()).toBeVisible();
            await signupPage.highlightRegisterButton();
            await ScreenshotHelper(signupPage.page, screenshotDir, 'T5-signup-step2', testInfo);
            await signupPage.clickPrevious(); // Cleanup
        });

        test('T7-Register Button (Step 2 Full)', async ({ signupPage, testData }, testInfo) => {
            await signupPage.agreeToAll();
            await signupPage.fillIdNumber(testData.idValidation.miscID);
            // await expect(signupPage.getRegisterButton()).toBeVisible();
            await signupPage.highlightRegisterButton();
            await signupPage.page.waitForTimeout(1000);
            await ScreenshotHelper(signupPage.page, screenshotDir, 'T7-signup', testInfo);
            await signupPage.clickPrevious(); // Cleanup
        });

        // test('T33-ID Document Dropdown Selection and Valid SA ID', async ({ signupPage, testData }, testInfo) => {
        //     // await signupPage.highlightIdDropdown();
        //     await signupPage.selectSouthAfricanID();
        //     await signupPage.highlightSAIdOption();
        //     await signupPage.testSAIdValidation(testData.idValidation.validSAId);
        //     await ScreenshotHelper(signupPage.page, screenshotDir, 'T33-signup', testInfo);
        // });

        // test('T34-Invalid South African ID Validation', async ({ signupPage, testData }, testInfo) => {

        //     await signupPage.selectSouthAfricanID();
        //     await signupPage.testSAIdValidation(testData.idValidation.shortSAId);
        //     await signupPage.testSAIdValidation(testData.idValidation.saIdWithLetters, { clearFirst: true });
        //     await signupPage.testSAIdValidation(testData.idValidation.saIdWithSpecialChars, { clearFirst: true, clickRegister: true, waitTime: 2000 });
        //     await ScreenshotHelper(signupPage.page, screenshotDir, 'T34-signup', testInfo);
        // });

        // test('T35-Valid Passport Number Format', async ({ signupPage, testData }, testInfo) => {
        //     await signupPage.highlightIdDropdown();
        //     await signupPage.selectPassport();
        //     await signupPage.highlightPassportOption();
        //     await signupPage.testPassportValidation(testData.idValidation.validPassport);
        //     await ScreenshotHelper(signupPage.page, screenshotDir, 'T35-signup', testInfo);
        // });

        // test('T36-Invalid Passport Number Validation', async ({ signupPage, testData }, testInfo) => {
        //     await signupPage.selectPassport();
        //     await signupPage.testPassportValidation(testData.idValidation.shortPassport);
        //     await signupPage.testPassportValidation(testData.idValidation.passportWithSpecial, { clearFirst: true });
        //     await signupPage.testPassportValidation(testData.idValidation.allNumericPassport, { clearFirst: true, clickRegister: true, waitTime: 2000 });
        //     await ScreenshotHelper(signupPage.page, screenshotDir, 'T36-signup', testInfo);
        // });

        // test('T37-Date of Birth Selection and Complete Registration', async ({ signupPage, testData }, testInfo) => {
        //     await signupPage.selectSouthAfricanID();
        //     await signupPage.fillSouthAfricanID(testData.idValidation.validSAId);
        //     await signupPage.highlightDobDropdown();
        //     await signupPage.selectDateOfBirth();
        //     await signupPage.agreeToAll();
        //     await signupPage.highlightRegisterButton();
        //     await signupPage.page.waitForTimeout(1000);
        //     await ScreenshotHelper(signupPage.page, screenshotDir, 'T37-signup', testInfo);
        // });

        // test('T38-Empty ID Number Field Validation', async ({ signupPage, testData }, testInfo) => {
        //     await signupPage.selectSouthAfricanID();
        //     await signupPage.highlightSAIdInput();
        //     await signupPage.clickRegister();
        //     await signupPage.page.waitForTimeout(2000);
        //     await ScreenshotHelper(signupPage.page, screenshotDir, 'T38-signup', testInfo);
        // });
    });
}
