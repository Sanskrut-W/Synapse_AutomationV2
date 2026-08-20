import { RegionOverrides } from '../../common/locators/sel';
import { css, last } from '../../common/locators/sel';

/**
 * MW (Malawi) overrides — confirmed against the old repo's src/regions/MW/pages/*.ts.
 * PAIAManual/PlayAviator (absent for MW) are handled via region-conditional test.skip() in
 * footerSuite.shared.ts rather than locator overrides — PlayAviator's own test (T62) is already
 * globally disabled in that suite regardless of region.
 */
export const mwOverrides: RegionOverrides = {
    home: {
        Sitemap: last(css('a[href="/sitemap"]')),
        BettingRules: last(css('a[href*="BettingRules_MW"]')),
        // New MW-only footer link — no shared HomePage method currently reads this key; kept for
        // structural completeness in case a future test needs it.
        MAGLAContact: css('a[href="/magla-contact"]'),
    },
};
