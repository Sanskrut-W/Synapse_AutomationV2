import { expect, Page } from '@playwright/test';
import { BasePage } from './BasePage';
import { SafeActions } from '../actions/SafeActions';
import { css, last, text } from '../locators/sel';
import { highlightElementBorder, highlightElements } from '../flows/HighlightElements';

/**
 * Footer + misc homepage chrome. Ported from the old ZA HomePage.ts: the Excel-backed keys
 * (betwayLogo, footer, arsenalLogo, currentTime, downloadBetwayApp, appleLogo, linkToSocials,
 * version) move into the `loc` map below with their real values from the "HomePage" Excel sheet;
 * the plain-hardcoded footer-link locators (ContactUs, howtobet, FAQs, ...) port unchanged.
 */
export class HomePage extends BasePage {
    // `loc` itself is declared on BasePage (see comment there) — every subclass down the
    // inheritance chain reassigns it after merging in its own build() map.
    footerLinksContainer: import('@playwright/test').Locator;

    constructor(page: Page, safeActions: SafeActions) {
        super(page, safeActions);

        this.loc = this.build('home', {
            ContactUs: last(css('a[href="/contact-us"]')),
            howtobet: last(css('a[href="/how-to-bet"]')),
            FAQs: last(css('a[href="/frequently-asked-questions"]')),
            TermsAndConditions: last(css('a[href="/terms-and-conditions"]')),
            BettingRules: last(css('a[href="/betting-rules-and-tips"]')),
            BetwayApp: last(css('a[href="/betway-app"]')),
            AffiliateProgram: last(css('a[href="https://www.superpartnersafrica.com/"]')),
            ResponsibleGaming: last(css('a[href="/Responsible-Gaming"]')),
            PrivacyPolicy: last(css('a[href="/privacy-policy"]')),
            Sponsorships: last(css('a[href="/sponsorship"]')),
            PAIAManual: css('a[href*="PAIA-Manual"]'),
            PlayAviator: last(css('a[href="/aviator"]')),
            Sitemap: last(css('a[href="/sitemaps"]')),
            betwayLogo: css('img[alt="Betway Logo"]'),
            footer: css('footer'),
            arsenalLogo: css('img[alt="Arsenal Logo"]'),
            currentTime: text('Current time'),
            downloadBetwayApp: text('Scan the QR code'),
            appleLogo: css('img[alt="apple-logo"]'),
            linkToSocials: css('a[href="https://x.com/betway"]'),
            version: text('Version'),
        });
        this.footerLinksContainer = this.loc.ContactUs.locator('..');
    }

    // ── Verification methods ────────────────────────────────────────────────
    async verifyFooter() {
        await this.loc.footer.waitFor({ state: 'visible', timeout: 15000 });
        await highlightElements(this.loc.footer);
    }

    async verifyFooterBetwayLogo() {
        await this.loc.betwayLogo.waitFor({ state: 'visible', timeout: 15000 });
        await highlightElements(this.loc.betwayLogo);
    }

    async verifyArsenalLogo() {
        await this.loc.arsenalLogo.waitFor({ state: 'visible', timeout: 15000 });
        await highlightElements(this.loc.arsenalLogo.locator('..').locator('..'));
    }

    async verifyPrivacyPolicyLink() {
        await this.loc.PrivacyPolicy.waitFor({ state: 'visible', timeout: 15000 });
        await highlightElements(this.loc.PrivacyPolicy);
    }

    async verifyContactUsink() {
        await this.loc.ContactUs.waitFor({ state: 'visible', timeout: 15000 });
        await highlightElements(this.loc.ContactUs);
    }

    async verifyFAQLink() {
        await this.loc.FAQs.waitFor({ state: 'visible', timeout: 15000 });
        await highlightElements(this.loc.FAQs);
    }

    async verifyCurrentTime() {
        await this.loc.currentTime.waitFor({ state: 'visible', timeout: 15000 });
        await highlightElements(this.loc.currentTime);
    }

