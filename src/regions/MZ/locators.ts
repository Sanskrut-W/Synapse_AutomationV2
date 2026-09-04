import { RegionOverrides } from '../../common/locators/sel';
import { css, last, text, first, role } from '../../common/locators/sel';

/**
 * MZ (Mozambique) overrides — confirmed against the old repo's src/regions/MZ/pages/*.ts and the
 * real "HeaderPage" Excel sheet (`bettingRulesMZ`, `accountsButtonMZ` rows). PAIAManual (absent
 * for MZ) is handled via a region-conditional test.skip() in footerSuite.shared.ts.
 */
export const mzOverrides: RegionOverrides = {
    home: {
        FAQs: last(css('a[href="/sport/frequently-asked-questions"]')),
        // Confirmed live: the old "BettingRules_MZ" href pattern no longer matches anything (0
        // DOM matches) — MZ's real footer link now serves BW's own PDF
        // (.../BettingRules_BW_en.pdf, same cms1.gmgamingsystems.com host as TZ/MW's external
        // PDFs). Not a guess — this is genuinely what the live link points to.
        BettingRules: last(css('a[href*="BettingRules_BW"]')),
        ResponsibleGaming: last(css('a[href="/responsible-gaming"]')),
        Sitemap: last(css('a[href="/sitemap"]')),
        // Confirmed live: same gap as GH/NG — the base FAQ heading assertion expects the
        // ZA-specific abbreviation "FAQ's"; MZ's real heading is the spelled-out "Frequently
        // Asked Questions".
        FAQHeading: text(/Frequently Asked Questions/i),
    },
    header: {
        bettingRules: first(text(' Betting Rules')),
        // Confirmed live: the old "Feed Avatar" alt-text pattern no longer matches (0 DOM
        // matches) — MZ's avatar now renders via a <feeds-avatar-image> custom element, same as
        // GH/TZ/NG/ZM.
        accountsButton: first(css('feeds-avatar-image')),
    },
    howTo: {
        // Confirmed live: MZ's How-To page says "How To Reset Password" — same wording already
        // confirmed for GH/TZ/MW/NG, genuinely different from ZA's "How to reset your password".
        howToResetPassword: first(text(/How To Reset Password/i)),
    },
    // Confirmed live: MZ's Step-1 signup form uses "FirstName"/"LastName" (no space) instead of
    // ZA's "First Name"/"Surname" — the base role-name substring match never matches either.
    signUp: {
        firstNameInput: first(role('textbox', { name: 'FirstName' })),
        lastNameInput: first(role('textbox', { name: 'LastName' })),
    },
    betslip: {
        // Confirmed live: MZ's currency is MT (Mozambican Metical), not ZA's R — the percentage
        // tier itself matches ZA's ("2%") and needs the same 3-leg threshold as MW (see
        // winBoostLegs() in betslipSuite.shared.ts); only the currency symbol differs.
        winBoostValue: text('Win Boost (2%): MT'),
    },
};
