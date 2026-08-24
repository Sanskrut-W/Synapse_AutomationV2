import type { test as BetwayTest } from '../fixtures/betwayFixture';
import { ScreenshotHelper } from '../flows/ScreenshotHelper';
import { activeRegion } from '../config/oddsApiUrl';

export function runHeaderSuite(test: typeof BetwayTest, screenshotDir: string) {
    test.describe('Header Module Tests', () => {

        test('1-Verify Header Beatway Logo', async ({ headerPage }, testInfo) => {
            await headerPage.verifyBetwayLogoHeader();
            await ScreenshotHelper(headerPage.page, screenshotDir, 'T1-header-logo.png', testInfo);
        });

        test('2-Verify Hamburger menu is visible and clickable', async ({ headerPage }, testInfo) => {
            await headerPage.verifyHamburgerMenu();
            await ScreenshotHelper(headerPage.page, screenshotDir, 'T2-hamburgerButton.png', testInfo);
            await headerPage.clickHamburgerMenu();
            await ScreenshotHelper(headerPage.page, screenshotDir, 'T2-hamburgerMenu.png', testInfo);
        });

        test('9-Verify Mobile Number field is visible on Homepage', async ({ headerPage }, testInfo) => {
            await headerPage.verifyMobileNumberField();
            await ScreenshotHelper(headerPage.page, screenshotDir, 'T11-mobileNumberInput.png', testInfo);
        });

        test('10-Verify that user is able to enter Mobile Number in Mobile Number field', async ({ headerPage }, testInfo) => {
            await headerPage.verifyMobileNumberInput();
            await ScreenshotHelper(headerPage.page, screenshotDir, 'T12-mobileNumberInput.png', testInfo);
        });

        test('11-Verify password field is visible on Homepage', async ({ headerPage }, testInfo) => {
            await headerPage.verifyPasswordField();
            await ScreenshotHelper(headerPage.page, screenshotDir, 'T11-passwordInput.png', testInfo);
        });

        test('12-Verify that user is able to enter password in Password field', async ({ headerPage }, testInfo) => {
            await headerPage.verifyPasswordInput();
            await ScreenshotHelper(headerPage.page, screenshotDir, 'T14-passwordInput.png', testInfo);
        });

        test('14-Verify "Forgot Password?" option below password field is visible and clickable on Homepage', async ({ headerPage }, testInfo) => {
            await headerPage.verifyAndClickForgetPassword();
            await ScreenshotHelper(headerPage.page, screenshotDir, 'T16-forgetPasswordLink.png', testInfo);
        });

        test('15-Verify Betslip button is visible and clickable on the home page of Betway application', async ({ headerPage }, testInfo) => {
            await headerPage.verifyAndClickBetslip();
            await ScreenshotHelper(headerPage.page, screenshotDir, 'T21-betslipButtonClicked.png', testInfo);
        });

        test('26-Verify that Accounts button is visible and clickable on the home page of Betway application', async ({ headerPage }, testInfo) => {
            // Confirmed live: at this suite's viewport, MW's header has no profile-avatar icon at
            // all (account access goes through the hamburger menu instead) — not a locator mismatch.
            test.skip(activeRegion() === 'MW', "MW's header has no profile avatar icon at this viewport");
            await headerPage.Login();
            await headerPage.page.waitForTimeout(3000);
            await headerPage.verifyAndClickAccountsButton();
            await ScreenshotHelper(headerPage.page, screenshotDir, 'T34-accountsButtonClicked-loggedin.png', testInfo);
        });

        test('27-Verify that Balance field in green color is displayed on the home page of Betway application', async ({ headerPage }, testInfo) => {
            await headerPage.verifyBalanceField();
            await ScreenshotHelper(headerPage.page, screenshotDir, 'T35-balanceField-loggedin.png', testInfo);
        });

        test('37-Verify that Deposit button in green colour is visible and clickable on the home page of Betway application', async ({ headerPage }, testInfo) => {
            await headerPage.Login();
            await headerPage.verifyAndClickDepositButton();
            await ScreenshotHelper(headerPage.page, screenshotDir, 'T46-depositButtonClicked-loggedin.png', testInfo);
        });

        test('38-Verify that Notification bell icon is visible and clickable on the home page of Betway application', async ({ headerPage }, testInfo) => {
            await headerPage.Login();
            await headerPage.verifyAndClickNotificationIcon();
            await ScreenshotHelper(headerPage.page, screenshotDir, 'T47-notificationBellIconClicked-loggedin.png', testInfo);
        });

        // test('39-Verify that Chat icon is visible and clickable on the home page of Betway application', async ({ headerPage }, testInfo) => {
        //     await headerPage.Login();
        //     await headerPage.verifyAndClickChatIcon();
        //     await ScreenshotHelper(headerPage.page, screenshotDir, 'T48-chatIconClicked-loggedin.png', testInfo);
        // });

        // test('3-Verify login and sign up button in hamburger window are visible', async ({ headerPage }, testInfo) => {
        //     await headerPage.verifyLoginAndSignUpButtons();
        //     await ScreenshotHelper(headerPage.page, screenshotDir, 'T3-login-signupButton.png', testInfo);
        // });

        // test('4-Verify Quick Links drop down is visible and clickable in Hamburger Menu', async ({ headerPage }, testInfo) => {
        //     await headerPage.verifyQuickLinksDropdown();
        //     await ScreenshotHelper(headerPage.page, screenshotDir, 'T4-quickLinks1.png', testInfo);
        //     await headerPage.clickQuickLinks();
        //     await ScreenshotHelper(headerPage.page, screenshotDir, 'T4-quickLinks2.png', testInfo);
        // });

        test('5-Verify Betting Rules option in Quick Links drop down is visible and clickable inside Hamburger Menu', async ({ headerPage }, testInfo) => {
            await headerPage.verifyAndClickBettingRulesWithoutLogin();
            await ScreenshotHelper(headerPage.page, screenshotDir, 'T5-bettingRulesClicked.png', testInfo);
        });

        // test('6-Verify Statistics option in Quick Links drop down is visible and clickable inside Hamburger Menu', async ({ headerPage }, testInfo) => {
        //     await headerPage.verifyAndClickStatisticsWithoutLogin();
        //     await ScreenshotHelper(headerPage.page, screenshotDir, 'T6-statistics.png', testInfo);
        //     await ScreenshotHelper(headerPage.page, screenshotDir, 'T6-statisticsClicked.png', testInfo);
        // });

        // // test('7-Verify country code +27 is visible on Homepage', async ({ headerPage }, testInfo) => {
        // //     await headerPage.verifyCountryCode();
        // //     await ScreenshotHelper(headerPage.page, screenshotDir, 'T10-countryCode.png', testInfo);

        // // });

        test('8-Verify Odds Format button with Decimal & Fractional options is visible and clickable in Hamburger Menu', async ({ headerPage }, testInfo) => {
            await headerPage.verifyOddsFormat();
            await ScreenshotHelper(headerPage.page, screenshotDir, 'T7-oddsFormat.png', testInfo);
        });

        // // // test('13-Verify Eye button is visible on Password field', async ({ headerPage }, testInfo) => {
        // // //     await headerPage.verifyEyeButton();
        // // //     await ScreenshotHelper(headerPage.page, screenshotDir, 'T15-eyeButton.png', testInfo);
        // // // });

        // // With Login
        test('16-Verify Betway Logo is visible on Homepage', async ({ headerPage }, testInfo) => {
            await headerPage.Login();
            await headerPage.page.waitForTimeout(3000);
            await headerPage.verifyBetwayLogoHeader();
            await ScreenshotHelper(headerPage.page, screenshotDir, 'T23-header-logo-loggedin.png', testInfo);
        });

        test('17-Verify Hamburger menu is visible and clickable after login', async ({ headerPage }, testInfo) => {
            await headerPage.Login();
            await headerPage.verifyHamburgerMenu();
            await ScreenshotHelper(headerPage.page, screenshotDir, 'T24-hamburgerButton-loggedin.png', testInfo);
            await headerPage.clickHamburgerMenu();
            await ScreenshotHelper(headerPage.page, screenshotDir, 'T24-hamburgerMenu-loggedin.png', testInfo);
        });

        test('18-Verify Quick Links drop down is visible and clickable in Hamburger Menu', async ({ headerPage }, testInfo) => {
            await headerPage.Login();
            await headerPage.verifyAndClickQuickLinksDropdown();
            await ScreenshotHelper(headerPage.page, screenshotDir, 'T25-quickLinks2-loggedin.png', testInfo);
        });

        test('19-Verify Betting Rules option in Quick Links drop down is visible and clickable inside Hamburger Menu', async ({ headerPage }, testInfo) => {
            await headerPage.Login();
            await headerPage.page.waitForTimeout(3000);
            await headerPage.clickHamburgerMenu();
            await headerPage.clickQuickLinks();
            await headerPage.verifyAndClickBettingRules();
            await ScreenshotHelper(headerPage.page, screenshotDir, 'T26-bettingRulesClicked-loggedin.png', testInfo);
        });

        test('20-Verify Statistics option in Quick Links drop down is visible and clickable inside Hamburger Menu', async ({ headerPage }, testInfo) => {
            await headerPage.Login();
            await headerPage.page.waitForTimeout(3000);
            await headerPage.clickHamburgerMenu();
            await headerPage.clickQuickLinks();
            await headerPage.verifyAndClickStatistics();
            await ScreenshotHelper(headerPage.page, screenshotDir, 'T27-statisticsClicked-loggedin.png', testInfo);
        });

        test('21-Verify Odds Format button with Decimal & Fractional options is visible and clickable in Hamburger Menu', async ({ headerPage }, testInfo) => {
            await headerPage.Login();
            await headerPage.verifyOddsFormat();
            await ScreenshotHelper(headerPage.page, screenshotDir, 'T29-oddsFormat-loggedin.png', testInfo);
        });

        // test('22-Verify Close button is visible and clickable in Hamburger Menu', async ({ headerPage }, testInfo) => {
        //     await headerPage.Login();
        //     await headerPage.clickHamburgerMenu();
        //     await highlightElementBorder(headerPage.closeHamburgerMenu);
        //     await ScreenshotHelper(headerPage.page, screenshotDir, 'T30-closeHamburgerMenu-loggedin.png', testInfo);
        //     await headerPage.closeHamburgerMenu.click();
        // });
        test('23-Verify My account drop down is visible and clickable in Hamburger Menu', async ({ headerPage }, testInfo) => {
            await headerPage.verifyAndClickMyAccount();
            await ScreenshotHelper(headerPage.page, screenshotDir, 'T31-myAccountClicked-loggedin.png', testInfo);
        });

        test('24-Verify all options in the My Account are visible and clickable', async ({ headerPage }, testInfo) => {
            await headerPage.Login();
            await headerPage.clickHamburgerMenu();
            await headerPage.verifyAllMyAccountOptions();
            await ScreenshotHelper(headerPage.page, screenshotDir, 'T32-1-myAccountOptions-loggedin.png', testInfo);
            //         await headerPage.clickCloseHamburgerMenu();

            //         await headerPage.clickHamburgerMenu();
            //         await headerPage.testDepositFund();
            //         await ScreenshotHelper(headerPage.page, screenshotDir, 'T32-depositFundClicked-loggedin.png', testInfo);
            //         await headerPage.clickCloseMyAccountOptions();
            //         await headerPage.testWithdrawFund();
            //         await ScreenshotHelper(headerPage.page, screenshotDir, 'T32-withdrawFundClicked-loggedin.png', testInfo);
            //         await headerPage.clickCloseMyAccountOptions();
            //         await ScreenshotHelper(headerPage.page, screenshotDir, 'T32-withdrawFundClicked-loggedin.png', testInfo);
            //         await headerPage.testMyBets();
            //         await ScreenshotHelper(headerPage.page, screenshotDir, 'T32-myBetsClicked-loggedin.png', testInfo);
            //         await headerPage.clickCloseMyAccountOptions();
            //         await headerPage.testMyCasinoBigWin();
            //         await ScreenshotHelper(headerPage.page, screenshotDir, 'T32-myCasinoBigWinClicked-loggedin.png', testInfo);
            //         await headerPage.clickCloseMyAccountOptions();
            //         await headerPage.testBonusSummary();
            //         await ScreenshotHelper(headerPage.page, screenshotDir, 'T32-bonusSummaryClicked-loggedin.png', testInfo);
            //         await headerPage.clickCloseMyAccountOptions();
            //         await headerPage.testTransactionsHistory();
            //         await ScreenshotHelper(headerPage.page, screenshotDir, 'T32-transactionsHistoryClicked-loggedin.png', testInfo);
            //         await headerPage.clickCloseMyAccountOptions();
            //         await headerPage.testMyCoupons();
            //         await ScreenshotHelper(headerPage.page, screenshotDir, 'T32-myCouponsClicked-loggedin.png', testInfo);
            //         await headerPage.clickCloseMyAccountOptions();
            //         await headerPage.testBetInfluencer();
            //         await ScreenshotHelper(headerPage.page, screenshotDir, 'T32-betInfluencerClicked-loggedin.png', testInfo);
            //         await headerPage.clickCloseMyAccountOptions();
            //         await headerPage.testPromoVouchers();
            //         await ScreenshotHelper(headerPage.page, screenshotDir, 'T32-promoVouchersClicked-loggedin.png', testInfo);
            //         await headerPage.clickCloseMyAccountOptions();
            //         await headerPage.testUpdateDetails();
            //         await ScreenshotHelper(headerPage.page, screenshotDir, 'T32-updateDetailsClicked-loggedin.png', testInfo);
            //         await headerPage.clickCloseMyAccountOptions();
            //         await headerPage.testResponsibleGaming();
            //         await ScreenshotHelper(headerPage.page, screenshotDir, 'T32-responsibleGamingClicked-loggedin.png', testInfo);
            //         await headerPage.clickCloseMyAccountOptions();
            //         await headerPage.testDocumentVerification();
            //         await ScreenshotHelper(headerPage.page, screenshotDir, 'T32-documentVerificationClicked-loggedin.png', testInfo);
            //         await headerPage.clickCloseMyAccountOptions();
            //         await headerPage.testBetwayBenefits();
            //         await ScreenshotHelper(headerPage.page, screenshotDir, 'T32-betwayBenefitsClicked-loggedin.png', testInfo);
            //         await headerPage.clickCloseMyAccountOptions();
            //         await headerPage.testBetwayRewards();
            //         await ScreenshotHelper(headerPage.page, screenshotDir, 'T32-betwayRewardsClicked-loggedin.png', testInfo);
            //         await headerPage.clickCloseMyAccountOptions();
            //         await headerPage.testChangePassword();
            //         await ScreenshotHelper(headerPage.page, screenshotDir, 'T32-changePasswordClicked-loggedin.png', testInfo);
            //         await headerPage.clickCloseMyAccountOptions();
            //         await headerPage.testLogout();
            //         await ScreenshotHelper(headerPage.page, screenshotDir, 'T32-logOutClicked-loggedin.png', testInfo);
        });

        // test('25-Verify eye button in Hamburger menu', async ({ headerPage }, testInfo) => {
        //     await headerPage.Login();
        //     await headerPage.clickHamburgerMenu();
        //     await headerPage.verifyHamburgerEyeButton();
        //     await ScreenshotHelper(headerPage.page, screenshotDir, 'T33-eyeButton2Clicked-loggedin.png', testInfo);
        // });

        // test('28-Verify that R currency in balance field is displayed on the home page of Betway application', async ({ headerPage }, testInfo) => {
        //     await headerPage.verifyBalanceCurrency();
        //     await ScreenshotHelper(headerPage.page, screenshotDir, 'T37-balanceCurrency-loggedin.png', testInfo);
        // });

        // test('29-Verify that Freebet field in green color is displayed on the home page of Betway application', async ({ headerPage }, testInfo) => {
        //     await headerPage.verifyFreebetField();
        //     await ScreenshotHelper(headerPage.page, screenshotDir, 'T38-freebetField-loggedin.png', testInfo);
        // });

        // test('30-Verify that Amount in free bet field is displayed on the home page of Betway application', async ({ headerPage }, testInfo) => {
        //     await headerPage.Login();
        //     await headerPage.page.waitForTimeout(5000);
        //     await highlightElementBorder(headerPage.freebetAmount);
        //     await ScreenshotHelper(headerPage.page, screenshotDir, 'T39-freebetAmount-loggedin.png', testInfo);
        // });

        // test('31-Verify that R currency in free bet field is displayed on the home page of Betway application', async ({ headerPage }, testInfo) => {
        //     await headerPage.verifyFreebetCurrency();
        //     await ScreenshotHelper(headerPage.page, screenshotDir, 'T40-freebetCurrency-loggedin.png', testInfo);
        // });

        // test('32-Verify that Refresh button in free bet field is visible and clickable on the home page of Betway application', async ({ headerPage }, testInfo) => {
        //     await headerPage.verifyFreebetRefreshButton();
        //     await ScreenshotHelper(headerPage.page, screenshotDir, 'T41-refreshButton2-loggedin.png', testInfo);
        // });

        // test('33-Verify that Casino bonus field in blue color is displayed on the home page of Betway application', async ({ headerPage }, testInfo) => {
        //     await headerPage.Login();
        //     await headerPage.verifyCasinoBonusField();
        //     await ScreenshotHelper(headerPage.page, screenshotDir, 'T42-casinoBonusField-loggedin.png', testInfo);
        // });

        // test('34-Verify Amount in casino bonus field is displayed on the home page of Betway application', async ({ headerPage }, testInfo) => {
        //     await headerPage.Login();
        //     await headerPage.page.waitForTimeout(3000);
        //     await headerPage.clickbalanceDropdown();
        //     await highlightElementBorder(headerPage.casinoBonusAmount);
        //     await ScreenshotHelper(headerPage.page, screenshotDir, 'T43-casinoBonusAmount-loggedin.png', testInfo);
        // });

        // test('35-Verify R currency in casino bonus field is displayed on the home page of Betway application', async ({ headerPage }, testInfo) => {
        //     await headerPage.verifyCasinoBonusCurrency();
        //     await ScreenshotHelper(headerPage.page, screenshotDir, 'T44-casinoBonusCurrency-loggedin.png', testInfo);
        // });

        // test('36-Verify that Refresh button in casino bonus field is visible and clickable on the home page of Betway application', async ({ headerPage }, testInfo) => {
        //     await headerPage.verifyCasinoRefreshButton();
        //     await ScreenshotHelper(headerPage.page, screenshotDir, 'T45-refreshButton3-loggedin.png', testInfo);
        // });

    });
}