    async verifyResponsibleGamingLink() {
        await this.loc.ResponsibleGaming.waitFor({ state: 'visible', timeout: 10000 });
        await highlightElements(this.loc.ResponsibleGaming);
    }

    async verifyTermsAndConditions() {
        await this.loc.TermsAndConditions.waitFor({ state: 'visible', timeout: 10000 });
        await highlightElements(this.loc.TermsAndConditions);
    }

    async verifyAffiliateProgram() {
        await this.loc.AffiliateProgram.waitFor({ state: 'visible', timeout: 10000 });
        await highlightElements(this.loc.AffiliateProgram);
    }

    async verifyVersion() {
        await this.loc.version.waitFor({ state: 'visible', timeout: 10000 });
        await highlightElements(this.loc.version);
    }

    async verifyBetwayQR() {
        await this.loc.downloadBetwayApp.waitFor({ state: 'visible', timeout: 10000 });
        await highlightElements(this.loc.downloadBetwayApp);
    }

    async verifyAppStoreLogo() {
        await this.loc.appleLogo.waitFor({ state: 'visible', timeout: 10000 });
        await highlightElements(this.loc.appleLogo);
    }

    async verifySocialMediaIcons() {
        await this.loc.linkToSocials.waitFor({ state: 'visible', timeout: 10000 });
        await highlightElements(this.loc.linkToSocials);
    }

    async verify18Logo() {
        const logos = this.loc.arsenalLogo.locator('..').locator('..');
        const eighteenplusLogo = logos.getByRole('link').last();
        await eighteenplusLogo.waitFor({ state: 'visible', timeout: 60000 });
        await highlightElements(eighteenplusLogo);
    }

    async verifyBettingRulesLink() {
        await this.loc.BettingRules.waitFor({ state: 'visible', timeout: 10000 });
        await highlightElements(this.loc.BettingRules);
    }

    async verifyBetwayAppLink() {
        await this.loc.BetwayApp.waitFor({ state: 'visible', timeout: 10000 });
        await highlightElements(this.loc.BetwayApp);
    }

    async verifyHowToLink() {
        await this.loc.howtobet.waitFor({ state: 'visible', timeout: 10000 });
        await highlightElements(this.loc.howtobet);
    }

    async verifySponsorshipContent() {
        await highlightElementBorder(this.page.getByText('Arsenal').first());
        await highlightElementBorder(this.page.getByText('Brighton').first());
        await highlightElementBorder(this.page.getByText('Atletico Madrid').first());
        await highlightElementBorder(this.page.getByText('Manchester City').first());
        await highlightElementBorder(this.page.getByText('The Springboks').first());
        await highlightElementBorder(this.page.getByText('The Betway Premiership').first());
        await highlightElementBorder(this.page.getByText('Betway SA 2020 XX').first());
    }

    async verifySponsorshipLink() {
        await this.loc.Sponsorships.waitFor({ state: 'visible', timeout: 10000 });
        await highlightElements(this.loc.Sponsorships);
    }

    async verifyPAIAManualLink() {
        await this.loc.PAIAManual.waitFor({ state: 'visible', timeout: 10000 });
        await highlightElements(this.loc.PAIAManual);
    }

    async verifyPlayAviatorLink() {
        await this.loc.PlayAviator.waitFor({ state: 'visible', timeout: 10000 });
        await highlightElements(this.loc.PlayAviator);
    }

    async verifySitemapLink() {
        await this.loc.Sitemap.waitFor({ state: 'visible', timeout: 10000 });
        await highlightElements(this.loc.Sitemap);
    }

    // ── Clicking methods ─────────────────────────────────────────────────────
    async clickFooterBetwayLogo() {
        await this.loc.betwayLogo.waitFor({ state: 'visible', timeout: 10000 });
        await this.safeActions.safeClick('betwayLogo', this.loc.betwayLogo);
        await expect(this.page).toHaveURL('https://www.betway.co.za/');
        await highlightElementBorder(this.loc.betwayLogo);
    }

