import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';
import { SafeActions } from '../actions/SafeActions';
import { css, role, text, label, first, at } from '../locators/sel';
import { highlightElements } from '../flows/HighlightElements';

export class SignUpPage extends BasePage {
    constructor(page: Page, safeActions: SafeActions) {
        super(page, safeActions);

        // Handle relative locators, like in HomePage.ts
        this.loc = { ...this.loc, ...this.build('signUp', {
            mobileInput: first(role('textbox', { name: 'MobileNumber' })),
            passwordInput: at(role('textbox', { name: 'Password' }), 1),
            firstNameInput: first(role('textbox', { name: 'First Name' })),
            lastNameInput: first(role('textbox', { name: 'Surname' })),
            loginButton: first(role('button', { name: 'Login' })),
            signUpButton: first(role('button', { name: 'Sign Up' })),
            nextButton: first(role('button', { name: 'Next' })),
            previousButton: first(role('button', { name: 'Previous' })),
            registerButton: first(role('button', { name: 'Register' })),
            hamburgerMenu: first(css('#header-hamburger-btn')),
            hamburgerSignupBtn: at(role('button', { name: 'Sign Up' }), 1),
            emailInput: first(role('textbox', { name: 'Email' })),

            // Relative locators
            idDropdown: first(role('combobox', { name: 'South African ID' })),
            saIdOption: first(role('option', { name: 'South African ID' })),

            passportOption: first(text('Passport')),
            saIdInput: first(role('textbox', { name: 'South African ID' })),
            passportInput: first(role('textbox', { name: 'Passport' })),
            dobDropdown: first(role('combobox', { name: 'Date of Birth' })),
            signupCodeToggle: first(text('I have a signup code')),
            voucherCodeField: first(role('textbox', { name: 'VoucherCode' })),
            referralCodeField: first(role('textbox', { name: 'ReferralCode' })),
            agreeToAllCheckbox: first(label('Agree to All', { exact: false })),
            diallingCode: at(text('27'), 1),
            forms: first(role('form' as any)),
            // Both of these were meant as real regex patterns but were stored as plain strings in
            // the Excel `name` option, so Playwright treated them as literal substrings — neither
            // has ever matched a real element. Preserved verbatim.
            signUpCodeField: first(role('textbox', { name: '/sign.?up.?code signup.?code/i' })),
            idNumberField: first(role('textbox', { name: '/ID Number IDNumber/i' })),
        }) };
    }

    // ------------------------------------------------------------------
    // 1. Navigation Methods
    // ------------------------------------------------------------------

    async goto() {
        // Always land on the sports page (never the home page)
        await super.goto('/sport/soccer');
    }

    // ------------------------------------------------------------------
    // 2. Click Actions
    // ------------------------------------------------------------------

    async clickSignUp() {
        await this.loc.signUpButton.click();
        await this.page.waitForTimeout(500);
        // Same promotional interstitial that can block LoginPage's signup-popup flow can also
        // cover this Sign Up form right after it opens — see closeInformativeInterstitialIfVisible.
        await this.closeInformativeInterstitialIfVisible();
    }

    async clickLogin() {
        await this.loc.loginButton.click();
    }

    async clickHamburgerMenu() {
        await this.loc.hamburgerMenu.click();
        await this.page.waitForTimeout(500);
    }

    async clickHamburgerSignUp() {
        await this.clickHamburgerMenu();
        await this.loc.hamburgerSignupBtn.click();
        await this.page.waitForTimeout(1000);
    }

    async clickNext() {
        const nextButton = this.loc.nextButton;
        if (await nextButton.isVisible({ timeout: 2000 })) {
            await nextButton.click();
            await this.page.waitForTimeout(1000);
        }
    }

    async clickPrevious() {
        const previousButton = this.loc.previousButton;
        if (await previousButton.isVisible({ timeout: 1000 })) {
            await previousButton.click();
            await this.page.waitForTimeout(500);
        }
    }

