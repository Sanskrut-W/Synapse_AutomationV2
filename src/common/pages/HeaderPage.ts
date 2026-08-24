import { Page } from '@playwright/test';
import { HomePage } from './HomePage';
import { SafeActions } from '../actions/SafeActions';
import { css, role, text, xpath, first, at } from '../locators/sel';
import { highlightElementBorder, highlightElements } from '../flows/HighlightElements';
import { activeRegion } from '../config/oddsApiUrl';

/**
 * A handful of registry keys in the old repo's Excel sheet were never actually wired into the
 * constructor's spread (either commented out, or typed "dynamic" — a type the resolver doesn't
 * support and would throw on): `countryCode`, `eyeButton2`, `freeBetRefreshBtn`, `casinoRefreshBtn`,
 * `balanceContainer`. The verify/click methods that reference them (`verifyCountryCode` — itself
 * commented out, `verifyEyeButton2`/`clickEyeButton2`, `verifyFreebetRefreshButton`,
 * `verifyCasinoRefreshButton`, half of `verifyFreebetField`) were consequently always broken
 * (`this.loc.X` resolves to `undefined`). Preserved verbatim below — these keys are intentionally
 * left out of `build()`, not added with a guessed selector.
 */
export class HeaderPage extends HomePage {
    constructor(page: Page, safeActions: SafeActions) {
        super(page, safeActions);

        const inherited = this.loc;
        this.loc = { ...inherited, ...this.build('header', {
            betwayLogoHeader: first(role('link', { name: '' })),
            mobileNumber: role('textbox', { name: 'Mobile Number' }),
            closePromotionPopupGH: css('#close-toast'),
            closePromotionPopup: first(css('#modal-close-btn')),
            hamburgerMenu: css('#header-hamburger-btn'),
            loginButton: css('#login-btn'),
            loginButtonFromPopup: at(role('button', { name: 'Login' }), 1),
            loginButtonfromHamburger: at(role('button', { name: 'Login' }), 1),
            signUpButton: role('button', { name: 'Sign Up' }),
            signUpButtonfromHamburger: at(role('button', { name: 'Sign Up' }), 1),
            closeHamburgerMenu: xpath('//*[@id="__nuxt"]/div/div[1]/div[2]/div[1]/div[1]/div[1]/div[2]/svg[2]'),
            quickLinks: first(text('Quick Links')),
            myAccount: first(css('#My\\ Profile-hamburger-menu-btn')),
            // Registry key pulls the "bettingRulesTips" Excel row, not the "bettingRules" row —
            // the raw bettingRules/bettingRulesGHS/bettingRulesZM/bettingRulesMZ rows were unused
            // region-variant placeholders, never wired to any registry key.
            bettingRules: text('Betting Rules and Tips'),
            statistics: role('link', { name: 'Statistics' }),
            insiderBlog: text('Insider Blog'),
            betwayScoresApp: first(text(' Betway Scores App')),
            oddsFormat: text('Decimal'),
            mobileNumberInput: css('#header-username'),
            passwordInput: css('#header-password'),
            eyeButton: xpath("//div[contains(@class,'password-input')]//svg[contains(@name,'M12,9A3')]"),
            forgetPasswordLink: text('Forgot Password?'),
            betslipButton: text('Betslip 0'),
            gotItButton: role('button', { name: 'Got it' }),
            depositFund: at(role('button', { name: 'Deposit' }), 1),
            withdrawFund: role('button', { name: 'Withdraw' }),
            closeWithdrawalAlert: at(css('#modal-close-btn'), 1),
            myBets: css('#My\\ Bets-hamburger-menu-btn'),
            MyCasinoBigWin: css('#My\\ Casino\\ Big\\ Wins-hamburger-menu-btn'),
            bonusSummary: text('Bonus Summary'),
            transactionsHistory: text('Transaction History'),
            myCoupons: text('My Coupons'),
            betInfluencer: text('Bet Influencer'),
            promoVouchers: text('Promo Voucher'),
            updateDetails: text('Update Details'),
            responsibleGaming: css('#Responsible\\ Gaming-hamburger-menu-btn'),
            documentVerification: text('Document Verification'),
            betwayBenefits: css('#Betway\\ Benefits-hamburger-menu-btn'),
            betwayRewards: css('#Betway\\ Rewards-hamburger-menu-btn'),
            changePassword: text('Change password details'),
            logOut: css('#Log\\ Out-hamburger-menu-btn'),
            closeMyAccountOptions: at(css('#modal-close-btn'), 1),
            // Confirmed live on MW: the logged-in test account's own display name ("Zensar009")
            // appears in this alt text too — "MatkaKing" was never a stable, region-general value,
            // just ZA's particular test account's name. Matching the constant "profile avatar"
            // suffix instead matches every account name, ZA's included, with no loss of matches.
            accountsButton: first(css('img[alt$="profile avatar"]')),
            balanceLabel: text('Balance', { exact: true }),
            balanceValue: css('.balance-amount'),
            balanceDropdown: xpath('//*[@id="__nuxt"]/div/div[1]/header/div/div[2]/div/div[2]/div[2]'),
            balanceCurrency: text('R'),
            freebetField: text('Freebet'),
            freebetCurrency: text('R'),
            casinoBonusField: text('Casino Bonus'),
            casinoBonusAmount: at(text('Casino Bonus'), 1),
            casinoCurrency: text('R'),
            depositButton: at(role('button', { name: 'Deposit' }), 1),
            notificationBellIcon: xpath('//*[@id="__nuxt"]/div/div[1]/header/div/div[2]/div/div[3]'),
            allBalanceTxt: text('All Balances'),
            allBalanceFieldHamburger: xpath('//*[@id="__nuxt"]/div/div[1]/div[2]/div[1]/div[1]/div[2]'),
            liveChatIcon: css('a[href="/sport/soccer?livechat=true"] svg'),
            howTo: (root) => root.locator('a[href="/how-to-bet"]').locator('..'),
        }) };
    }