    async clickArsenalLogo() {
        await this.loc.arsenalLogo.click({ force: true });
        await expect(this.page).toHaveURL(/.*sponsorship*/, { timeout: 15000 });
        await this.page.waitForLoadState('domcontentloaded');
        await highlightElementBorder(this.page.getByRole('heading', { name: 'Sponsorship' }));
    }

    async clickSponsorshipBackButton() {
        await highlightElementBorder(this.page.getByRole('heading', { name: 'Sponsorship' }).locator('..').locator('a').first());
        await this.page.getByRole('heading', { name: 'Sponsorship' }).locator('..').locator('a').first().click();
        await this.page.waitForLoadState('domcontentloaded');
        await expect(this.page).toHaveURL('https://www.betway.co.za/', { timeout: 10000 });
    }

    async clickFooterPrivacyPolicy() {
        await this.safeActions.safeClick('PrivacyPolicy', this.loc.PrivacyPolicy);
        await this.page.waitForLoadState('domcontentloaded');
        await expect(this.page).toHaveURL(/.*privacy-policy.*/, { timeout: 15000 });
        await highlightElementBorder(this.page.getByRole('heading', { name: 'Privacy Policy' }));
    }

    async clickPrivacyPolicyBackButton() {
        await highlightElementBorder(this.page.getByRole('heading', { name: 'Privacy Policy' }).locator('..').locator('a').first());
        await this.page.getByRole('heading', { name: 'Privacy Policy' }).locator('..').locator('a').first().click();
        await this.page.waitForLoadState('domcontentloaded');
        await expect(this.page).toHaveURL('https://www.betway.co.za/', { timeout: 10000 });
    }

    async clickContactUsLink() {
        await this.safeActions.safeClick('ContactUs', this.loc.ContactUs);
        await this.page.waitForLoadState('domcontentloaded');
        await expect(this.page).toHaveURL(/.*contact-us*/, { timeout: 15000 });
        await highlightElementBorder(this.page.getByRole('heading', { name: 'Contact us' }));
    }

    async clickContactUsBackButton() {
        await highlightElementBorder(this.page.getByRole('heading', { name: 'Contact us' }).first().locator('..').locator('a').first());
        await this.page.getByRole('heading', { name: 'Contact us - ' }).first().locator('..').locator('a').first().click();
        await this.page.waitForLoadState('domcontentloaded');
        await expect(this.page).toHaveURL('https://www.betway.co.za/', { timeout: 10000 });
    }

    async clickFAQsLink() {
        await this.loc.FAQs.click({ force: true });
        await this.page.waitForLoadState('domcontentloaded');
        await expect(this.page).toHaveURL(/.*frequently-asked-questions*/, { timeout: 15000 });
        await highlightElementBorder(this.page.getByRole('heading', { name: "FAQ's" }));
    }

    async clickFAQSBackButton() {
        await highlightElementBorder(this.page.getByRole('heading', { name: "FAQ's" }).first().locator('..').locator('a').first());
        await this.page.getByRole('heading', { name: "FAQ's" }).first().locator('..').locator('a').first().click();
        await this.page.waitForLoadState('domcontentloaded');
        await expect(this.page).toHaveURL('https://www.betway.co.za/', { timeout: 10000 });
    }

    async clickAnyFAQ() {
        await this.page.getByText('How do I register with Betway?').click();
        await highlightElementBorder(this.page.getByText('How do I register with Betway?').first());
        await this.page.waitForTimeout(2000);
    }

    async clickResponsibleGamingLink() {
        await this.safeActions.safeClick('ResponsibleGaming', this.loc.ResponsibleGaming);
        await expect(this.page).toHaveURL(/.*responsible-gaming*/i, { timeout: 15000 });
        await highlightElementBorder(this.page.getByRole('heading', { name: 'Responsible Gaming' }).first());
        await this.page.waitForLoadState('domcontentloaded');
    }

