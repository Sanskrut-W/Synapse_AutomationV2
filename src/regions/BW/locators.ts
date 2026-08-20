import { RegionOverrides } from '../../common/locators/sel';
import { css, last } from '../../common/locators/sel';

/**
 * BW (Botswana) overrides — confirmed against the old repo's src/regions/BW/pages/*.ts.
 * PAIAManual (South-Africa-specific legislation) has no BW equivalent — handled via a region-
 * conditional test.skip() in footerSuite.shared.ts rather than a locator override, since there's
 * nothing to point it at.
 */
export const bwOverrides: RegionOverrides = {
    home: {
        ResponsibleGaming: last(css('a[href="/responsible-gaming"]')),
        Sitemap: last(css('a[href="/sitemap"]')),
    },
};