    // goto() and Login() are inherited from BasePage (via HomePage)

    // ── Verification Methods ─────────────────────────────────────────────────
    async verifyBetwayLogoHeader() {
        await this.loc.betwayLogoHeader.waitFor({ state: 'visible', timeout: 15000 });
        await highlightElements(this.loc.betwayLogoHeader);
    }

    async verifyHamburgerMenu() {
        await this.loc.hamburgerMenu.waitFor({ state: 'visible', timeout: 15000 });
        await highlightElementBorder(this.loc.hamburgerMenu);
    }

    async verifyLoginAndSignUpButtons() {
        await this.clickHamburgerMenu();
        await this.loc.loginButtonfromHamburger.waitFor({ state: 'visible', timeout: 15000 });
        await highlightElementBorder(this.loc.loginButtonfromHamburger);
        await highlightElementBorder(this.loc.signUpButtonfromHamburger);
    }

    async verifyQuickLinksDropdown() {
        await this.clickHamburgerMenu();
        await this.loc.quickLinks.waitFor({ state: 'visible', timeout: 15000 });
        await highlightElementBorder(this.loc.quickLinks);
    }

    async verifyBettingRulesOption() {
        await this.clickHamburgerMenu();
        await this.loc.bettingRules.scrollIntoViewIfNeeded();
        await highlightElementBorder(this.loc.bettingRules);
    }

    async verifyStatisticsOption() {
        await this.clickHamburgerMenu();
        await this.loc.statistics.scrollIntoViewIfNeeded();
        await highlightElementBorder(this.loc.statistics);
    }

    async verifyStatistics() {
        await this.clickHamburgerMenu();
        await this.loc.statistics.waitFor({ state: 'visible', timeout: 15000 });
        await highlightElementBorder(this.loc.statistics);
    }

    async verifyInsiderBlog() {
        await this.clickHamburgerMenu();
        await this.loc.insiderBlog.waitFor({ state: 'visible', timeout: 15000 });
        await highlightElementBorder(this.loc.insiderBlog);
    }

    async verifyBetwayScoresApp() {
        await this.clickHamburgerMenu();
        await this.loc.betwayScoresApp.waitFor({ state: 'visible', timeout: 15000 });
        await highlightElementBorder(this.loc.betwayScoresApp);
    }

