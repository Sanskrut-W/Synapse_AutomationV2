import { RegionOverrides } from '../../common/locators/sel';
import { css, last, text, first } from '../../common/locators/sel';

/**
 * ZM (Zambia) overrides — confirmed against the old repo's src/regions/ZM/pages/*.ts.
 * PAIAManual/PlayAviator (absent for ZM) are handled via region-conditional test.skip() in
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
    },
    header: {
        bettingRules: text('Betting Rules'),
        // Confirmed live: ZM's profile avatar renders via a <feeds-avatar-image> custom element,
        // same as GH/TZ/NG — img[alt$="profile avatar"] never matches on ZM's site (0 DOM matches).
        accountsButton: first(css('feeds-avatar-image')),
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