    async clickRegister() {
        const registerButton = this.loc.registerButton;
        if (await registerButton.isVisible({ timeout: 2000 })) {
            await registerButton.click();
        }
    }

    // ------------------------------------------------------------------
    // 3. Form Filling Methods
    // ------------------------------------------------------------------

    async fillBasicInfo(mobile: string, password: string, firstName: string, lastName: string, email: string) {
        await this.safeActions.safeFill('mobileInput', this.loc.mobileInput, mobile);
        await this.safeActions.safeFill('passwordInput', this.loc.passwordInput, password);
        await this.safeActions.safeFill('firstNameInput', this.loc.firstNameInput, firstName);
        await this.safeActions.safeFill('lastNameInput', this.loc.lastNameInput, lastName);
        await this.safeActions.safeFill('emailInput', this.loc.emailInput, email);
    }

    async fillEmail(email: string) {
        await this.loc.emailInput.fill(email);
    }

    async fillMobileNumber(mobile: string) {
        await this.loc.mobileInput.fill(mobile);
    }

    async fillPassword(password: string) {
        await this.loc.passwordInput.fill(password);
    }

    async fillFirstName(firstName: string) {
        await this.loc.firstNameInput.fill(firstName);
    }

    async fillLastName(lastName: string) {
        await this.loc.lastNameInput.fill(lastName);
    }

    async fillReferralCode(code: string) {
        await this.loc.referralCodeField.fill(code);
    }

    async clearReferralCode() {
        await this.loc.referralCodeField.clear();
    }

    async fillVoucherCode(code: string) {
        await this.loc.voucherCodeField.fill(code);
    }

    async fillSignUpCode(code: string) {
        try {
            const codeField = this.loc.signUpCodeField;
            if (await codeField.isVisible({ timeout: 2000 })) {
                await codeField.fill(code);
            }
        } catch (error) {
            console.log('Sign-up code field not found');
        }
    }

    // ------------------------------------------------------------------
    // 4. ID Document Methods
    // ------------------------------------------------------------------

    async selectSouthAfricanID() {
        await this.loc.idDropdown.click();
        await this.page.waitForTimeout(500);
        await this.loc.saIdOption.click();
        await this.page.waitForTimeout(500);
    }

    async selectPassport() {
        await this.loc.idDropdown.click();
        await this.page.waitForTimeout(500);
        await this.loc.passportOption.click();
        await this.page.waitForTimeout(500);
    }

    async fillSouthAfricanID(idNumber: string) {
        await this.loc.saIdInput.fill(idNumber);
    }

    async clearSAIdInput() {
        await this.loc.saIdInput.clear();
    }

    async fillPassportNumber(passportNumber: string) {
        await this.loc.passportInput.fill(passportNumber);
    }

    async clearPassportInput() {
        await this.loc.passportInput.clear();
    }

    async fillIdNumber(idNumber: string) {
        try {
            const idField = this.loc.idNumberField;
            await idField.waitFor({ state: 'visible', timeout: 5000 });
            await idField.fill(idNumber);
        } catch (error) {
            console.log('ID Number field not found');
        }
    }

    // ------------------------------------------------------------------
    // 5. Date of Birth Methods
    // ------------------------------------------------------------------

    async selectDateOfBirth() {
        await this.loc.dobDropdown.click();
        await this.page.waitForTimeout(500);
        // Date selection logic can be added here if needed
    }

    // ------------------------------------------------------------------
    // 6. Checkbox Methods
    // ------------------------------------------------------------------

    async clickSignupCodeToggle() {
        await this.loc.signupCodeToggle.click();
        await this.page.waitForTimeout(500);
    }

    async agreeToAll() {
        try {
            const agreeToAll = this.loc.agreeToAllCheckbox;
            if (await agreeToAll.isVisible({ timeout: 2000 })) {
                await agreeToAll.click();
            }
        } catch (error) {
            console.log('Agree to All checkbox not found');
        }
    }

