import { RegionOverrides } from '../../common/locators/sel';
import { css, last, text, role, first } from '../../common/locators/sel';

/**
 * GH (Ghana) overrides — confirmed against the old repo's src/regions/GH/pages/*.ts and the real
 * "HeaderPage" Excel sheet (which carries GH-specific rows alongside ZA's: `closePromotionPopupGH`,
 * `bettingRulesGHS`). PAIAManual (South-Africa-specific legislation) has no GH equivalent — handled
 * via a region-conditional test.skip() in footerSuite.shared.ts rather than a locator override.
 */
export const ghOverrides: RegionOverrides = {
    home: {
        ResponsibleGaming: last(css('a[href="/responsible-gaming"]')),
        Sitemap: last(css('a[href="/sitemap"]')),
    },
    header: {
        closePromotionPopup: css('#close-toast'),
        bettingRules: text('Betting Rules'),
        howTo: first(role('link', { name: 'How To', exact: true })),
    },
};
