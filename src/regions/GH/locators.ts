import { RegionOverrides } from '../../common/locators/sel';
import { css, last, role, first, text } from '../../common/locators/sel';

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
        // Confirmed live 2026-10-16 (header T37): the base locator takes the SECOND button whose
        // accessible name contains "Deposit". getByRole name matching is a substring match, and
        // GH's home page also renders casino tiles with aria-label="Deposit Now", so index 1 is
        // a casino tile far below the fold — the click retried ~106 times against "element is
        // outside of the viewport" until the 60s timeout. The green header button is the exact
        // name match. Left as index 1 everywhere else, where it is live-confirmed correct.
        depositButton: first(role('button', { name: 'Deposit', exact: true })),
    },
    betInfluencer: {
        // Confirmed live 2026-10-16 (NewT2): GH renders a single "Bet Influencer" link, so the
        // shared .nth(1) waits 5s for an element that does not exist. The Account Options popup
        // itself opens fine — index 0 is the link this test is asserting on.
        betInfluencerLink2: first(role('link', { name: 'Bet Influencer' })),
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
        // Was hardcoded `.at(1)` to skip the header's own persistent "Mobile Number" field (index 0)
        // — confirmed live this regressed: the header field isn't always present (only 1 match
        // exists right now, so index 1 resolves to nothing), exactly the same fragility already
        // fixed for `passwordInput` in SignUpPage.ts. `last()` is robust to both cases (0 or 1
        // extra header match) since the modal's own field is always the last match in DOM order.
        mobileInput: last(role('textbox', { name: 'Mobile Number', exact: true })),
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