    // ------------------------------------------------------------------
    // 7. Clear Form Methods
    // ------------------------------------------------------------------

    async clearAllFields() {
        try {
            await this.loc.mobileInput.clear();
            await this.loc.passwordInput.clear();
            await this.loc.firstNameInput.clear();
            await this.loc.lastNameInput.clear();
        } catch (e) {
            console.log('Could not clear form fields');
        }
    }

    // ------------------------------------------------------------------
    // 8. Locator Accessor (Get) Methods
    // ------------------------------------------------------------------

    getMobileInput(): Locator {
        return this.loc.mobileInput;
    }
    getPasswordInput(): Locator {
        return this.loc.passwordInput;
    }
    getFirstNameInput(): Locator {
        return this.loc.firstNameInput;
    }
    getLastNameInput(): Locator {
        return this.loc.lastNameInput;
    }
    getEmailInput(): Locator {
        return this.loc.emailInput;
    }
    getSignUpButton(): Locator {
        return this.loc.signUpButton;
    }
    getLoginButton(): Locator {
        return this.loc.loginButton;
    }
    getRegisterButton(): Locator {
        return this.loc.registerButton;
    }
    getReferralCodeField(): Locator {
        return this.loc.referralCodeField;
    }
    getVoucherCodeField(): Locator {
        return this.loc.voucherCodeField;
    }
    getSAIdInput(): Locator {
        return this.loc.saIdInput;
    }
    getPassportInput(): Locator {
        return this.loc.passportInput;
    }
    getIdDropdown(): Locator {
        return this.loc.idDropdown;
    }
    getDobDropdown(): Locator {
        return this.loc.dobDropdown;
    }
    getForm(): Locator {
        return this.loc.forms;
    }
    getHamburgerSignupBtn(): Locator {
        return this.loc.hamburgerSignupBtn;
    }

    // ------------------------------------------------------------------
    // 9. Highlighting Methods
    // ------------------------------------------------------------------

    async highlightMobileInput() {
        await highlightElements(this.loc.mobileInput);
    }
    async highlightPasswordInput() {
        await highlightElements(this.loc.passwordInput);
    }
    async highlightFirstNameInput() {
        await highlightElements(this.loc.firstNameInput);
    }
    async highlightLastNameInput() {
        await highlightElements(this.loc.lastNameInput);
    }
    async highlightEmailInput() {
        await highlightElements(this.loc.emailInput);
    }
    async highlightSignUpButton() {
        await highlightElements(this.loc.signUpButton);
    }
    async highlightLoginButton() {
        await highlightElements(this.loc.loginButton);
    }
    async highlightRegisterButton() {
        await highlightElements(this.loc.registerButton);
    }
    async highlightSAIdInput() {
        await highlightElements(this.loc.saIdInput);
    }
    async highlightPassportInput() {
        await highlightElements(this.loc.passportInput);
    }
    async highlightIdDropdown() {
        await highlightElements(this.loc.idDropdown);
    }
    async highlightSAIdOption() {
        await highlightElements(this.loc.saIdOption);
    }
    async highlightPassportOption() {
        await highlightElements(this.loc.passportOption);
    }
    async highlightDobDropdown() {
        await highlightElements(this.loc.dobDropdown);
    }
    async highlightHamburgerMenu() {
        await highlightElements(this.loc.hamburgerMenu);
    }
    async highlightHamburgerSignupBtn() {
        await highlightElements(this.loc.hamburgerSignupBtn);
    }
    async highlightSignupCodeToggle() {
        await highlightElements(this.loc.signupCodeToggle);
    }
    async highlightVoucherCodeField() {
        await highlightElements(this.loc.voucherCodeField);
    }
    async highlightReferralCodeField() {
        await highlightElements(this.loc.referralCodeField);
    }
    async highlightSignUpCodeField() {
        try {
            const codeField = this.loc.signUpCodeField;
            if (await codeField.isVisible({ timeout: 2000 })) {
                await highlightElements(codeField);
            }
        } catch (error) {
            console.log('Sign-up code field not found for highlighting');
        }
    }
    async highlightDiallingCode() {
        try {
            if (await this.loc.diallingCode.isVisible({ timeout: 1000 })) {
                await highlightElements(this.loc.diallingCode);
            }
        } catch (e) {
            console.log('Dialling code not found for highlighting');
        }
    }

