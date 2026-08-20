import { expect, Page } from '@playwright/test';
import { HomePage } from './HomePage';
import { SafeActions } from '../actions/SafeActions';
import { text, first } from '../locators/sel';
import { highlightElements } from '../flows/HighlightElements';

export class HowToPage extends HomePage {
    constructor(page: Page, safeActions: SafeActions) {
        super(page, safeActions);

        const inherited = this.loc;
        this.loc = { ...inherited, ...this.build('howTo', {
            howToBet: first(text(/How To Bet/i)),
            howToResetPassword: first(text(/How to reset your password/i)),
            howToDeposit: first(text(/How To Deposit/i)),
            howToRegister: first(text(/How To Register/i)),
            howToWithdraw: first(text(/How To Withdraw/i)),
            howToBetgames: first(text(/How To Betgames/i)),
            howToCasino: first(text(/How to Casino/i)),
            howToFica: first(text(/how-to-fica/i)),
            howToSMS: first(text(/How To Bet SMS/i)),
            howToJackpot: first(text(/How To Jackpot/i)),
        }) };
    }

    async verifyHowToPageOptions() {
        await this.loc.howToBet.waitFor({ state: 'visible', timeout: 10000 });
        await highlightElements(this.loc.howToBet);
        await this.loc.howToResetPassword.waitFor({ state: 'visible', timeout: 10000 });
        await highlightElements(this.loc.howToResetPassword);
        await this.loc.howToDeposit.waitFor({ state: 'visible', timeout: 10000 });
        await highlightElements(this.loc.howToDeposit);
        await this.loc.howToRegister.waitFor({ state: 'visible', timeout: 10000 });
        await highlightElements(this.loc.howToRegister);
        await this.loc.howToWithdraw.waitFor({ state: 'visible', timeout: 10000 });
        await highlightElements(this.loc.howToWithdraw);
        await this.loc.howToBetgames.waitFor({ state: 'visible', timeout: 10000 });
        await highlightElements(this.loc.howToBetgames);
        await this.loc.howToCasino.waitFor({ state: 'visible', timeout: 10000 });
        await highlightElements(this.loc.howToCasino);
        await this.loc.howToFica.waitFor({ state: 'visible', timeout: 10000 });
        await highlightElements(this.loc.howToFica);
        await this.loc.howToSMS.waitFor({ state: 'visible', timeout: 10000 });
        await highlightElements(this.loc.howToSMS);
    }

    async verifyHowToSMS() {
        await this.loc.howToSMS.waitFor({ state: 'visible', timeout: 10000 });
        await highlightElements(this.loc.howToSMS);
    }
    async verifyHowToFica() {
        await this.loc.howToFica.waitFor({ state: 'visible', timeout: 10000 });
        await highlightElements(this.loc.howToFica);
    }
    async verifyHowToCasino() {
        await this.loc.howToCasino.waitFor({ state: 'visible', timeout: 10000 });
        await highlightElements(this.loc.howToCasino);
    }
    async verifyHowToBetgames() {
        await this.loc.howToBetgames.waitFor({ state: 'visible', timeout: 10000 });
        await highlightElements(this.loc.howToBetgames);
    }
    async verifyHowToWithdraw() {
        await this.loc.howToWithdraw.waitFor({ state: 'visible', timeout: 10000 });
        await highlightElements(this.loc.howToWithdraw);
    }
    async verifyHowToRegister() {
        await this.loc.howToRegister.waitFor({ state: 'visible', timeout: 10000 });
        await highlightElements(this.loc.howToRegister);
    }
    async verifyHowToDeposit() {
        await this.loc.howToDeposit.waitFor({ state: 'visible', timeout: 10000 });
        await highlightElements(this.loc.howToDeposit);
    }
    async verifyHowToResetPassword() {
        await this.loc.howToResetPassword.waitFor({ state: 'visible', timeout: 10000 });
        await highlightElements(this.loc.howToResetPassword);
    }
    async verifyHowToBet() {
        await this.loc.howToBet.waitFor({ state: 'visible', timeout: 10000 });
        await highlightElements(this.loc.howToBet);
    }
    async verifyHowToJackpot() {
        await this.loc.howToJackpot.waitFor({ state: 'visible', timeout: 10000 });
        await highlightElements(this.loc.howToJackpot);
    }

    async clickHowToSMS() {
        await this.loc.howToSMS.click();
        await expect(this.page).toHaveURL(/.*how-to-bet-sms*/, { timeout: 15000 });
        await this.verifyHowToSMS();
    }

    async clickHowToJackpot() {
        await this.verifyHowToJackpot();
        await this.loc.howToJackpot.click();
        await expect(this.page).toHaveURL(/.*how-to-jackpot*/, { timeout: 15000 });
        await this.verifyHowToJackpot();
    }
    async clickHowToBetOption() {
        await this.loc.howToBet.click();
        await expect(this.page).toHaveURL(/.*how-to-bet*/, { timeout: 15000 });
        await this.verifyHowToBet();
    }
    async clickHowToResetPassword() {
        await this.loc.howToResetPassword.click();
        await expect(this.page).toHaveURL(/.*how-to-reset.*password.*/i, { timeout: 15000 });
        await this.verifyHowToResetPassword();
    }
    async clickHowToDeposit() {
        await this.loc.howToDeposit.click();
        await expect(this.page).toHaveURL(/.*how-to-deposit*/, { timeout: 15000 });
        await this.verifyHowToDeposit();
    }
    async clickHowToRegister() {
        await this.loc.howToRegister.click();
        await expect(this.page).toHaveURL(/.*how-to-register*/, { timeout: 15000 });
        await this.verifyHowToRegister();
    }
    async clickHowToWithdraw() {
        await this.loc.howToWithdraw.click();
        await expect(this.page).toHaveURL(/.*how-to-withdraw*/, { timeout: 15000 });
        await this.verifyHowToWithdraw();
    }
    async clickHowToBetgames() {
        await this.loc.howToBetgames.click();
        await expect(this.page).toHaveURL(/.*how-to-betgames*/, { timeout: 15000 });
        await this.verifyHowToBetgames();
    }
    async clickHowToCasino() {
        await this.loc.howToCasino.click();
        await expect(this.page).toHaveURL(/.*how-to-casino*/, { timeout: 15000 });
        await this.verifyHowToCasino();
    }
    async clickHowToFica() {
        await this.loc.howToFica.click();
        await expect(this.page).toHaveURL(/.*how-to-fica*/, { timeout: 15000 });
        await this.verifyHowToFica();
    }

    async gotoHowTo() {
        await this.goto('/how-to-bet');
    }
}
