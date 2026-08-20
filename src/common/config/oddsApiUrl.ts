// Region -> odds-API endpoint map. Populated per-region from direct verification against the old
// repo's actually-used domains (not guessed) — see the migration research for each region. Several
// fields are intentionally left as '' where the old repo's own code hardcoded a DIFFERENT region's
// domain (a real, confirmed copy-paste bug in that repo) rather than a genuine value for this
// region; `requireUrl()` in ../flows/OddSelection.ts throws a clear error if one of those is ever
// used, instead of silently matching the wrong live response.
export type Region = 'ZA' | 'TZ' | 'NG' | 'GH' | 'MW' | 'ZM' | 'BW' | 'MZ';

export type OddsApiConfig = {
    soccerHighlights: string;
    soccerUpcoming: string;
    liveTableTennis: string;
    esports: string;
};

export const API_URLS: Record<Region, OddsApiConfig> = {
    ZA: {
        soccerHighlights: 'https://www.betway.co.za/sportsapi/br/v1/BetBook/Highlights/?countryCode=ZA&sportId=soccer',
        soccerUpcoming: 'https://www.betway.co.za/sportsapi/br/v1/BetBook/Upcoming/?countryCode=ZA&sportId=soccer',
        liveTableTennis: 'https://www.betway.co.za/sportsapi/br/v1/BetBook/LiveInPlay/?countryCode=ZA&sportId=table-tennis',
        esports: 'https://www.betway.co.za/sportsapi/br/v1/BetBook/Highlights/?countryCode=ZA&sportId=esports-league-of-legends&Skip=0&Take=20&cultureCode=en-US&isEsport=true&boostedOnly=false&marketTypes=%5BMatch%20Winner%5D',
    },
    TZ: {
        soccerHighlights: 'https://en.betway.co.tz/sportsapi/br/v1/BetBook/Highlights/?countryCode=TZ&sportId=soccer',
        soccerUpcoming: 'https://en.betway.co.tz/sportsapi/br/v1/BetBook/Upcoming/?countryCode=TZ&sportId=soccer',
        liveTableTennis: 'https://en.betway.co.tz/sportsapi/br/v1/BetBook/LiveInPlay/?countryCode=TZ&sportId=table-tennis',
        esports: 'https://en.betway.co.tz/sportsapi/br/v1/BetBook/Highlights/?countryCode=TZ&sportId=esports-league-of-legends&Skip=0&Take=20&cultureCode=en-US&isEsport=true&boostedOnly=false&marketTypes=%5BMatch%20Winner%5D',
    },
    // All 4 fields verified directly in the old repo's src/regions/GH/commonflows/OddSelection.ts
    // EXCEPT liveTableTennis, whose only usage (LiveOddsSelection) hardcoded a leftover ZA URL
    // (`new.betway.co.za`, countryCode=ZA) — left empty rather than propagating that bug.
    GH: {
        soccerHighlights: 'https://www.betway.com.gh/sportsapi/br/v1/BetBook/Highlights/?countryCode=GH&sportId=soccer',
        soccerUpcoming: 'https://www.betway.com.gh/sportsapi/br/v1/BetBook/Upcoming/?countryCode=GH&sportId=soccer',
        liveTableTennis: '',
        esports: 'https://www.betway.com.gh/sportsapi/br/v1/BetBook/Highlights/?countryCode=GH&sportId=esports-league-of-legends&Skip=0&Take=20&cultureCode=en-US&isEsport=true&boostedOnly=false&marketTypes=%5BMatch%20Winner%5D',
    },
    // All 4 fields verified directly in the old repo's src/regions/MW/commonflows/OddSelection.ts —
    // the only region besides ZA/TZ where every field checked out.
    MW: {
        soccerHighlights: 'https://betway.mw/sportsapi/br/v1/BetBook/Highlights/?countryCode=MW&sportId=soccer',
        soccerUpcoming: 'https://www.betway.mw/sportsapi/br/v1/BetBook/Upcoming/?countryCode=MW&sportId=soccer',
        liveTableTennis: 'https://betway.mw/sportsapi/br/v1/BetBook/LiveInPlay/?countryCode=MW&sportId=table-tennis',
        esports: 'https://betway.mw/sportsapi/br/v1/BetBook/Highlights/?countryCode=MW&sportId=esports-league-of-legends&Skip=0&Take=20&cultureCode=en-US&isEsport=true&boostedOnly=false&marketTypes=%5BMatch%20Winner%5D',
    },
    // soccerUpcoming/esports/liveTableTennis verified directly in the old repo's
    // src/regions/ZM/commonflows/OddSelection.ts — note esports/liveTableTennis hit the "Upcoming"
    // endpoint shape (not "Highlights"/"LiveInPlay" like ZA), which is genuinely what ZM's own code
    // used, not a bug to "fix" into ZA's shape. soccerHighlights has no real usage anywhere in the
    // old repo (only a leftover ZA copy in apis/Highlights.json) — left empty.
    ZM: {
        soccerHighlights: '',
        soccerUpcoming: 'https://www.betway.co.zm/sportsapi/br/v1/BetBook/Upcoming/?countryCode=ZM&sportId=soccer',
        liveTableTennis: 'https://www.betway.co.zm/sportsapi/br/v1/BetBook/Upcoming/?countryCode=ZM&sportId=table-tennis',
        esports: 'https://www.betway.co.zm/sportsapi/br/v1/BetBook/Upcoming/?countryCode=ZM&sportId=esports-league-of-legends&Skip=0&Take=20&cultureCode=en-US&isEsport=true&boostedOnly=false&marketTypes=%5BMatch%20Winner%5D',
    },
    // soccerUpcoming verified (feeds-roa2.betwayafrica.com host, same pattern confirmed shared with
    // MZ/NG). The other 3 fields' only usages in the old repo hardcoded a leftover ZA URL — left empty.
    BW: {
        soccerHighlights: '',
        soccerUpcoming: 'https://feeds-roa2.betwayafrica.com/br/_apis/sport/v1/BetBook/Upcoming/?countryCode=BW&sportId=soccer',
        liveTableTennis: '',
        esports: '',
    },
    // All 4 fields verified directly in the old repo's src/regions/MZ/commonflows/OddSelection.ts.
    // soccerUpcoming uses the feeds-roa2.betwayafrica.com host (same real pattern as BW/NG), the
    // other 3 use the en.betway.co.mz/sportsapi host directly.
    MZ: {
        soccerHighlights: 'https://en.betway.co.mz/sportsapi/br/v1/BetBook/Highlights/?countryCode=MZ&sportId=soccer',
        soccerUpcoming: 'https://feeds-roa2.betwayafrica.com/br/_apis/sport/v1/BetBook/Upcoming/?countryCode=MZ&sportId=soccer',
        liveTableTennis: 'https://en.betway.co.mz/sportsapi/br/v1/BetBook/LiveInPlay/?countryCode=MZ&sportId=table-tennis',
        esports: 'https://en.betway.co.mz/sportsapi/br/v1/BetBook/Highlights/?countryCode=MZ&sportId=esports-league-of-legends&Skip=0&Take=20&cultureCode=en-US&isEsport=true&boostedOnly=false&marketTypes=%5BMatch%20Winner%5D',
    },
    // soccerUpcoming verified in the old repo's shared Common-Flows/OddSelection.ts (which was
    // actually hardcoded to NG in its active code). esports/liveTableTennis's only usages hardcoded
    // a leftover ZA URL — left empty. soccerHighlights: the old repo's OddsSelection/placeBetWithIndex/
    // DrawNoBetOddsSelection/OddsSelectionAbove all resolved to the SAME "Upcoming" URL rather than a
    // distinct "Highlights" one, so there's no separately-confirmed Highlights value for NG — left
    // empty rather than guessing it matches soccerUpcoming.
    NG: {
        soccerHighlights: '',
        soccerUpcoming: 'https://www.betway.com.ng/sportsapi/br/v1/BetBook/Upcoming/?countryCode=NG&sportId=soccer',
        liveTableTennis: '',
        esports: '',
    },
};

export function activeRegion(): Region {
    return (process.env.REGION as Region) || 'ZA';
}