    // ------------------------------------------------------------------
    // 10. Task-Oriented Helper Methods
    // ------------------------------------------------------------------

    async testMobileNumberValidation(mobile: string, defaultPassword: string) {
        await this.fillMobileNumber(mobile);
        await this.fillPassword(defaultPassword);
        await this.highlightMobileInput();
        await this.page.waitForTimeout(1000);
    }

    async testPasswordValidation(
        password: string,
        validMobile: string,
        basicInfo: { firstName: string, lastName: string, email: string },
        options?: { clickNext?: boolean, waitTime?: number }
    ) {
        await this.fillBasicInfo(validMobile, password, basicInfo.firstName, basicInfo.lastName, basicInfo.email);
        if (options?.clickNext) await this.clickNext();
        await this.highlightPasswordInput();
        await this.page.waitForTimeout(options?.waitTime || 1000);
    }

    async testNameValidation(
        firstName: string,
        lastName: string,
        validMobile: string,
        defaultPassword: string,
        options?: { clickNext?: boolean, waitTime?: number }
    ) {
        await this.fillMobileNumber(validMobile);
        await this.fillPassword(defaultPassword);
        await this.fillFirstName(firstName);
        await this.fillLastName(lastName);
        if (options?.clickNext) await this.clickNext();
        await this.highlightFirstNameInput();
        await this.highlightLastNameInput();
        await this.page.waitForTimeout(options?.waitTime || 1000);
    }

    async testSAIdValidation(idNumber: string, options?: { clearFirst?: boolean, clickRegister?: boolean, waitTime?: number }) {
        if (options?.clearFirst) await this.clearSAIdInput();
        await this.fillSouthAfricanID(idNumber);
        await this.highlightSAIdInput();
        if (options?.clickRegister) await this.clickRegister();
        await this.page.waitForTimeout(options?.waitTime || 1000);
    }

    async testPassportValidation(passportNumber: string, options?: { clearFirst?: boolean, clickRegister?: boolean, waitTime?: number }) {
        if (options?.clearFirst) await this.clearPassportInput();
        await this.fillPassportNumber(passportNumber);
        await this.highlightPassportInput();
        if (options?.clickRegister) await this.clickRegister();
        await this.page.waitForTimeout(options?.waitTime || 1000);
    }

    async testVoucherCode(code: string, basicInfo: { mobile: string, pass: string, fName: string, lName: string, email: string }) {
        await this.fillBasicInfo(basicInfo.mobile, basicInfo.pass, basicInfo.fName, basicInfo.lName, basicInfo.email);
        await this.highlightSignupCodeToggle();
        await this.clickSignupCodeToggle();
        await this.fillVoucherCode(code);
        await this.highlightVoucherCodeField();
        await this.page.waitForTimeout(1000);
    }

    async testReferralCode(code: string, basicInfo: { mobile: string, pass: string, fName: string, lName: string, email: string }, options?: { clearFirst?: boolean }) {
        await this.fillBasicInfo(basicInfo.mobile, basicInfo.pass, basicInfo.fName, basicInfo.lName, basicInfo.email);
        if (options?.clearFirst) await this.clearReferralCode();
        await this.fillReferralCode(code);
        await this.highlightReferralCodeField();
        await this.page.waitForTimeout(1000);
    }

    async testStep2SignUpCode(code: string) {
        await this.fillSignUpCode(code);
        await this.highlightSignUpCodeField();
        await this.page.waitForTimeout(1000);
    }
}
