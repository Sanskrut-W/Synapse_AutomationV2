import path from 'path';
import { activeRegion } from './oddsApiUrl';

/**
 * Loads a JSON data file from the active region's own folder (src/regions/<REGION>/<relativePath>).
 * Several shared Page Objects need region-specific data (userData.json, api.json, ...) — this
 * keeps that lookup dynamic instead of hardcoding a region name inside otherwise-shared code
 * (the old repo's shared OddSelection.ts hardcoding NG's domain was exactly this mistake).
 */
export function loadRegionData(relativePath: string): any {
    const fullPath = path.resolve(__dirname, '../../regions', activeRegion(), relativePath);
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    return require(fullPath);
}

/**
 * The account used by the flows that have to place a REAL, funded bet — My Bets' Open Bets
 * tests and BetSaver's "active in My Bets" flow. Everything else keeps using the normal default
 * login (`user4`), and so does this when a region defines no `bettingUser`.
 *
 * Why this exists: those flows are the only ones whose outcome depends on the account having
 * money. When the default account runs dry the tests don't fail — they `test.skip()` with
 * "insufficient balance" and quietly drop out of the suite (confirmed live 2026-10-19: MZ's
 * `user4` 123456714 held MT 2,59, so its betSaver T6-9 and myBet T9/T11 skipped on every run,
 * while 889388993 in the same region's userData.json held MT 965,20). Pointing one slot at a
 * funded account fixes that without disturbing the login identity the rest of the suite asserts
 * against (`user1.name` via verifyWelcomeUser, etc.).
 */
export function bettingUser(): { mobile: string; password: string } {
    const userData = loadRegionData('json-data/userData.json');
    return userData.bettingUser || userData.user4;
}
