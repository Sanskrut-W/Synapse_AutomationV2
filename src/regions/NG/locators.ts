import { RegionOverrides } from '../../common/locators/sel';
import { css, last, text } from '../../common/locators/sel';

/**
 * NG (Nigeria) overrides — confirmed against the old repo's src/regions/NG/pages/*.ts.
 * PAIAManual (absent for NG) is handled via a region-conditional test.skip() in
 * footerSuite.shared.ts. Currency-symbol differences (N vs R) and the "verifyCountryCode"
 * (+234) method live inside method bodies rather than `loc` keys and aren't captured here —
 * `verifyCountryCode` is globally disabled in the shared suite anyway (dead code in every region).
 */
export const ngOverrides: RegionOverrides = {
    home: {
        BettingRules: last(css('a[href="/betting-rules"]')),
        Sitemap: last(css('a[href="/sitemap"]')),
    },
    header: {
        // NG renamed the header's "Casino Bonus" balance-dropdown field to "Betway Rewards".
        casinoBonusField: text('Betway Rewards'),
    },
};
