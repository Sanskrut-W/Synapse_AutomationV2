import { Page, Locator } from '@playwright/test';
import { SignUpPage } from '../pages/SignUpPage';

export class SignupUtils {
    readonly page: Page;
    readonly signupPage: SignUpPage;

    constructor(page: Page, signupPage: SignUpPage) {
        this.page = page;
        this.signupPage = signupPage;
    }

    async clearHighlights() {
        await this.page.evaluate(() => {
            document.querySelectorAll('*').forEach((el) => {
                const element = el as HTMLElement;
                element.style.outline = '';
                element.style.backgroundColor = '';
            });
        });
    }

    async highlightElement(locator: Locator) {
        await locator.evaluate((el: HTMLElement) => {
            el.style.outline = '4px solid red';
            el.style.backgroundColor = 'rgba(255,255,0,0.3)';
        });
    }

    /** Enhanced modal cleanup that handles multi-step forms. */
    async resetModalState() {
        try {
            try {
                const previousButton = this.page.getByRole('button', { name: 'Previous' });
                if (await previousButton.isVisible({ timeout: 1000 })) {
                    await previousButton.click();
                    await this.page.waitForTimeout(500);
                }
            } catch { /* Previous button not present, continue */ }

            const closeSelectors = [
                '#modal-close-btn', '.modal-close', '[data-testid="close"]', '[aria-label="Close"]',
                'button[class*="close"]', '.close', '[data-dismiss="modal"]',
            ];
            for (const selector of closeSelectors) {
                const elements = this.page.locator(selector);
                const count = await elements.count();
                for (let i = 0; i < count; i++) {
                    try {
                        if (await elements.nth(i).isVisible()) {
                            await elements.nth(i).click();
                            await this.page.waitForTimeout(200);
                        }
                    } catch { /* continue to next element */ }
                }
            }

            await this.page.keyboard.press('Escape');
            await this.page.waitForTimeout(100);
            await this.page.keyboard.press('Escape');
            await this.page.waitForTimeout(100);

            try {
                const backdrop = this.page.locator('.modal-backdrop, .overlay, [class*="backdrop"]').first();
                if (await backdrop.isVisible()) {
                    await backdrop.click();
                    await this.page.waitForTimeout(200);
                }
            } catch { /* ignore if backdrop not found */ }

            await this.page.evaluate(() => {
                document.querySelectorAll('.modal, [role="dialog"], [data-testid*="modal"], [class*="modal"]').forEach((modal) => {
                    if (modal instanceof HTMLElement) {
                        modal.style.display = 'none';
                        modal.classList.remove('show', 'active', 'open');
                    }
                });
                document.querySelectorAll('.modal-backdrop, .backdrop, .overlay, [class*="backdrop"]').forEach((backdrop) => backdrop.remove());
                document.body.classList.remove('modal-open');
                document.body.style.overflow = '';
                document.body.style.paddingRight = '';
            });

            await this.page.evaluate(() => {
                (document.activeElement as HTMLElement | null)?.blur();
            });

            await this.page.waitForTimeout(300);
        } catch (error) {
            console.log('Modal reset error (non-fatal):', error && typeof error === 'object' && 'message' in error ? (error as { message: string }).message : error);
        }
    }

    async ensureCleanSignupOpen() {
        await this.resetModalState();
        await this.signupPage.clickSignUp();
        await this.page.waitForTimeout(500);
        try {
            await this.page.waitForSelector('form', { timeout: 5000 });
        } catch {
            console.log('Signup form not found, retrying...');
            await this.resetModalState();
            await this.page.waitForTimeout(500);
            await this.signupPage.clickSignUp();
            await this.page.waitForTimeout(1000);
        }
    }

    /** For tests that click Next — resets multi-step form state back to step 1. */
    async resetMultiStepForm() {
        try {
            const previousButton = this.page.getByRole('button', { name: 'Previous' });
            if (await previousButton.isVisible({ timeout: 2000 })) {
                console.log('Found Previous button, going back to step 1...');
                await previousButton.click();
                await this.page.waitForTimeout(1000);
                try {
                    await this.signupPage.loc.mobileInput.clear();
                    await this.signupPage.loc.passwordInput.clear();
                    await this.signupPage.loc.firstNameInput.clear();
                    await this.signupPage.loc.lastNameInput.clear();
                } catch {
                    console.log('Could not clear form fields');
                }
            }
            await this.resetModalState();
        } catch (error) {
            console.log('Multi-step form reset error:', error && typeof error === 'object' && 'message' in error ? (error as { message: string }).message : error);
            await this.resetModalState();
        }
    }

    async ensureCleanHamburgerSignupOpen() {
        await this.resetModalState();
        const hamburgerMenu = this.page.locator('#header-hamburger-btn');
        await hamburgerMenu.click();
        await this.page.waitForTimeout(500);
        const hamburgerSignupBtn = this.page.getByRole('button', { name: 'Sign Up' }).nth(1);
        await hamburgerSignupBtn.click();
        await this.page.waitForTimeout(1000);
        try {
            await this.page.waitForSelector('form', { timeout: 5000 });
        } catch {
            console.log('Signup form not found, retrying hamburger menu...');
            await this.resetModalState();
            await this.page.waitForTimeout(500);
            await hamburgerMenu.click();
            await this.page.waitForTimeout(500);
            await hamburgerSignupBtn.click();
            await this.page.waitForTimeout(1000);
        }
    }

    async performTestReset(testName: string) {
        if (testName.includes('T5-') || testName.includes('T7-')) {
            await this.resetMultiStepForm();
        } else {
            await this.resetModalState();
        }
    }

    async goBackToStepOne() {
        try {
            const previousButton = this.page.getByRole('button', { name: 'Previous' });
            if (await previousButton.isVisible({ timeout: 1000 })) {
                await previousButton.click();
                await this.page.waitForTimeout(500);
            }
        } catch {
            console.log('Previous button not found');
        }
    }

    async fillBasicFormAndProceed(mobile = '999881234', password = '123456789', firstName = 'Test', lastName = 'User') {
        await this.signupPage.loc.mobileInput.fill(mobile);
        await this.signupPage.loc.passwordInput.fill(password);
        await this.signupPage.loc.firstNameInput.fill(firstName);
        await this.signupPage.loc.lastNameInput.fill(lastName);
        const nextButton = this.page.getByRole('button', { name: 'Next' });
        await nextButton.click();
        await this.page.waitForTimeout(1000);
    }

    async handleAgreeToAll() {
        try {
            const agreeToAll = this.page.getByLabel('Agree to All', { exact: false }).first();
            if (await agreeToAll.isVisible({ timeout: 5000 })) {
                await agreeToAll.click();
            }
        } catch {
            console.log('Agree to All checkbox not found or not clickable');
        }
    }

    async fillIdNumber(idNumber: string) {
        try {
            const idNumberField = this.page.getByRole('textbox', { name: /ID Number|IDNumber/i }).first();
            await idNumberField.waitFor({ state: 'visible', timeout: 5000 });
            await idNumberField.fill(idNumber);
        } catch {
            console.log('ID Number field not found');
        }
    }
}
