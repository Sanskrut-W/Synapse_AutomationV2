import { activeRegion } from './oddsApiUrl';
import { loadRegionData } from './regionData';

export interface BetInfluencerAccount {
    mobile: string;
    password: string;
    name?: string;
}

/**
 * Account A (the influencer, who generates a booking code) and Account B (the follower, who
 * redeems it) for the active region.
 *
 * Resolution order, so a scheduled run can be pointed at dedicated accounts without editing any
 * file in the repo:
 *   1. region-scoped env  — BI_A_MOBILE_NG / BI_A_PASSWORD_NG
 *   2. global env         — BI_A_MOBILE / BI_A_PASSWORD
 *   3. the region's own json-data/userData.json (user1 = A, user5 = B)
 *
 * Step 3 is the existing convention, not a new one: betInfluencerSuite's User1PlaceBets() and
 * User2PlaceBetsFromBookingCode() already use exactly user1 and user5 for these two roles. The
 * env layers sit in front of it so nothing here is hardcoded per region.
 */
type Role = 'A' | 'B';

const USER_KEY_FOR_ROLE: Record<Role, string> = { A: 'user1', B: 'user5' };

function fromEnv(role: Role, field: 'MOBILE' | 'PASSWORD', region: string): string | undefined {
    return process.env[`BI_${role}_${field}_${region}`] || process.env[`BI_${role}_${field}`];
}

function resolve(role: Role, region: string): BetInfluencerAccount {
    const userKey = USER_KEY_FOR_ROLE[role];
    let fallback: any = {};
    try {
        fallback = loadRegionData('json-data/userData.json')[userKey] || {};
    } catch {
        // Region has no userData.json — env must supply the account, checked below.
    }

    const mobile = fromEnv(role, 'MOBILE', region) || fallback.mobile;
    const password = fromEnv(role, 'PASSWORD', region) || fallback.password;

    if (!mobile || !password) {
        throw new Error(
            `Bet Influencer account ${role} is not configured for region ${region}. ` +
            `Set BI_${role}_MOBILE_${region} / BI_${role}_PASSWORD_${region} (or the un-suffixed ` +
            `BI_${role}_MOBILE / BI_${role}_PASSWORD), or add "${userKey}" to ` +
            `src/regions/${region}/json-data/userData.json.`
        );
    }
    return { mobile: String(mobile), password: String(password), name: fallback.name };
}

export function betInfluencerAccounts(region: string = activeRegion()): {
    influencer: BetInfluencerAccount;
    follower: BetInfluencerAccount;
} {
    const influencer = resolve('A', region);
    const follower = resolve('B', region);

    // Bet Influencer pays the code owner for OTHER accounts' wagers. If both halves run as the
    // same login there is no payout to find on Thursday, and the daily run would look healthy
    // while producing nothing verifiable — fail loudly here instead.
    if (influencer.mobile === follower.mobile) {
        throw new Error(
            `Bet Influencer accounts A and B resolve to the same mobile (${influencer.mobile}) for ` +
            `region ${region}. They must be different accounts or no payout is ever generated.`
        );
    }
    return { influencer, follower };
}
