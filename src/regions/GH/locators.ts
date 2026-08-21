import { RegionOverrides } from '../../common/locators/sel';
import { css, last, role, first, at, text } from '../../common/locators/sel';

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
        // Confirmed live: "Betting Rules and Tips" text matches BOTH the footer's own link and the
        // hamburger menu's Quick Links item — a plain text search (even the pre-existing substring
        // override here) hits a strict-mode violation. The hamburger's occurrence is the only one
        // with an <img> child, so scope to that to disambiguate.
        bettingRules: (root) => root.locator('a[href="/betting-rules-and-tips"]').filter({ has: root.locator('img') }),
        howTo: first(role('link', { name: 'How To', exact: true })),
        // Confirmed live: GH's profile avatar renders via a <feeds-avatar-image> custom element,
        // same as TZ — the base locator's alt-text match never exists on GH's site either.
        accountsButton: first(css('feeds-avatar-image')),
    },
    newHome: {
        // Confirmed live: GH's Casino hero CTA links to /lobby/casino, not ZA's /lobby/casino-games
        // (same path GH's own nav bar Casino link uses).
        heroCasinoCta: (root) => root.locator('main a[href="/lobby/casino"]').filter({ hasText: 'Casino' }).first(),
    },
    howTo: {
        // Confirmed live: GH's How-To page says "How To Reset Password" — ZA's own real text is
        // "How to reset your password", genuinely different wording, not a stale locator.
        howToResetPassword: first(text(/How To Reset Password/i)),
    },
    signUp: {
        // Confirmed live: GH's Sign Up modal labels its Mobile Number field "Mobile Number" (with a
        // space) — ZA's identical-looking modal labels the same field "MobileNumber" (no space).
        // Index 1 skips the header's own persistent "Mobile Number" field (index 0), same convention
        // already used for passwordInput.
        mobileInput: at(role('textbox', { name: 'Mobile Number', exact: true }), 1),
    },
    betslip: {
        // Confirmed live (3 legs selected): GH's Win Boost tiers match TZ's exactly — 3% at 3 legs,
        // "1 more for 5%" — not ZA's 2%-at-2-legs/3%-at-3-legs progression.
        winBoostToolTip: text('Win Boost 3%. 1 more for 5% (Min odds 1.2)'),
        winBoostValue: text('Win Boost (3%): GHS'),
        // Same base-locator gap as the tooltip/value above — this one was hardcoded to ZA's
        // 2%/3% text too, so it never matched GH's real 3%/5% container.
        winBoostInfoIcon: (root) => root
            .locator('div', { hasText: /^Win Boost 3%\. 1 more for 5% \(Min odds 1\.2\)Bet Saver not active$/ })
            .getByRole('img')
            .nth(1),
    },
};