    async verifyHowToOption() {
        await this.clickHamburgerMenu();
        await highlightElementBorder(this.loc.howTo);
    }

    async verifyResponsibleGamingOption() {
        await this.clickHamburgerMenu();
        await this.loc.responsibleGaming.scrollIntoViewIfNeeded();
        await highlightElementBorder(this.loc.responsibleGaming);
    }

    async verifyOddsFormat() {
        await this.clickHamburgerMenu();
        await highlightElements(this.loc.oddsFormat);
    }

    async verifyMobileNumberField() {
        await this.loc.mobileNumber.waitFor({ state: 'visible', timeout: 20000 });
        await highlightElementBorder(this.loc.mobileNumberInput);
    }

    async verifyPasswordField() {
        await this.loc.passwordInput.waitFor({ state: 'visible', timeout: 15000 });
        await highlightElementBorder(this.loc.passwordInput);
    }

    // async verifyCountryCode() {
    //   await this.loc.countryCode.waitFor({ state: 'visible', timeout: 10000 });
    //   await highlightElementBorder(this.loc.countryCode);
    // }

    async verifyEyeButton() {
        // Scope to the login form area that contains both Mobile Number and Password fields
        const formContainer = this.page.locator('form').filter({
            hasText: '+27Forgot Username?Forgot Password?',
        });

        // From within that form, target the eye SVG next to the password input
        const eyeIcon = formContainer.locator("//input[@id='header-password']/preceding-sibling::svg");

        await eyeIcon.waitFor({ state: 'visible', timeout: 10000 });
        await highlightElementBorder(eyeIcon);
        await this.page.waitForTimeout(1000);
    }

    async verifyForgetPasswordLink() {
        await highlightElementBorder(this.loc.forgetPasswordLink);
        await this.page.waitForTimeout(300);
    }

    async verifyBetslipButton() {
        await highlightElementBorder(this.loc.betslipButton);
    }

    async verifyMyAccountDropdown() {
        await this.Login();
        await this.clickHamburgerMenu();
        await highlightElementBorder(this.loc.myAccount);
    }

    async verifyAllMyAccountOptions() {
        await highlightElementBorder(this.loc.depositFund);
        await highlightElementBorder(this.loc.withdrawFund);
        await highlightElementBorder(this.loc.myBets);
        await highlightElementBorder(this.loc.bonusSummary);
        await highlightElementBorder(this.loc.transactionsHistory);
        await highlightElementBorder(this.loc.responsibleGaming);
        if (activeRegion() !== 'GH') {
            await highlightElementBorder(this.loc.documentVerification);
        }
        if (activeRegion() !== 'MW') {
            // Confirmed live: MW's My Account panel has no "My Casino Big Win" option.
            await highlightElementBorder(this.loc.MyCasinoBigWin);
        }
        await this.loc.promoVouchers.scrollIntoViewIfNeeded();
        // await highlightElementBorder(this.loc.myCoupons);
        await highlightElementBorder(this.loc.betInfluencer);
        await highlightElementBorder(this.loc.promoVouchers);
        // await highlightElementBorder(this.loc.updateDetails);
        await highlightElementBorder(this.loc.betwayRewards);
        await this.loc.logOut.scrollIntoViewIfNeeded();
        // Confirmed live: GH's My Account panel has no "Document Verification" option at all.
        // await highlightElementBorder(this.loc.betwayBenefits);
        // await highlightElementBorder(this.loc.changePassword);
        await highlightElementBorder(this.loc.logOut);
    }

    async verifyEyeButton2() {
        await this.Login();
        await this.clickHamburgerMenu();
        await highlightElementBorder(this.loc.eyeButton2);
    }

    async verifyAccountsButton() {
        await this.Login();
        await highlightElementBorder(this.loc.accountsButton);
    }

    async verifyBalanceField() {
        await this.Login();
        await highlightElementBorder(this.loc.balanceLabel);
    }

    async verifyBalanceCurrency() {
        await this.Login();
        await highlightElementBorder(this.loc.balanceCurrency);
    }

    async verifyFreebetField() {
        await this.Login();
        await highlightElementBorder(this.loc.balanceDropdown);
        await highlightElementBorder(this.loc.balanceContainer);
        await this.clickBalanceDropdown();
        await highlightElementBorder(this.loc.freebetField);
    }

