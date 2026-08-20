import { Page } from '@playwright/test';
import { HeaderPage } from './HeaderPage';
import { SafeActions } from '../actions/SafeActions';
import { css, xpath } from '../locators/sel';
import { highlightElementBorder } from '../flows/HighlightElements';

export class HamburgerMenuPage extends HeaderPage {
    constructor(page: Page, safeActions: SafeActions) {
        super(page, safeActions);

        const inherited = this.loc;
        this.loc = { ...inherited, ...this.build('hamburgerMenu', {
            refreshBalHam: xpath('//*[@id="__nuxt"]/div/div[1]/div[2]/div[1]/div[1]/div[2]/div/div[1]/div[1]/svg'),
            hideBalanceHamburger: css('div.mr-2 > svg.w-6.h-6.cursor-pointer'),
            closeHamburger: (root) => root
                .locator('xpath=/html/body/div[98]/div/div[2]/div/div/div[1]/div[1]/div[1]/div/details/summary/div/div[1]/div[2]')
                .locator('svg')
                .nth(1),
        }) };
    }

    // goto() is inherited from BasePage (via HeaderPage)

    // ==========================================
    // Verify and Click Methods
    // Note: We DO NOT click hamburgerMenu here because beforeEach handles it
    // ==========================================

    async verifyEyeButton2() {
        await this.Login();
        await this.clickHamburgerMenu();
        await this.loc.hideBalanceHamburger.waitFor({ state: 'visible' });
        await this.loc.hideBalanceHamburger.click();
        await highlightElementBorder(this.loc.hideBalanceHamburger);
    }

    async verifyRefreshBalance() {
        await this.Login();
        await this.clickHamburgerMenu();
        await this.loc.refreshBalHam.waitFor({ state: 'visible' });
        await highlightElementBorder(this.loc.refreshBalHam);
        await this.loc.refreshBalHam.click();
    }

    async verifyCloseHamburgerBtn() {
        await this.Login();
        await this.clickHamburgerMenu();
        await this.loc.closeHamburger.waitFor({ state: 'visible' });
        await highlightElementBorder(this.loc.closeHamburger);
        await this.loc.closeHamburger.click();
    }

    async verifyAndClickDepositButton() {
        // Ensure element is ready before interacting
        await this.loc.depositFund.waitFor({ state: 'visible' });
        await highlightElementBorder(this.loc.depositFund);
        await this.clickDepositFund();
        await this.page.waitForTimeout(5000);
    }

    async verifyAndClickWithdrawFund() {
        await this.loc.withdrawFund.waitFor({ state: 'visible' });
        await highlightElementBorder(this.loc.withdrawFund);
        await this.clickWithdrawFund();
        await this.page.waitForTimeout(3000);
    }

    async verifyAndClickMyBets() {
        await highlightElementBorder(this.loc.myBets);
        await this.clickMyBets();
        await this.page.waitForTimeout(3000);
    }

    async verifyAndClickMyCasinoBigWin() {
        await highlightElementBorder(this.loc.MyCasinoBigWin);
        await this.clickMyCasinoBigWin();
        await this.page.waitForTimeout(3000);
    }

    async verifyAndClickBonusSummary() {
        await highlightElementBorder(this.loc.bonusSummary);
        await this.clickBonusSummary();
        await this.page.waitForTimeout(3000);
    }

    async verifyAndClickTransactionsHistory() {
        await highlightElementBorder(this.loc.transactionsHistory);
        await this.clickTransactionsHistory();
        await this.page.waitForTimeout(3000);
    }

    async verifyAndClickMyCoupons() {
        await highlightElementBorder(this.loc.myCoupons);
        await this.clickMyCoupons();
        await this.page.waitForTimeout(3000);
    }

    async verifyAndClickBetInfluencer() {
        await highlightElementBorder(this.loc.betInfluencer);
        await this.clickBetInfluencer();
        await this.page.waitForTimeout(3000);
    }

    async verifyAndClickPromoVouchers() {
        await this.loc.promoVouchers.scrollIntoViewIfNeeded();
        await highlightElementBorder(this.loc.promoVouchers);
        await this.clickPromoVouchers();
        await this.page.waitForTimeout(3000);
    }

    async verifyAndClickUpdateDetails() {
        await this.loc.updateDetails.scrollIntoViewIfNeeded();
        await highlightElementBorder(this.loc.updateDetails);
        await this.clickUpdateDetails();
        await this.page.waitForTimeout(3000);
    }

    async verifyAndClickResponsibleGaming() {
        await this.loc.responsibleGaming.scrollIntoViewIfNeeded();
        await highlightElementBorder(this.loc.responsibleGaming);
        await this.clickResponsibleGaming();
        await this.page.waitForTimeout(3000);
    }

    async verifyAndClickDocumentVerification() {
        await this.loc.documentVerification.scrollIntoViewIfNeeded();
        await highlightElementBorder(this.loc.documentVerification);
        await this.clickDocumentVerification();
        await this.page.waitForTimeout(3000);
    }

    async verifyAndClickBetwayBenefits() {
        await this.loc.betwayBenefits.scrollIntoViewIfNeeded();
        await highlightElementBorder(this.loc.betwayBenefits);
        await this.clickBetwayBenefits();
        await this.page.waitForTimeout(3000);
    }

    async verifyAndClickBetwayRewards() {
        await this.loc.betwayRewards.scrollIntoViewIfNeeded();
        await highlightElementBorder(this.loc.betwayRewards);
        await this.clickBetwayRewards();
        await this.page.waitForTimeout(3000);
    }

    async verifyAndClickChangePassword() {
        await this.loc.changePassword.scrollIntoViewIfNeeded();
        await highlightElementBorder(this.loc.changePassword);
        await this.clickChangePassword();
        await this.page.waitForTimeout(3000);
    }

    async verifyAndClickLogout() {
        await this.loc.logOut.scrollIntoViewIfNeeded();
        await highlightElementBorder(this.loc.logOut);
        await this.clickLogOut();
        await this.page.waitForTimeout(3000);
    }
}
