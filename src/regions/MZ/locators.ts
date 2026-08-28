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
        BettingRules: last(css('a[href*="BettingRules_MZ"]')),
        ResponsibleGaming: last(css('a[href="/responsible-gaming"]')),
        Sitemap: last(css('a[href="/sitemap"]')),
    },
    header: {
        bettingRules: first(text(' Betting Rules')),
        accountsButton: first(css('img[alt="Feed Avatar"]')),
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
