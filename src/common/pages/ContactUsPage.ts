import { expect, Page } from '@playwright/test';
import { HomePage } from './HomePage';
import { SafeActions } from '../actions/SafeActions';
import { css, role, text } from '../locators/sel';
import { highlightElementBorder } from '../flows/HighlightElements';

/**
 * NOTE on locator fidelity: the old repo's ContactUsPage constructor pointed at
 * `src/global/utils/file-utils/locators.xlsx`, a file that doesn't exist on disk (only
 * `locators(2).xlsx` does) — so it would have thrown immediately on instantiation. No currently
 * active test exercises this page (the only call sites, in footer.spec.ts's
 * `verifyEmail`/`verifyX`/`verifyFacebook` tests, are themselves commented out). The real
 * "ContactUsPage" sheet *does* exist in `locators(2).xlsx` though (just never read, due to the
 * wrong filename) — values below are sourced from that real sheet, not guessed.
 */
export class ContactUsPage extends HomePage {
    constructor(page: Page, safeActions: SafeActions) {
        super(page, safeActions);

        const inherited = this.loc;
        this.loc = { ...inherited, ...this.build('contactUs', {
            chatToLiveSupport: text('To live support'),
            email: text('Email'),
            X: text('@Betway_za'),
            facebook: text('Facebook'),
            call: text('Standard Rate Call'),
            formMobileInput: css('#mobile-number'),
            formEmailInput: css('#email-address'),
            formQueryInput: css('#your-comment-or-query'),
            formQueryType: text('Query'),
            formSubmitButton: role('button', { name: 'Submit' }),
            // Added after confirming live on GH's real /contact-us page: there's no contact FORM
            // anymore (no email/mobile/query inputs, no Submit button — the `form*`/`email`/`X`
            // (as literal text)/`facebook` (as literal text) locators above are stale, same
            // "feature redesigned away" pattern already seen with Feeds), but the live-chat entry
            // point, Standard Rate Call number, and X/Facebook social icons are all real. These are
            // href/regex-based (not per-region text) so they should hold across regions.
            socialXLink: css('a[href*="x.com"], a[href*="twitter.com"]'),
            socialFacebookLink: css('a[href*="facebook.com"]'),
            // Confirmed live across regions: not every region prefixes with "+" (MZ shows a plain
            // local number, e.g. "20606600", vs GH's "+233 30 825 5838") — match any digit run of
            // real phone-number length, tolerating spaces/slashes between groups, without requiring
            // a leading "+".
            callPhoneNumber: (root) => root.getByText(/\d[\d\s/]{6,}\d/),
        }) };
    }

    // ── Verification Methods ─────────────────────────────────────────────────
    async verifyAllContent() {
        await expect(this.loc.X).toBeVisible({ timeout: 15000 });
        await highlightElementBorder(this.loc.X);
        await expect(this.loc.email).toBeVisible({ timeout: 15000 });
        await highlightElementBorder(this.loc.email);
        await expect(this.loc.call).toBeVisible({ timeout: 15000 });
        await highlightElementBorder(this.loc.call);
        await expect(this.loc.facebook).toBeVisible({ timeout: 15000 });
        await highlightElementBorder(this.loc.facebook);
        await expect(this.loc.chatToLiveSupport).toBeVisible({ timeout: 15000 });
        await highlightElementBorder(this.loc.chatToLiveSupport);
        await expect(this.loc.formEmailInput).toBeVisible({ timeout: 15000 });
        await highlightElementBorder(this.loc.formEmailInput);
        await expect(this.loc.formMobileInput).toBeVisible({ timeout: 15000 });
        await highlightElementBorder(this.loc.formMobileInput);
        await expect(this.loc.formQueryInput).toBeVisible({ timeout: 15000 });
        await highlightElementBorder(this.loc.formQueryType);
        await expect(this.loc.formQueryType).toBeVisible({ timeout: 15000 });
        await highlightElementBorder(this.loc.formQueryInput);
        await expect(this.loc.formSubmitButton).toBeVisible({ timeout: 15000 });
        await highlightElementBorder(this.loc.formSubmitButton);
    }

