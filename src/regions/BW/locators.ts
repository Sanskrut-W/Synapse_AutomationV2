import { RegionOverrides } from '../../common/locators/sel';
import { css, last, first, text } from '../../common/locators/sel';

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
    header: {
        // Confirmed live: BW's profile avatar renders via a <feeds-avatar-image> custom element,
        // same as GH/TZ/NG — img[alt$="profile avatar"] never matches on BW's site (0 DOM matches).
        accountsButton: first(css('feeds-avatar-image')),
    },
    newHome: {
        // Confirmed live: BW's Casino hero CTA links to /lobby/casino/all, not ZA's
        // /lobby/casino-games (same real href already documented in GamingLobbyPage.ts's
        // casinoGames comment — this was the one region that comment flagged as missing its own
        // newHome override).
        heroCasinoCta: (root) => root.locator('main a[href="/lobby/casino/all"]').filter({ hasText: 'Casino' }).first(),
    },
    howTo: {
        // Confirmed live: BW's How-To page has exactly 5 tabs — How To Bet / How To Reset
        // Password / How To Register / How To Deposit / How To Withdraw (no SMS or Betgames tab
        // at all, same real tab list already confirmed for MW). Its Reset-Password wording matches
        // GH/TZ/MW's "How To Reset Password", not ZA's "How to reset your password".
        howToResetPassword: first(text(/How To Reset Password/i)),
    },
    betslip: {
        // Confirmed live (3 legs selected): BW's Win Boost tier WORDING matches ZA's own
        // progression exactly ("Win Boost 2%. 1 more for 3% (Min odds 1.2)") — the base
        // winBoostToolTip/winBoostInfoIcon locators already match BW as-is, no override needed for
        // those. Only the currency differs: the base winBoostValue hardcodes ZA's "R", but BW's
        // real text reads "Win Boost (2%): BWP" (Pula). 2 legs (ZA's own default, see
        // winBoostLegs() in betslipSuite.shared.ts) showed no Win Boost section at all when tried
        // live — BW needs 3 legs before Win Boost appears, hence 'BW' is grouped with the 3-leg
        // regions there even though its wording tier is ZA's, not GH's.
        winBoostValue: text('Win Boost (2%): BWP'),
    },
};