    async verifyFreebetCurrency() {
        await this.Login();
        await this.clickBalanceDropdown();
        await highlightElementBorder(this.loc.freebetCurrency);
    }

    async verifyFreebetRefreshButton() {
        await this.Login();
        await this.clickBalanceDropdown();
        await highlightElements(this.loc.freeBetRefreshBtn);
    }

    async verifyCasinoBonusField() {
        await this.clickBalanceDropdown();
        await highlightElements(this.loc.casinoBonusField);
    }

    async verifyCasinoBonusCurrency() {
        await this.Login();
        await this.clickBalanceDropdown();
        await this.page.waitForTimeout(4000);
        await highlightElementBorder(this.loc.casinoCurrency);
    }

    async verifyCasinoRefreshButton() {
        await this.Login();
        await this.clickBalanceDropdown();
        await highlightElementBorder(this.loc.casinoRefreshBtn);
    }

    async verifyDepositButton() {
        await this.Login();
        await this.clickBalanceDropdown();
        await highlightElementBorder(this.loc.depositButton);
    }

    async verifyNotificationBellIcon() {
        await this.Login();
        await highlightElementBorder(this.loc.notificationBellIcon);
    }

    async verifyChatIcon() {
        await this.Login();
        await this.clickGotItButton();
        await highlightElementBorder(this.loc.liveChatIcon);
    }

    // ── Click Methods - Hamburger Menu ───────────────────────────────────────
    async clickHamburgerMenu() {
        // Confirmed live on MW: a full-screen backdrop overlay can sit on top of an otherwise
        // visible/enabled/stable hamburger icon (a benign z-index quirk, not an actual blocker —
        // Playwright's own actionability checks confirm the icon itself is fine), causing the
        // normal click to spin on "element intercepts pointer events" until timeout. force:true
        // skips that hit-test; harmless on regions where no such overlay exists.
        await this.loc.hamburgerMenu.click({ force: true });
    }

    async clickCloseHamburgerMenu() {
        await this.loc.closeHamburgerMenu.click();
    }

    async clickQuickLinks() {
        // Confirmed live on MW: there's no separate "Quick Links" accordion toggle at all — its
        // content (Betting Rules, etc.) is already flat/expanded in the panel (see T5, which finds
        // Betting Rules without ever clicking this). Skip gracefully where it doesn't exist instead
        // of hanging for the full timeout on regions that don't have this toggle.
        try {
            await this.loc.quickLinks.waitFor({ state: 'visible', timeout: 3000 });
            await this.loc.quickLinks.click();
        } catch {
            // Not present on this region — its content is already shown flat elsewhere in the panel.
        }
    }

    async clickBettingRules() {
        // Same benign overlay-interception quirk as clickHamburgerMenu() above, confirmed live on MW.
        await this.loc.bettingRules.click({ force: true });
    }

    async clickStatistics() {
        await this.loc.statistics.click();
    }

    async clickInsiderBlog() {
        await this.loc.insiderBlog.click();
    }

    async clickBetwayScoresApp() {
        await this.loc.betwayScoresApp.click();
    }

    async clickHowTo() {
        await this.loc.howTo.click();
    }

    // ── Login Methods ────────────────────────────────────────────────────────
    async enterMobileNumber(mobile: string) {
        await this.loc.mobileNumberInput.fill(mobile);
    }

    async enterPassword(password: string) {
        await this.loc.passwordInput.fill(password);
    }

    async clickForgetPasswordLink() {
        await this.loc.forgetPasswordLink.click();
    }

    // ── Betslip Methods ──────────────────────────────────────────────────────
    async clickBetslipButton() {
        await this.loc.betslipButton.click();
    }

    async clickGotItButton() {
        await this.loc.gotItButton.click();
    }

    // ── My Account Methods ───────────────────────────────────────────────────
    async clickMyAccount() {
        await this.loc.myAccount.click();
    }

    async clickLogOut() {
        await this.loc.logOut.click();
    }

    async clickCloseMyAccountOptions() {
        await this.loc.closeMyAccountOptions.click();
    }