    async clickResponsibleGamingBackButton() {
        await highlightElementBorder(this.page.getByRole('heading', { name: 'Responsible Gaming' }).first().locator('..').locator('a').first());
        await this.page.getByRole('heading', { name: 'Responsible Gaming' }).first().locator('..').locator('a').first().click();
        await this.page.waitForLoadState('domcontentloaded');
        await expect(this.page).toHaveURL('https://www.betway.co.za/', { timeout: 10000 });
    }

    async clickTermsAndConditionsLink() {
        await this.safeActions.safeClick('TermsAndConditions', this.loc.TermsAndConditions);
        await expect(this.page).toHaveURL(/.*terms-and-conditions*/, { timeout: 15000 });
        await highlightElementBorder(this.page.getByRole('heading', { name: 'Terms and Conditions' }).first());
        await this.page.waitForLoadState('domcontentloaded');
    }

    async clickTermsAndConditionsBackButton() {
        await highlightElementBorder(this.page.getByRole('heading', { name: 'Terms and Conditions' }).first().locator('..').locator('a').first());
        await this.page.getByRole('heading', { name: 'Terms and Conditions' }).first().locator('..').locator('a').first().click();
        await this.page.waitForLoadState('domcontentloaded');
        await expect(this.page).toHaveURL('https://www.betway.co.za/', { timeout: 10000 });
    }

    async clickAnyTermsAndConditions() {
        await this.page.getByRole('button', { name: 'General' }).click();
        await highlightElementBorder(this.page.getByRole('button', { name: 'General' }).first());
        await this.page.waitForTimeout(2000);
    }

    async clickAffiliateProgramLink() {
        // Ported as-is: the old repo's own method clicks TermsAndConditions here too (pre-existing quirk).
        await this.safeActions.safeClick('TermsAndConditions', this.loc.TermsAndConditions);
        await expect(this.page).toHaveURL(/.*terms-and-conditions*/, { timeout: 15000 });
        await highlightElementBorder(this.page.getByRole('heading', { name: 'Terms and Conditions' }).first());
        await this.page.waitForLoadState('domcontentloaded');
    }

    async clickAffiliateProgramBackButton() {
        await highlightElementBorder(this.page.getByRole('heading', { name: 'Terms and Conditions' }).first().locator('..').locator('a').first());
        await this.page.getByRole('heading', { name: 'Terms and Conditions' }).first().locator('..').locator('a').first().click();
        await this.page.waitForLoadState('domcontentloaded');
        await expect(this.page).toHaveURL('https://www.betway.co.za/', { timeout: 10000 });
    }

    async clickBettingRulesLink() {
        await this.safeActions.safeClick('BettingRules', this.loc.BettingRules);
        await expect(this.page).toHaveURL(/.*betting-rules-and-tips*/, { timeout: 15000 });
        await highlightElementBorder(this.page.getByRole('heading', { name: 'Betting Rules and Tips' }).first());
        await this.page.waitForLoadState('domcontentloaded');
    }

    async clickBettingRulesBackButton() {
        await highlightElementBorder(this.page.getByRole('heading', { name: 'Betting Rules and Tips' }).first().locator('..').locator('a').first());
        await this.page.getByRole('heading', { name: 'Betting Rules and Tips' }).first().locator('..').locator('a').first().click();
        await this.page.waitForLoadState('domcontentloaded');
        await expect(this.page).toHaveURL('https://www.betway.co.za/', { timeout: 10000 });
    }

    async clickBetwayAppLink() {
        await this.loc.BetwayApp.click({ force: true });
        await expect(this.page).toHaveURL(/.*betway-app*/, { timeout: 15000 });
        await highlightElementBorder(this.page.getByRole('heading', { name: 'Betway App' }).first());
        await this.page.waitForLoadState('domcontentloaded');
    }

