import { RegionOverrides } from '../../common/locators/sel';
import { css, last, first, text } from '../../common/locators/sel';

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
        // Confirmed live: MW's real href is lowercase ("/responsible-gaming"), unlike the base's
        // capitalized "/Responsible-Gaming" — CSS attribute selectors are case-sensitive on the value.
        ResponsibleGaming: last(css('a[href="/responsible-gaming"]')),
    },
    header: {
        // Confirmed live: MW's hamburger Quick Links entry reads just "Betting Rules" (no "and
        // Tips"), and — same as the footer link — it opens an external PDF rather than an in-app
        // page. Two DOM nodes (the <a> and a wrapping <div>) share this exact text; first() picks
        // the earlier (hamburger) one over the footer's own "Betting Rules" link.
        bettingRules: first(text('Betting Rules', { exact: true })),
    },
    howTo: {
        // Confirmed live: MW's How-To page says "How To Reset Password" — same wording as TZ/GH,
        // genuinely different from ZA's "How to reset your password".
        howToResetPassword: first(text(/How To Reset Password/i)),
    },
    signUp: {
        // Confirmed live: MW's signup Step-1 form uses these exact data-id attributes; the shared
        // role-name-based locators (which assume ZA's accessible-name conventions) don't match them.
        passwordInput: css('input[data-id="Password"]'),
        firstNameInput: css('input[data-id="FirstName"]'),
        lastNameInput: css('input[data-id="LastName"]'),
    },
    betslip: {
        // Confirmed live: MW's currency is MK (Malawian Kwacha), not ZA's R — the percentage tier
        // itself matches ZA's ("2%"), same as winBoostToolTip already confirmed; only the currency
        // symbol differs (unlike GH/TZ, which have their own overrides for both a different
        // percentage tier AND currency — see regions/GH and regions/TZ locators.ts).
        winBoostValue: text('Win Boost (2%): MK'),
    },
};
