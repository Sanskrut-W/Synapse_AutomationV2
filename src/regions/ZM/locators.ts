import { RegionOverrides } from '../../common/locators/sel';
import { css, last, text, first, role } from '../../common/locators/sel';

/**
 * ZM (Zambia) overrides — confirmed against the old repo's src/regions/ZM/pages/*.ts.
 * PAIAManual (ZA-only legislation) is handled via region-conditional test.skip() in
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
        // Confirmed live: ZM's real heading is the spelled-out "Frequently Asked Questions", same
        // pattern already confirmed for GH/NG/MZ — the base assertion expects ZA's "FAQ's".
        FAQHeading: text(/Frequently Asked Questions/i),
        // Confirmed live (2026-09-07): ZM's footer Aviator link is NOT absent (an earlier comment
        // here said it was — that was stale/wrong) — it just uses an older URL structure
        // ('/lobby/Casino/Featured/Aviator', mixed case) instead of ZA's current '/aviator'.
        PlayAviator: last(css('a[href="/lobby/Casino/Featured/Aviator"]')),
    },
    header: {
        // Confirmed live: plain text('Betting Rules') is a strict-mode violation on ZM — it
        // matches both the footer's external PDF link AND the hamburger menu's quick-link. Scoped
        // to the `complementary` landmark (the hamburger sidebar) to get only the latter.
        bettingRules: (root) => root.getByRole('complementary').getByRole('link', { name: 'Betting Rules' }),
        // Confirmed live: ZM's profile avatar renders via a <feeds-avatar-image> custom element,
        // same as GH/TZ/NG — img[alt$="profile avatar"] never matches on ZM's site (0 DOM matches).
        accountsButton: first(css('feeds-avatar-image')),
    },
    newHome: {
        // Confirmed live (2026-09-07): ZM's hero Casino CTA is /lobby/casino — same pattern as
        // GH/NG (ZA uses /lobby/casino-games, TZ uses /lobby/casino/all — every region so far has
        // its own casino lobby path).
        heroCasinoCta: (root) => root.locator('main a[href="/lobby/casino"]').filter({ hasText: 'Casino' }).first(),
    },
    signUp: {
        // Confirmed live (2026-09-07): ZM's signup form labels these fields literally "FirstName"/
        // "LastName" (no space) — same pattern as its own "MobileNumber" field — not "First Name"/
        // "Surname" like the base locators expect (0 matches on ZM otherwise, which was burning
        // SafeActions' full self-heal budget in the shared beforeEach — the real cause of T5/T7's
        // ~3-minute failures).
        firstNameInput: first(role('textbox', { name: 'FirstName' })),
        lastNameInput: first(role('textbox', { name: 'LastName' })),
    },
    howTo: {
        // Confirmed live: ZM's How-To page says "How To Reset Password" — same wording already
        // confirmed for GH/TZ/MW/NG/MZ, genuinely different from ZA's "How to reset your password".
        howToResetPassword: first(text(/How To Reset Password/i)),
    },
    betslip: {
        // Confirmed live: ZM needs 3 legs to trigger Win Boost (see winBoostLegs() in
        // betslipSuite.shared.ts) and its tooltip/percentage tier matches GH/TZ's own progression
        // ("3% -> 5%"), not ZA's ("2% -> 3%") — only the currency (K, Zambian Kwacha) is unique to ZM.
        winBoostToolTip: text('Win Boost 3%. 1 more for 5% (Min odds 1.2)'),
        winBoostValue: text('Win Boost (3%): K'),
        // Same base-locator gap as the tooltip/value above (base BetslipPage.ts hardcodes ZA's
        // 2%/3% text) — T27 (Win Boost pop-up) needs this to find ZM's real 3%/5% container.
        // Same pattern already confirmed working for GH/TZ, which share ZM's exact tooltip text.
        winBoostInfoIcon: (root) => root
            .locator('div', { hasText: /^Win Boost 3%\. 1 more for 5% \(Min odds 1\.2\)Bet Saver not active$/ })
            .getByRole('img')
            .nth(1),
    },
};
