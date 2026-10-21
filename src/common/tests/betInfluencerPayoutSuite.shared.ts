import type { test as BetInfluencerTest } from '../fixtures/betInfluencerFixture';
import { expect } from '@playwright/test';
import { activeRegion } from '../config/oddsApiUrl';
import { betInfluencerAccounts } from '../config/betInfluencerAccounts';
import { ScreenshotHelper } from '../flows/ScreenshotHelper';
import {
    appendPending,
    archiveVerified,
    isThursday,
    pendingForVerification,
    VerifiedEntry,
} from '../flows/betInfluencerStore';
import type { InfluencerLedgerRow } from '../pages/BetInfluencerPage';

/** Legs on the influencer betslip. More legs means a larger wager and a clearer payout. */
const LEGS = 5;

/**
 * Part 1 - daily flow. Account A places a bet and shares its booking code; Account B redeems it,
 * which is what generates the influencer payout. The booking code is written to the ledger so
 * Thursday can come back and check it was actually paid.
 */
export function runBetInfluencerDailySuite(test: typeof BetInfluencerTest, screenshotDir: string) {
    test.describe('Bet Influencer - daily booking code flow', () => {
        test('Account A places a bet, Account B redeems the booking code', async ({ betInfluencerPage, page }, testInfo) => {
            // Two full login/logout cycles plus odds selection and two bet placements. The 90s
            // default is nowhere near enough; the existing T17 budgets similarly.
            test.setTimeout(1_200_000);

            const region = activeRegion();
            const { influencer, follower } = betInfluencerAccounts(region);
            let bookingCode = '';
            let betId: string | null = null;
            let stake: string | null = null;

            await test.step(`Account A places a ${LEGS}-leg bet and captures the booking code`, async () => {
                const placed = await betInfluencerPage.placeBetAsInfluencer(influencer, LEGS);
                bookingCode = placed.bookingCode;
                betId = placed.betId;
                stake = placed.stake;
                expect(bookingCode, 'Account A should produce a shareable booking code').toBeTruthy();
                await ScreenshotHelper(page, screenshotDir, `daily-${region}-A-booking-code`, testInfo);
            });

            await test.step('Account B loads that booking code and places the bet', async () => {
                await betInfluencerPage.redeemBookingCodeAsFollower(follower, bookingCode);
                await ScreenshotHelper(page, screenshotDir, `daily-${region}-B-bet-placed`, testInfo);
            });

            await test.step('Record the bet so Thursday can verify its payout', async () => {
                appendPending({
                    bookingCode,
                    betId,
                    stake,
                    placedAt: new Date().toISOString(),
                    region,
                });
            });
        });
    });
}

/**
 * Part 2 - Thursday verification. Logs in as Account A and checks the influencer payout panel for
 * every booking code the daily flow recorded, then archives the ones that paid out.
 */
export function runBetInfluencerThursdaySuite(test: typeof BetInfluencerTest, screenshotDir: string) {
    test.describe('Bet Influencer - Thursday payout verification', () => {
        test('Account A received a payout for every booking code Account B used', async ({ betInfluencerPage, page }, testInfo) => {
            test.setTimeout(1_200_000);

            // Runs on Thursday only, with an explicit escape hatch for debugging on any other day.
            const forced = process.env.FORCE_PAYOUT_CHECK === 'true';
            const today = new Date().toLocaleDateString('en-US', { weekday: 'long' });
            test.skip(
                !isThursday() && !forced,
                `Payout verification runs on Thursdays. Today is ${today}. Set FORCE_PAYOUT_CHECK=true to run it anyway.`
            );

            const region = activeRegion();
            const { influencer } = betInfluencerAccounts(region);
            const { all, inWindow, older, windowStart } = pendingForVerification(region);

            test.skip(all.length === 0, `No unverified Bet Influencer bets recorded for ${region} - run the daily flow first.`);

            if (older.length > 0) {
                // Stragglers from a missed Thursday are still checked, just called out separately
                // so they are not mistaken for this week bets.
                console.warn(`[BetInfluencer] ${older.length} entries predate the current window (since ${windowStart.toDateString()}) - verifying them too.`);
            }
            console.log(`[BetInfluencer] ${region}: verifying ${all.length} booking code(s); ${inWindow.length} from this week.`);

            let rows: InfluencerLedgerRow[] = [];

            await test.step('Log in as Account A and open the Bet Influencer details panel', async () => {
                await betInfluencerPage.gotoSportsPage();
                await betInfluencerPage.LoginArgs(influencer.mobile, influencer.password);
                rows = await betInfluencerPage.fetchInfluencerLedgerRows();
                await ScreenshotHelper(page, screenshotDir, `thursday-${region}-influencer-details`, testInfo);
            });

            const paid: VerifiedEntry[] = [];
            const missing: string[] = [];

            await test.step('Match every recorded booking code against its payout row', async () => {
                for (const entry of all) {
                    const row = betInfluencerPage.findPayoutRow(rows, entry.bookingCode);
                    const placedOn = entry.placedAt.slice(0, 10);

                    if (row && row.amountPaid > 0) {
                        paid.push({
                            ...entry,
                            verifiedAt: new Date().toISOString(),
                            amountEarned: row.amountEarned,
                            amountPaid: row.amountPaid,
                            timesUsed: row.timesUsed,
                        });
                        console.log(`[BetInfluencer] PAID    ${entry.bookingCode} - earned ${row.amountEarned}, paid ${row.amountPaid}, used ${row.timesUsed}x`);
                    } else if (row) {
                        missing.push(`${entry.bookingCode} (placed ${placedOn}) - found in the panel but amountPaid is ${row.amountPaid}; earned ${row.amountEarned}, used ${row.timesUsed}x`);
                        console.warn(`[BetInfluencer] UNPAID  ${entry.bookingCode} - earned ${row.amountEarned}, paid ${row.amountPaid}`);
                    } else {
                        missing.push(`${entry.bookingCode} (placed ${placedOn}) - no payout row at all in the influencer panel`);
                        console.warn(`[BetInfluencer] ABSENT  ${entry.bookingCode} - no row in the influencer panel`);
                    }
                }
            });

            await test.step('Archive the verified entries', async () => {
                // Archive before asserting, so a partially successful week still clears the codes
                // that genuinely paid out instead of re-checking them every Thursday.
                archiveVerified(region, paid);
            });

            await test.step('Report the result', async () => {
                console.log(`[BetInfluencer] ${region}: ${paid.length} paid, ${missing.length} missing, out of ${all.length}.`);
                expect(
                    missing,
                    `Bet Influencer payouts missing in ${region}:\n  - ${missing.join('\n  - ')}`
                ).toHaveLength(0);
            });
        });
    });
}
