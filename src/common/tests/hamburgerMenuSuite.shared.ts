import type { test as BetwayTest } from '../fixtures/betwayFixture';
import { ScreenshotHelper } from '../flows/ScreenshotHelper';
import { activeRegion } from '../config/oddsApiUrl';

export function runHamburgerMenuSuite(test: typeof BetwayTest, screenshotDir: string) {
    test.describe('Hamburger Module Tests', () => {

        test('2-Verify Hamburger menu is visible and clickable', async ({ hamburgerMenuPage }, testInfo) => {
            await hamburgerMenuPage.verifyHamburgerMenu();
            await ScreenshotHelper(hamburgerMenuPage.page, screenshotDir, 'T2-hamburgerButton.png', testInfo);
            await hamburgerMenuPage.clickHamburgerMenu();
            await ScreenshotHelper(hamburgerMenuPage.page, screenshotDir, 'T2-hamburgerMenu.png', testInfo);
        });

        test('13-Verify functionality of Hide/Show balance button in Hamburger', async ({ hamburgerMenuPage }, testInfo) => {
            await hamburgerMenuPage.verifyEyeButton2();
            await ScreenshotHelper(hamburgerMenuPage.page, screenshotDir, 'T15-eyeButton.png', testInfo);
        });

        test('23-Verify My account drop down is visible and clickable in Hamburger Menu', async ({ hamburgerMenuPage }, testInfo) => {
            await hamburgerMenuPage.verifyAndClickMyAccount();
            await ScreenshotHelper(hamburgerMenuPage.page, screenshotDir, 'T31-myAccountClicked-loggedin.png', testInfo);
        });

        test('24-Verify Deposited Funds option functionality inside Hamburger menu.', async ({ hamburgerMenuPage }, testInfo) => {
            await hamburgerMenuPage.Login();
            await hamburgerMenuPage.clickHamburgerMenu();
            await hamburgerMenuPage.verifyAndClickDepositButton();
        });

        test.describe('Hamburger Menu - My Account Options Tests', () => {

            test.beforeEach(async ({ hamburgerMenuPage }) => {
                // await hamburgerMenuPage.goto();
                await hamburgerMenuPage.Login();
                await hamburgerMenuPage.clickHamburgerMenu();
            });

            test('24-Verify Deposited Funds option functionality', async ({ hamburgerMenuPage }, testInfo) => {
                await hamburgerMenuPage.verifyAndClickDepositButton();
                await ScreenshotHelper(hamburgerMenuPage.page, screenshotDir, 'DepositFund.png', testInfo);
            });

            test('25-Verify Withdraw Funds option functionality', async ({ hamburgerMenuPage }, testInfo) => {
                await hamburgerMenuPage.verifyAndClickWithdrawFund();
                await ScreenshotHelper(hamburgerMenuPage.page, screenshotDir, 'WithdrawFund.png', testInfo);
            });

            test('26-Verify My Bets option functionality', async ({ hamburgerMenuPage }, testInfo) => {
                await hamburgerMenuPage.verifyAndClickMyBets();
                await ScreenshotHelper(hamburgerMenuPage.page, screenshotDir, 'MyBets.png', testInfo);
                // await hamburgerMenuPage.clickCloseMyAccountOptions();
            });

            test('27-Verify My Casino Big Win option functionality', async ({ hamburgerMenuPage }, testInfo) => {
                // Confirmed live: MW's and MZ's My Account panels have no "My Casino Big Win"
                // option at all (MZ has no Casino product at all — confirmed absent from its main
                // nav too). ZM confirmed absent too (0 matches for the text anywhere on the page).
                test.skip(['MW', 'MZ', 'ZM'].includes(activeRegion()), 'This region has no "My Casino Big Win" option in My Account');
                await hamburgerMenuPage.verifyAndClickMyCasinoBigWin();
                await ScreenshotHelper(hamburgerMenuPage.page, screenshotDir, 'CasinoBigWin.png', testInfo);
                // await hamburgerMenuPage.clickCloseMyAccountOptions();
            });

            test('28-Verify Bonus Summary option functionality', async ({ hamburgerMenuPage }, testInfo) => {
                await hamburgerMenuPage.verifyAndClickBonusSummary();
                await ScreenshotHelper(hamburgerMenuPage.page, screenshotDir, 'BonusSummary.png', testInfo);
                // await hamburgerMenuPage.clickCloseMyAccountOptions();
            });

            test('29-Verify Transactions History option functionality', async ({ hamburgerMenuPage }, testInfo) => {
                await hamburgerMenuPage.verifyAndClickTransactionsHistory();
                await ScreenshotHelper(hamburgerMenuPage.page, screenshotDir, 'TransactionHistory.png', testInfo);
                // await hamburgerMenuPage.clickCloseMyAccountOptions();
            });

            // test('30-Verify My Coupons option functionality', async ({ hamburgerMenuPage }, testInfo) => {
            //     await hamburgerMenuPage.verifyAndClickMyCoupons();
            //     await ScreenshotHelper(hamburgerMenuPage.page, screenshotDir, 'MyCoupons.png', testInfo);
            //     // await hamburgerMenuPage.clickCloseMyAccountOptions();
            // });

            test('31-Verify Bet Influencer option functionality', async ({ hamburgerMenuPage }, testInfo) => {
                await hamburgerMenuPage.verifyAndClickBetInfluencer();
                await ScreenshotHelper(hamburgerMenuPage.page, screenshotDir, 'BetInfluencer.png', testInfo);
                // await hamburgerMenuPage.clickCloseMyAccountOptions();
            });

            test('32-Verify Promo Vouchers option functionality', async ({ hamburgerMenuPage }, testInfo) => {
                await hamburgerMenuPage.verifyAndClickPromoVouchers();
                await ScreenshotHelper(hamburgerMenuPage.page, screenshotDir, 'PromoVouchers.png', testInfo);
                // await hamburgerMenuPage.clickCloseMyAccountOptions();
            });

            // test('33-Verify Update Details option functionality', async ({ hamburgerMenuPage }, testInfo) => {
            //     await hamburgerMenuPage.verifyAndClickUpdateDetails();
            //     await ScreenshotHelper(hamburgerMenuPage.page, screenshotDir, 'UpdateDetails.png', testInfo);
            //     // await hamburgerMenuPage.clickCloseMyAccountOptions();
            // });

            test('34-Verify Responsible Gaming option functionality', async ({ hamburgerMenuPage }, testInfo) => {
                await hamburgerMenuPage.verifyAndClickResponsibleGaming();
                await ScreenshotHelper(hamburgerMenuPage.page, screenshotDir, 'ResponsibleGaming.png', testInfo);
                // await hamburgerMenuPage.clickCloseMyAccountOptions();
            });

            test('35-Verify Document Verification option functionality', async ({ hamburgerMenuPage }, testInfo) => {
                // Confirmed live: GH's My Account panel has no "Document Verification" option at all.
                // Confirmed live: NG's panel doesn't either — its real panel lists exactly: My
                // Gifts, My Profile, My Bets, Bonus Summary, Transaction History, Responsible
                // Gaming, My Casino Big Wins, Bet Influencer, Promo Voucher, Betway Rewards, Live
                // Chat, Log Out (0 DOM matches for the text anywhere on the page) — this was
                // hitting the 60s actionTimeout on documentVerification.scrollIntoViewIfNeeded().
                // Confirmed live on ZM too (2026-10-12): same absence, same symptom — the panel
                // opens with every sibling option present and 0 matches for the text.
                test.skip(['GH', 'NG', 'ZM'].includes(activeRegion()), 'This region has no "Document Verification" option in My Account');
                await hamburgerMenuPage.verifyAndClickDocumentVerification();
                await ScreenshotHelper(hamburgerMenuPage.page, screenshotDir, 'DocVerification.png', testInfo);
                // await hamburgerMenuPage.clickCloseMyAccountOptions();
            });

            test('36-Verify Betway Benefits option functionality', async ({ hamburgerMenuPage }, testInfo) => {
                // Confirmed live: MW's, MZ's, and TZ's My Account panel has no "Betway Benefits"
                // option at all (TZ's panel lists exactly: My Gifts, My Profile, My Bets, Bonus
                // Summary, Transaction History, Responsible Gaming, Document Verification, My Casino
                // Big Wins, Bet Influencer, Promo Voucher, Betway Rewards, Log Out — 0 DOM matches
                // for the "Betway Benefits" id or for that text anywhere on the page). This absence
                // is what was hitting the 60s actionTimeout on
                // betwayBenefits.scrollIntoViewIfNeeded() (never resolves -> full 90s test timeout +
                // 1 retry = the reported ~2.8m failure).
                // Confirmed live: NG's panel has the same gap — its real 12 items are My Gifts, My
                // Profile, My Bets, Bonus Summary, Transaction History, Responsible Gaming, My
                // Casino Big Wins, Bet Influencer, Promo Voucher, Betway Rewards, Live Chat, Log
                // Out — no Betway Benefits (and no Document Verification either, handled above).
                // ZM confirmed absent too (0 matches for the text anywhere on the page).
                // Confirmed live on GH too (2026-09-22): its My Account panel now lists exactly My
                // Gifts, My Profile, My Bets, Bonus Summary, Transaction History, Responsible
                // Gaming, My Casino Big Win, Bet Influencer, Promo Voucher, Betway Rewards, Live
                // Chat, Log Out — no Betway Benefits. Wasn't absent when this skip list was first
                // written; a real, recent removal on GH's live site, not a stale assumption.
                // Confirmed live (2026-10-12): BW's My Account panel has the same shape as the others
            // above — My Gifts/My Profile/My Bets/Bonus Summary/Transaction History/Responsible
            // Gaming/Document Verification/My Casino Big Wins/Bet Influencer/Promo Voucher/
            // "Betway Rewards" (not "Betway Benefits")/Live Chat/Log Out. No Betway Benefits item.
            test.skip(['MW', 'MZ', 'TZ', 'NG', 'ZM', 'GH', 'BW'].includes(activeRegion()), 'This region has no "Betway Benefits" option in My Account');
                await hamburgerMenuPage.verifyAndClickBetwayBenefits();
                await ScreenshotHelper(hamburgerMenuPage.page, screenshotDir, 'BetwayBenefits.png', testInfo);
                // await hamburgerMenuPage.clickCloseMyAccountOptions();
            });

            test('37-Verify Betway Rewards option functionality', async ({ hamburgerMenuPage }, testInfo) => {
                await hamburgerMenuPage.verifyAndClickBetwayRewards();
                await ScreenshotHelper(hamburgerMenuPage.page, screenshotDir, 'BetwayRewards.png', testInfo);
                // await hamburgerMenuPage.clickCloseMyAccountOptions();
            });

            test('38-Verify Change Password option functionality', async ({ hamburgerMenuPage }, testInfo) => {
                await hamburgerMenuPage.clickMyAccount();
                await hamburgerMenuPage.verifyAndClickChangePassword();
                await ScreenshotHelper(hamburgerMenuPage.page, screenshotDir, 'ChangePassword.png', testInfo);
                // await hamburgerMenuPage.clickCloseMyAccountOptions();
            });

            test('39-Verify Logout functionality', async ({ hamburgerMenuPage }, testInfo) => {
                await hamburgerMenuPage.verifyAndClickLogout();
                await ScreenshotHelper(hamburgerMenuPage.page, screenshotDir, 'Logout.png', testInfo);
                // Note: We do not click close options here as logout redirects us
            });
        });
        // test('3-Verify login and sign up button in hamburger window are visible', async ({ headerPage }, testInfo) => {
        //     await headerPage.verifyLoginAndSignUpButtons();
        //     await ScreenshotHelper(headerPage.page, screenshotDir, 'T3-login-signupButton.png', testInfo);
        // });

        test('5-Verify Betting Rules option in Quick Links drop down is visible and clickable inside Hamburger Menu', async ({ headerPage }, testInfo) => {
            await headerPage.verifyAndClickBettingRulesWithoutLogin();
            await ScreenshotHelper(headerPage.page, screenshotDir, 'T5-bettingRulesClicked.png', testInfo);
        });

        test('8-Verify Odds Format button with Decimal & Fractional options is visible and clickable in Hamburger Menu', async ({ headerPage }, testInfo) => {
            await headerPage.verifyOddsFormat();
            await ScreenshotHelper(headerPage.page, screenshotDir, 'T7-oddsFormat.png', testInfo);
        });

        test('4-Verify Statistics is visible and clickable in Hamburger Menu', async ({ headerPage }, testInfo) => {
            await headerPage.verifyStatistics();
            await ScreenshotHelper(headerPage.page, screenshotDir, 'T4-Statistics.png', testInfo);
            await headerPage.clickStatistics();
            await ScreenshotHelper(headerPage.page, screenshotDir, 'T4-Statistics2.png', testInfo);
        });

        test('5-Verify Insider Blog is visible and clickable in Hamburger Menu', async ({ headerPage }, testInfo) => {
            // Confirmed absent (live DOM check, 0 matches) from ZM's and TZ's hamburger menus.
            // Confirmed live (2026-10-12): BW's Quick Links section has only Statistics/Betway
            // Scores App/How To — no Insider Blog either.
            test.skip(['ZM', 'TZ', 'BW'].includes(activeRegion()), 'Insider Blog is not present in this region');
            await headerPage.verifyInsiderBlog();
            await ScreenshotHelper(headerPage.page, screenshotDir, 'T5-InsiderBlog.png', testInfo);
            await headerPage.clickInsiderBlog();
            await ScreenshotHelper(headerPage.page, screenshotDir, 'T5-InsiderBlog2.png', testInfo);
        });

        test('6-Verify Betway Scores App is visible and clickable in Hamburger Menu', async ({ headerPage }, testInfo) => {
            // Confirmed absent from ZM's hamburger menu entirely during the multi-region rollout.
            // Confirmed live: also absent from NG's hamburger menu (0 DOM matches for the text
            // anywhere on the page — the panel's real 12 items are My Gifts, My Profile, My Bets,
            // Bonus Summary, Transaction History, Responsible Gaming, My Casino Big Wins, Bet
            // Influencer, Promo Voucher, Betway Rewards, Live Chat, Log Out; no Betway Scores App).
            test.skip(['ZM', 'NG'].includes(activeRegion()), 'Betway Scores App is not present in this region');
            await headerPage.verifyBetwayScoresApp();
            await ScreenshotHelper(headerPage.page, screenshotDir, 'T6-BetwayScoresApp.png', testInfo);
            await headerPage.clickBetwayScoresApp();
            await ScreenshotHelper(headerPage.page, screenshotDir, 'T6-BetwayScoresApp2.png', testInfo);
        });

        // Re-verified live (2026-09-07): the real failure was a strict-mode violation (a hidden
        // duplicate "How To Bet" link) plus a false-positive pointer-interception on click — both
        // fixed in HeaderPage.ts (loc.howTo now uses first(), clickHowTo() force-clicks).
        test('8-Verify How to is visible and clickable in Hamburger Menu', async ({ headerPage }, testInfo) => {
            await headerPage.verifyHowToOption();
            await ScreenshotHelper(headerPage.page, screenshotDir, 'T8-HowTo.png', testInfo);
            await headerPage.clickHowTo();
            await ScreenshotHelper(headerPage.page, screenshotDir, 'T8-HowTo2.png', testInfo);
        });

        // test('9-Verify Responsible gaming is visible and clickable in Hamburger Menu', async ({ headerPage }, testInfo) => {
        //     await headerPage.verifyResponsibleGamingOption();
        //     await ScreenshotHelper(headerPage.page, screenshotDir, 'T9-ResponsibleGaming.png', testInfo);
        //     await headerPage.clickResponsibleGaming();
        //     await ScreenshotHelper(headerPage.page, screenshotDir, 'T9-ResponsibleGaming2.png', testInfo);
        // });

        // test('T2-Veify presence and functionality of all Balance fields in Hamburger Menu', async ({ hamburgerMenuPage }, testInfo) => {
        //     await hamburgerMenuPage.verifyAllBalanceFields();
        //     await ScreenshotHelper(hamburgerMenuPage.page, screenshotDir, 'T2-balanceFields.png', testInfo);
        // });

        // test('T3-Verify Refresh Balance button is visible and clickable in Hamburger Menu', async ({ hamburgerMenuPage }, testInfo) => {
        //     await hamburgerMenuPage.verifyRefreshBalance();
        //     await ScreenshotHelper(hamburgerMenuPage.page, screenshotDir, 'T3-refreshBalanceButton.png', testInfo);
        // });

        //  test('14-Verify functionality of close Hamburger button', async ({ hamburgerMenuPage }, testInfo) => {
        //     await hamburgerMenuPage.verifyCloseHamburgerBtn();
        //     await ScreenshotHelper(hamburgerMenuPage.page, screenshotDir, 'T15-eyeButton.png', testInfo);
        // });

        // // // With Login
        // test('16-Verify Betway Logo is visible on Homepage', async ({ headerPage }, testInfo) => {
        //     await headerPage.Login();
        //     await headerPage.page.waitForTimeout(3000);
        //     await headerPage.verifyBetwayLogoHeader();
        //     await ScreenshotHelper(headerPage.page, screenshotDir, 'T23-header-logo-loggedin.png', testInfo);
        // });

        // test('17-Verify Hamburger menu is visible and clickable after login', async ({ headerPage }, testInfo) => {
        //     await headerPage.Login();
        //     await headerPage.verifyHamburgerMenu();
        //     await ScreenshotHelper(headerPage.page, screenshotDir, 'T24-hamburgerButton-loggedin.png', testInfo);
        //     await headerPage.clickHamburgerMenu();
        //     await ScreenshotHelper(headerPage.page, screenshotDir, 'T24-hamburgerMenu-loggedin.png', testInfo);
        // });

        // test('18-Verify Quick Links drop down is visible and clickable in Hamburger Menu', async ({ headerPage }, testInfo) => {
        //     await headerPage.Login();
        //     await headerPage.verifyAndClickQuickLinksDropdown();
        //     await ScreenshotHelper(headerPage.page, screenshotDir, 'T25-quickLinks2-loggedin.png', testInfo);
        // });

        // test('19-Verify Betting Rules option in Quick Links drop down is visible and clickable inside Hamburger Menu', async ({ headerPage }, testInfo) => {
        //     await headerPage.Login();
        //     await headerPage.page.waitForTimeout(3000);
        //     await headerPage.clickHamburgerMenu();
        //     await headerPage.clickQuickLinks();
        //     await headerPage.verifyAndClickBettingRules();
        //     await ScreenshotHelper(headerPage.page, screenshotDir, 'T26-bettingRulesClicked-loggedin.png', testInfo);
        // });

        // test('20-Verify Statistics option in Quick Links drop down is visible and clickable inside Hamburger Menu', async ({ headerPage }, testInfo) => {
        //     await headerPage.Login();
        //     await headerPage.page.waitForTimeout(3000);
        //     await headerPage.clickHamburgerMenu();
        //     await headerPage.clickQuickLinks();
        //     await headerPage.verifyAndClickStatistics();
        //     await ScreenshotHelper(headerPage.page, screenshotDir, 'T27-statisticsClicked-loggedin.png', testInfo);
        // });

        // test('21-Verify Odds Format button with Decimal & Fractional options is visible and clickable in Hamburger Menu', async ({ headerPage }, testInfo) => {
        //     await headerPage.Login();
        //     await headerPage.verifyOddsFormat();
        //     await ScreenshotHelper(headerPage.page, screenshotDir, 'T29-oddsFormat-loggedin.png', testInfo);
        // });

        // test('22-Verify Close button is visible and clickable in Hamburger Menu', async ({ headerPage }, testInfo) => {
        //     await headerPage.Login();
        //     await headerPage.clickHamburgerMenu();
        //     await highlightElementBorder(headerPage.closeHamburgerMenu);
        //     await ScreenshotHelper(headerPage.page, screenshotDir, 'T30-closeHamburgerMenu-loggedin.png', testInfo);
        //     await headerPage.closeHamburgerMenu.click();
        // });

        // test('23-Verify My account drop down is visible and clickable in Hamburger Menu', async ({ headerPage }, testInfo) => {
        //     await headerPage.verifyAndClickMyAccount();
        //     await ScreenshotHelper(headerPage.page, screenshotDir, 'T31-myAccountClicked-loggedin.png', testInfo);
        // });

    });
}