    async verifyContactForm() {
        await expect(this.page.getByText('Contact Form').first()).toBeVisible({ timeout: 15000 });
        await highlightElementBorder(this.page.getByText('Contact Form').first());
        await expect(this.loc.formEmailInput).toBeVisible({ timeout: 15000 });
        await highlightElementBorder(this.loc.formEmailInput);
        await expect(this.loc.formMobileInput).toBeVisible({ timeout: 15000 });
        await highlightElementBorder(this.loc.formMobileInput);
        await expect(this.loc.formQueryInput).toBeVisible({ timeout: 15000 });
        await highlightElementBorder(this.loc.formQueryType);
        await expect(this.loc.formQueryType).toBeVisible({ timeout: 15000 });
        await highlightElementBorder(this.loc.formQueryInput);
        await expect(this.loc.formSubmitButton).toBeVisible({ timeout: 15000 });
        await highlightElementBorder(this.loc.formSubmitButton);
    }

    async verifyChatToLiveSupport() {
        await this.loc.chatToLiveSupport.waitFor({ state: 'visible', timeout: 15000 });
        await highlightElementBorder(this.loc.chatToLiveSupport);
    }

    async verifyEmail() {
        await this.loc.email.waitFor({ state: 'visible', timeout: 15000 });
        await highlightElementBorder(this.loc.email);
    }

    async verifyX() {
        await this.loc.X.waitFor({ state: 'visible', timeout: 15000 });
        await highlightElementBorder(this.loc.X);
    }

    async verifyFacebook() {
        await this.loc.facebook.waitFor({ state: 'visible', timeout: 15000 });
        await highlightElementBorder(this.loc.facebook);
    }

    async verifyCall() {
        await this.loc.call.waitFor({ state: 'visible', timeout: 15000 });
        await highlightElementBorder(this.loc.call);
    }

    async verifyCallPhoneNumber() {
        await this.loc.callPhoneNumber.first().waitFor({ state: 'visible', timeout: 15000 });
        await highlightElementBorder(this.loc.callPhoneNumber.first());
    }

    async verifySocialLinks() {
        await this.loc.socialXLink.first().waitFor({ state: 'visible', timeout: 15000 });
        await highlightElementBorder(this.loc.socialXLink.first());
        await this.loc.socialFacebookLink.first().waitFor({ state: 'visible', timeout: 15000 });
        await highlightElementBorder(this.loc.socialFacebookLink.first());
    }

    // Split out from verifySocialLinks() above: confirmed live, MW's real Contact Us page has no
    // Facebook link at all (Instagram + X only) — the combined check can't be used region-wide.
    async verifySocialXLink() {
        await this.loc.socialXLink.first().waitFor({ state: 'visible', timeout: 15000 });
        await highlightElementBorder(this.loc.socialXLink.first());
    }

    async verifySocialFacebookLink() {
        await this.loc.socialFacebookLink.first().waitFor({ state: 'visible', timeout: 15000 });
        await highlightElementBorder(this.loc.socialFacebookLink.first());
    }

    async verifyFormEmailInput() {
        await this.loc.formEmailInput.waitFor({ state: 'visible', timeout: 15000 });
        await highlightElementBorder(this.loc.formEmailInput);
    }

    async verifyFormMobileInput() {
        await this.loc.formMobileInput.waitFor({ state: 'visible', timeout: 15000 });
        await highlightElementBorder(this.loc.formMobileInput);
    }

    async verifyFormQueryType() {
        await this.loc.formQueryType.waitFor({ state: 'visible', timeout: 15000 });
        await highlightElementBorder(this.loc.formQueryType);
    }

    async verifyFormQueryInput() {
        await this.loc.formQueryInput.waitFor({ state: 'visible', timeout: 15000 });
        await highlightElementBorder(this.loc.formQueryInput);
    }

    async verifyFormSubmitButton() {
        await this.loc.formSubmitButton.waitFor({ state: 'visible', timeout: 15000 });
        await highlightElementBorder(this.loc.formSubmitButton);
    }

    // ── Clicking Functions ───────────────────────────────────────────────────
    async clickOnChatToLiveSupport() {
        await this.loc.chatToLiveSupport.click();
        await this.page.waitForLoadState('domcontentloaded');
        await this.page.waitForTimeout(2000);
    }

    async clickOnEmail() {
        await this.loc.email.click();
        await this.page.waitForLoadState('domcontentloaded');
        await this.page.waitForTimeout(2000);
    }

    async clickOnX() {
        await this.loc.X.click();
        await this.page.waitForLoadState('domcontentloaded');
        await this.page.waitForTimeout(2000);
    }

    async clickOnFacebook() {
        await this.loc.facebook.click();
        await this.page.waitForLoadState('domcontentloaded');
        await this.page.waitForTimeout(2000);
    }

    async clickOnCall() {
        await this.loc.call.click();
        await this.page.waitForLoadState('domcontentloaded');
        await this.page.waitForTimeout(2000);
    }

    async gotoContactUs() {
        await this.goto('/contact-us');
    }
}