    async clickSponsorshipFooterLink() {
        await this.safeActions.safeClick('Sponsorships', this.loc.Sponsorships);
        await expect(this.page).toHaveURL(/.*sponsorship*/, { timeout: 15000 });
        await highlightElementBorder(this.page.getByRole('heading', { name: 'Sponsorship' }).first());
        await this.page.waitForLoadState('domcontentloaded');
    }

    async clickPlayAviatorLink() {
        await this.safeActions.safeClick('PlayAviator', this.loc.PlayAviator);
        await expect(this.page).toHaveURL(/.*aviator*/, { timeout: 15000 });
        await this.page.waitForLoadState('domcontentloaded');
    }

    async clickSitemapLink() {
        await this.safeActions.safeClick('Sitemap', this.loc.Sitemap);
        await expect(this.page).toHaveURL(/.*sitemaps*/, { timeout: 15000 });
        await this.page.waitForLoadState('domcontentloaded');
    }

    async clickBetwayAppBackButton() {
        await highlightElementBorder(this.page.getByRole('heading', { name: 'Betway App' }).first().locator('..').locator('a').first());
        await this.page.getByRole('heading', { name: 'Betway App' }).first().locator('..').locator('a').first().click();
        await this.page.waitForLoadState('domcontentloaded');
        await expect(this.page).toHaveURL('https://www.betway.co.za/', { timeout: 10000 });
    }

    async clickHowToLink() {
        // Ported as-is: the old repo's own method clicks BetwayApp here (pre-existing quirk).
        await this.loc.BetwayApp.click();
        await expect(this.page).toHaveURL(/.*how-to-bet*/, { timeout: 15000 });
        await this.page.waitForLoadState('domcontentloaded');
    }

    // ── Navigation methods ───────────────────────────────────────────────────
    async gotoHomePage() {
        // Footer is rendered on the sports page; land there so all footer scripts run reliably.
        await this.goto('/sport/soccer');
    }

    async clickHowToBet() {
        await this.safeActions.safeClick('howtobet', this.loc.howtobet);
        await this.page.waitForTimeout(1000);
    }

    async clickFAQs() {
        await this.safeActions.safeClick('FAQs', this.loc.FAQs);
        await highlightElementBorder(this.page.getByRole('heading', { name: "FAQ's" }).first());
        await this.page.waitForTimeout(1000);
    }

    async clickTermsAndConditions() {
        await this.safeActions.safeClick('TermsAndConditions', this.loc.TermsAndConditions);
        await this.page.waitForTimeout(1000);
    }

    async clickBettingRules() {
        await this.safeActions.safeClick('BettingRules', this.loc.BettingRules);
        await this.page.waitForTimeout(1000);
    }

    async clickBetwayApp() {
        await this.safeActions.safeClick('BetwayApp', this.loc.BetwayApp);
        await this.page.waitForTimeout(1000);
    }

    async clickAffiliateProgram() {
        await this.safeActions.safeClick('AffiliateProgram', this.loc.AffiliateProgram);
        await this.page.waitForTimeout(1000);
    }

    async clickResponsibleGaming() {
        await this.safeActions.safeClick('ResponsibleGaming', this.loc.ResponsibleGaming);
        await this.page.waitForTimeout(1000);
    }

    async clickPrivacyPolicy() {
        await this.safeActions.safeClick('PrivacyPolicy', this.loc.PrivacyPolicy);
        await this.page.waitForTimeout(1000);
    }

    async clickSponsorships() {
        await this.safeActions.safeClick('Sponsorships', this.loc.Sponsorships);
        await this.page.waitForTimeout(1000);
    }

    async clickContactUs() {
        await this.safeActions.safeClick('ContactUs', this.loc.ContactUs);
        await this.page.waitForTimeout(1000);
    }
}