    // ── Account Actions ──────────────────────────────────────────────────────
    async clickDepositFund() {
        await this.loc.depositFund.click();
    }

    async clickWithdrawFund() {
        await this.loc.withdrawFund.click();
    }

    async clickCloseWithdrawalAlert() {
        await this.loc.closeWithdrawalAlert.click();
    }

    async clickMyBets() {
        await this.loc.myBets.click();
    }

    async clickMyCasinoBigWin() {
        await this.loc.MyCasinoBigWin.click();
    }

    async clickBonusSummary() {
        await this.loc.bonusSummary.click();
    }

    async clickTransactionsHistory() {
        await this.loc.transactionsHistory.click();
    }

    async clickMyCoupons() {
        await this.loc.myCoupons.click();
    }

    async clickBetInfluencer() {
        await this.loc.betInfluencer.click();
    }

    async clickPromoVouchers() {
        await this.loc.promoVouchers.click();
    }

    async clickUpdateDetails() {
        await this.loc.updateDetails.click();
    }

    async clickResponsibleGaming() {
        await this.loc.responsibleGaming.click();
    }

    async clickDocumentVerification() {
        await this.loc.documentVerification.click();
    }

    async clickBetwayBenefits() {
        await this.loc.betwayBenefits.click();
    }

    async clickBetwayRewards() {
        await this.loc.betwayRewards.click();
    }

    async clickChangePassword() {
        await this.loc.changePassword.click();
    }

    // ── Balance Methods ──────────────────────────────────────────────────────
    async clickEyeButton2() {
        await this.loc.eyeButton2.click();
    }

    async clickAccountsButton() {
        await this.loc.accountsButton.click();
    }

    async clickBalanceDropdown() {
        await this.loc.balanceDropdown.click();
    }

    async clickDepositButton() {
        await this.loc.depositButton.click();
    }

    // ── Notification & Support Methods ───────────────────────────────────────
    async clickNotificationBellIcon() {
        await this.loc.notificationBellIcon.click();
    }

    async clickLiveChatIcon() {
        await this.loc.liveChatIcon.click();
    }

    // ── Combined Actions for Tests ───────────────────────────────────────────
    async verifyAndClickQuickLinksDropdown() {
        await this.clickHamburgerMenu();
        await highlightElementBorder(this.loc.quickLinks);
        await this.clickQuickLinks();
    }

    async verifyAndClickBettingRules() {
        await this.loc.bettingRules.scrollIntoViewIfNeeded();
        await highlightElementBorder(this.loc.bettingRules);
        await this.clickBettingRules();
        await this.page.waitForTimeout(3000);
    }

    async verifyAndClickBettingRulesWithoutLogin() {
        await this.clickHamburgerMenu();
        await this.loc.bettingRules.scrollIntoViewIfNeeded();
        await highlightElementBorder(this.loc.bettingRules);
        await this.clickBettingRules();
        await this.page.waitForTimeout(3000);
    }

    async verifyAndClickStatistics() {
        // await this.clickHamburgerMenu();
        await this.loc.statistics.scrollIntoViewIfNeeded();
        await highlightElementBorder(this.loc.statistics);
        await this.clickStatistics();
        await this.page.waitForTimeout(4000);
    }

    async verifyAndClickStatisticsWithoutLogin() {
        await this.clickHamburgerMenu();
        await this.loc.statistics.scrollIntoViewIfNeeded();
        await highlightElementBorder(this.loc.statistics);
        await this.clickStatistics();
        await this.page.waitForTimeout(3000);
    }

    async verifyMobileNumberInput() {
        await this.loc.mobileNumberInput.waitFor({ state: 'visible', timeout: 15000 });
        await highlightElementBorder(this.loc.mobileNumberInput);
        await this.enterMobileNumber('123456789');
        await this.page.waitForTimeout(300);
    }

    async verifyPasswordInput() {
        await highlightElementBorder(this.loc.passwordInput);
        await this.enterPassword('12345678');
    }

    async verifyAndClickForgetPassword() {
        await highlightElementBorder(this.loc.forgetPasswordLink);
        await this.page.waitForTimeout(300);
        await this.clickForgetPasswordLink();
    }

