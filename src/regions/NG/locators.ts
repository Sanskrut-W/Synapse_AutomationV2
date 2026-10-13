import { RegionOverrides } from '../../common/locators/sel';
import { css, last, text, first } from '../../common/locators/sel';

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
        // Confirmed live: NG's FAQ heading renders as a plain div, not the semantic heading role
        // ZA's base locator expects ("FAQ's") — the text itself also differs ("Frequently Asked
        // Questions" spelled out, not the abbreviation).
        FAQHeading: text(/Frequently Asked Questions/i),
    },
    header: {
        // NG renamed the header's "Casino Bonus" balance-dropdown field to "Betway Rewards".
        casinoBonusField: text('Betway Rewards'),
        // Confirmed live: NG's profile avatar renders via a <feeds-avatar-image> custom element,
        // same as GH/TZ — img[alt$="profile avatar"] never matches on NG's site (0 DOM matches).
        accountsButton: first(css('feeds-avatar-image')),
    },
    newHome: {
        // Confirmed live: NG's Casino hero CTA links to /lobby/casino, not ZA's /lobby/casino-games
        // (same real href as GH's own override).
        heroCasinoCta: (root) => root.locator('main a[href="/lobby/casino"]').filter({ hasText: 'Casino' }).first(),
    },
    howTo: {
        // Confirmed live: NG's How-To page says "How To Reset Password" — same wording already
        // confirmed for GH/TZ/MW, genuinely different from ZA's "How to reset your password".
        howToResetPassword: first(text(/How To Reset Password/i)),
    },
    // No signUp overrides: NG's Sign Up form was redesigned again (2026-10-12) to a mobile-only
    // Step 1 (see SignUpPage.ts's fillBasicInfo NG branch) whose field has no data-id at all —
    // the old `input[data-id="MobileNumber"]` override this block used to carry no longer matches
    // anything, and the shared base mobileInput locator (scoped to #reg-content with a
    // name-spelling-tolerant regex) already covers NG's real field without an override.
    betslip: {
        // Confirmed live: NG needs 3 legs to trigger Win Boost (see winBoostLegs() in
        // betslipSuite.shared.ts) and its tooltip/percentage tier matches GH/TZ/ZM's own
        // progression ("3% -> 5%"), not ZA's ("2% -> 3%") — only the currency (N, Naira) is
        // unique to NG.
        winBoostToolTip: text('Win Boost 3%. 1 more for 5% (Min odds 1.2)'),
        winBoostValue: text('Win Boost (3%): N'),
        // Same base-locator gap as the tooltip/value above (base BetslipPage.ts hardcodes ZA's
        // 2%/3% text) — T27 (Win Boost pop-up) needs this to find NG's real 3%/5% container.
        // Same pattern already confirmed working for GH/TZ, which share NG's exact tooltip text.
        winBoostInfoIcon: (root) => root
            .locator('div', { hasText: /^Win Boost 3%\. 1 more for 5% \(Min odds 1\.2\)Bet Saver not active$/ })
            .getByRole('img')
            .nth(1),
    },
};
