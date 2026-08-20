import { RegionOverrides } from '../../common/locators/sel';
import { css, last, text } from '../../common/locators/sel';

/**
 * ZM (Zambia) overrides — confirmed against the old repo's src/regions/ZM/pages/*.ts.
 * PAIAManual/PlayAviator (absent for ZM) are handled via region-conditional test.skip() in
 * footerSuite.shared.ts. ZM's HeaderPage also confirmed lacking `insiderBlog`/`betwayScoresApp`
 * entirely (not just a different value) — handled via a region-conditional skip in
 * hamburgerMenuSuite.shared.ts since there's nothing to override those keys to.
 */
export const zmOverrides: RegionOverrides = {
    home: {
        Sitemap: last(css('a[href="/sitemap"]')),
        ResponsibleGaming: last(css('a[href="/responsible-gaming"]')),
        PrivacyPolicy: last(css('a[href="/sport/privacy-policy"]')),
        BettingRules: last(css('a[href*="BettingRules_ZM"]')),
    },
    header: {
        bettingRules: text('Betting Rules'),
    },
};