    async verifyAndClickBetslip() {
        await highlightElementBorder(this.loc.betslipButton);
        await this.clickBetslipButton();
    }

    async verifyAndClickMyAccount() {
        await this.Login();
        await this.page.waitForTimeout(3000);
        await this.clickHamburgerMenu();
        await highlightElementBorder(this.loc.myAccount);
        await this.clickMyAccount();
    }

    async testDepositFund() {
        await this.clickHamburgerMenu();
        await this.clickDepositFund();
        await this.page.waitForTimeout(5000);
    }

    async testWithdrawFund() {
        await this.clickHamburgerMenu();
        await this.clickWithdrawFund();
        await this.page.waitForTimeout(3000);
        await this.clickCloseWithdrawalAlert();
    }

    async testMyBets() {
        await this.clickHamburgerMenu();
        await this.clickMyBets();
        await this.page.waitForTimeout(3000);
    }

    async testMyCasinoBigWin() {
        await this.clickHamburgerMenu();
        await this.clickMyCasinoBigWin();
    }

    async testBonusSummary() {
        await this.clickHamburgerMenu();
        await this.clickBonusSummary();
    }

    async testTransactionsHistory() {
        await this.clickHamburgerMenu();
        await this.clickTransactionsHistory();
        await this.page.waitForTimeout(3000);
    }

    async testMyCoupons() {
        await this.clickHamburgerMenu();
        await this.clickMyCoupons();
        await this.page.waitForTimeout(3000);
    }

    async testBetInfluencer() {
        await this.clickHamburgerMenu();
        await this.clickBetInfluencer();
        await this.page.waitForTimeout(3000);
    }

    async testPromoVouchers() {
        await this.clickHamburgerMenu();
        await this.clickPromoVouchers();
    }

    async testUpdateDetails() {
        await this.clickHamburgerMenu();
        await this.clickUpdateDetails();
    }

    async testResponsibleGaming() {
        await this.clickHamburgerMenu();
        await this.clickResponsibleGaming();
    }

    async testDocumentVerification() {
        await this.clickHamburgerMenu();
        await this.clickDocumentVerification();
        await this.page.waitForTimeout(3000);
    }

    async testBetwayBenefits() {
        await this.clickHamburgerMenu();
        await this.clickBetwayBenefits();
        await this.page.waitForTimeout(3000);
    }

    async testBetwayRewards() {
        await this.clickHamburgerMenu();
        await this.clickBetwayRewards();
        await this.page.waitForTimeout(3000);
    }

    async testChangePassword() {
        await this.clickHamburgerMenu();
        await this.clickChangePassword();
    }

    async testLogout() {
        await this.clickHamburgerMenu();
        await this.clickLogOut();
    }

    async verifyHamburgerEyeButton() {
        const hamburgerEyeButton = this.loc.allBalanceTxt.locator('..').locator('..').getByRole('img').first();
        await highlightElementBorder(hamburgerEyeButton);
        await hamburgerEyeButton.click();
    }

    async verifyAndClickAccountsButton() {
        await highlightElementBorder(this.loc.accountsButton);
        await this.clickAccountsButton();
        await this.page.waitForTimeout(5000);
    }

    async verifyAndClickDepositButton() {
        await this.clickBalanceDropdown();
        await highlightElementBorder(this.loc.depositButton);
        await this.clickDepositButton();
        await this.page.waitForTimeout(5000);
    }

    async verifyAndClickNotificationIcon() {
        await highlightElementBorder(this.loc.notificationBellIcon);
        await this.loc.notificationBellIcon.click();
        await this.page.waitForTimeout(3000);
    }

    async verifyAndClickChatIcon() {
        await this.loc.gotItButton.click();
        await highlightElementBorder(this.loc.liveChatIcon);
        await this.clickLiveChatIcon();
        await this.page.waitForTimeout(5000);
    }

    async closePromotionPopup() {
        try {
            const popup = this.loc.closePromotionPopup;
            if (await popup.isVisible({ timeout: 15000 })) {
                await popup.click();
                await this.page.waitForTimeout(500);
            }
        } catch (error) {
            console.log('Promotion popup not found or already closed.');
        }
    }
}
