import { RegionOverrides } from '../../common/locators/sel';
import { css, last, text, first } from '../../common/locators/sel';

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
};
