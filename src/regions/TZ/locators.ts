import { RegionOverrides } from '../../common/locators/sel';
import { css, last, text, first } from '../../common/locators/sel';

/**
 * TZ (Tanzania) overrides — confirmed against the old repo's src/regions/TZ/pages/*.ts.
 * PAIAManual (absent for TZ) is handled via a region-conditional test.skip() in
 * footerSuite.shared.ts. TZ's logged-in header also has no "Welcome <name>" text at all (just a
 * profile avatar icon, confirmed live) — handled via a region-conditional skip in
 * newHomePageSuite.shared.ts since there's nothing to override that key to.
 */
export const tzOverrides: RegionOverrides = {
    home: {
        Sitemap: last(css('a[href="/sitemap"]')),
        BettingRules: last(css('a[href*="BettingRules_TZ"]')),
        // Confirmed from user-supplied DOM: TZ's footer link is lowercase `/responsible-gaming`,
        // not ZA's `/Responsible-Gaming` — base locator never matched, causing a 60s click timeout.
        ResponsibleGaming: last(css('a[href="/responsible-gaming"]')),
    },
    header: {
        bettingRules: first(text(' Betting Rules')),
        // TZ's real page needed to scope this to avoid a strict-mode multi-match violation that
        // ZA's unscoped `a[href="/how-to-bet"]` doesn't hit.
        howTo: (root) => root.locator('div.mt-8.rounded-lg a[href="/how-to-bet"]').locator('..'),
        // Confirmed live: TZ's profile avatar renders via a <feeds-avatar-image> custom element,
        // not an <img alt="MatkaKing profile avatar"> like ZA — that alt text doesn't exist on
        // TZ's site at all (its only two header <img> alts are the region flag and an unlabeled logo).
        accountsButton: first(css('feeds-avatar-image')),
    },
    newHome: {
        // Confirmed live: TZ's Casino hero CTA links to /lobby/casino/all, not ZA's /lobby/casino-games.
        heroCasinoCta: (root) => root.locator('main a[href="/lobby/casino/all"]').filter({ hasText: 'Casino' }).first(),
    },
    howTo: {
        // Confirmed live: TZ's How-To page says "How To Reset Password" — ZA's own real text is
        // "How to reset your password", genuinely different wording, not a stale locator.
        howToResetPassword: first(text(/How To Reset Password/i)),
    },
    betslip: {
        // TZ's Win Boost percentage and currency differ from ZA's (source: the real BetslipPage
        // Excel sheet's region-suffixed rows — winBoostToolTipTZ/winBoostValueTZ — which were never
        // wired into the shared BetslipPage.ts build() call since that page was only ever built
        // against ZA's values).
        winBoostToolTip: text('Win Boost 3%. 1 more for 5% (Min odds 1.2)'),
        winBoostValue: text('Win Boost (3%): TSh'),
        // Same base-locator gap as the tooltip/value above — this one was hardcoded to ZA's
        // 2%/3% text too, so it never matched TZ's real 3%/5% container.
        winBoostInfoIcon: (root) => root
            .locator('div', { hasText: /^Win Boost 3%\. 1 more for 5% \(Min odds 1\.2\)Bet Saver not active$/ })
            .getByRole('img')
            .nth(1),
    },
};
