import type { test as BetwayTest } from '../fixtures/betwayFixture';
import { activeRegion } from '../config/oddsApiUrl';

export function runBetSaverSuite(test: typeof BetwayTest, screenshotDir: string) {
    test.describe('BetSaver Module Tests', () => {

        // T6-9 Betsaver Active in My Bets
        test('T6-9 - Betsaver Active in My Bets', async ({ betSaverPage, page }, testInfo) => {
            // Confirmed live: MW has no Bet Saver promotion at all — checked up to 9 legs on the
            // betslip with no "Bet Saver" text anywhere. The rest of this module's tests weren't
            // reported as failing for MW, so left untouched here; worth a closer look given this.
            test.skip(activeRegion() === 'MW', 'MW has no Bet Saver promotion at all');
            await betSaverPage.placeBetsaverActiveBetAndNavigateToMyBets(7);

            // Confirmed live on TZ (reproduced 3x with a standalone script driving the real
            // BetSaverPage class): the shared demo account (userData.json's mobile 789124567,
            // used by every "user" slot and by every fixture's default login) can have zero
            // balance. When it does, clicking Bet Now doesn't throw or block the flow — it just
            // doesn't place anything (any resulting "Failed Bets — Insufficient Funds" modal gets
            // swept up by closePopup()'s generic #modal-close-btn dismissal same as a real success
            // modal would) — so My Bets shows "There are no available bets for this account"
            // instead of the bet just placed, 7 qualifying legs and all. This is the exact same
            // live condition already confirmed generically (not GH/TZ-specific) in
            // myBetSuite.shared.ts's beforeEach/T9/T11 — skip fast with the real reason here too,
            // instead of burning clickDetailViewButton's 5s timeout plus
            // verifyBetSaverTextVisibleInDetail's own 15s+reload+15s retry chain on a Detail View
            // button that structurally cannot exist when nothing was placed.
            const noBetsPlaced = await page.getByText('There are no available bets for this account').isVisible({ timeout: 3000 }).catch(() => false);
            test.skip(noBetsPlaced, 'Account had zero balance at test time — Bet Now did not actually place a bet, so there is nothing in My Bets for Detail View to act on');

            // T7 Detail View — BetSaver text SHOULD be visible
            await betSaverPage.clickDetailViewButton();
            await betSaverPage.verifyBetSaverTextVisibleInDetail();
            await betSaverPage.captureScreenshot('betSaverTextInDetail', screenshotDir, 'T7', testInfo);

            // T9 Opened Detail View — BetSaver text SHOULD be visible
            await betSaverPage.clickDetailViewButton();
            await betSaverPage.verifyBetSaverTextVisibleInDetail();
            await betSaverPage.captureScreenshot('betSaverTextInDetail', screenshotDir, 'T9', testInfo);

            // T13/T14 (REVERTED — confirmed live-failing on ZA): tried to check that a genuinely-active
            // BetSaver bet still shows the BetSaver text once it moves from Open to Settled. The premise
            // doesn't hold: a bet placed moments ago in THIS test run cannot have settled yet (real
            // matches take hours/days), so "Settled Bets" only ever shows OTHER, unrelated bets already
            // sitting in this shared demo account from earlier runs. The `noSettledBetsYet` guard only
            // detects a fully-empty Settled tab — it can't detect "other bets are settled, but not this
            // one" — so on any account with pre-existing settled history, clickDetailViewButton() opens
            // an unrelated bet's Detail View, and that bet's BetSaver text is correctly absent, which
            // just times out (confirmed live on ZA: 15s + reload + 15s retry, still hidden). There's no
            // way to make this deterministic without a way to target the specific just-placed bet's row
            // in the Settled list, which the UI doesn't expose. Same category as T33 (betslip) and the
            // other reverted betSaver tests this session — reverting rather than shipping a flaky check.
            // await betSaverPage.clickSettledBetsButton();
            // const noSettledBetsYet = await page.getByText('There are no available bets for this account').isVisible({ timeout: 3000 }).catch(() => false);
            // test.skip(noSettledBetsYet, 'Account has no settled bet history yet — nothing in Settled Bets for Detail View to act on');
            // await betSaverPage.clickDetailViewButton();
            // await betSaverPage.verifyBetSaverTextVisibleInDetail();
            // await betSaverPage.captureScreenshot('betSaverTextInDetail', screenshotDir, 'T13-T14-settled', testInfo);
        });

        // T1: Verify Betsaver not active
        test('T1 - Verify Betsaver not active', async ({ betSaverPage }, testInfo) => {
            await betSaverPage.verifyBetsaverNotActiveForFewSelections();

            await betSaverPage.captureScreenshot('betSaverNotActive', screenshotDir, 'T1', testInfo);
            await betSaverPage.deleteBetslipIfVisible();
        });
        // T2-3, T6-7: Betsaver Popup Flow (T6-7 added: the info popup's own "Continue" button, and
        // reopening the popup afterwards, had no coverage — T2-3 only ever opened it once).
        test('T2- Verify the Bet saver offer on betslip when it is active. T3-Verify the click functionality of "i" button and details  when Bet Saver is active', async ({ betSaverPage }, testInfo) => {

            await betSaverPage.setupBetsaverActive();
            await betSaverPage.captureScreenshot('betSaverActive', screenshotDir, 'T2', testInfo);

            await betSaverPage.openBetsaverInfoPopup();
            await betSaverPage.takeScreenshot(screenshotDir, 'T3', testInfo);

            // T6: "Continue" button inside the BetSaver info popup
            await betSaverPage.clickContinueInBetsaverInfo();
            await betSaverPage.takeScreenshot(screenshotDir, 'T6', testInfo);

            // T7: reopening the info popup after Continue closed it
            await betSaverPage.openBetsaverInfoPopup();
            await betSaverPage.takeScreenshot(screenshotDir, 'T7-reopened', testInfo);
            await betSaverPage.closePopup();
        });

        // T4-5: Betsaver gray out in My Bets
        test('T4-5 - Betsaver gray out in My Bets', async ({ betSaverPage, page }, testInfo) => {
            // T4 Upcoming
            await betSaverPage.placeQualifyingBetAndNavigateToMyBets(3);
            // await betSaverPage.captureScreenshot('betSaverInMyBets', screenshotDir, 'T4', testInfo);

            // T5 Settled — BetSaver text should NOT be visible in the Detail View (grayed out / non-qualifying)
            await betSaverPage.clickSettledBetsButton();

            // Confirmed live on NG: this is NOT a zero-balance issue (the account had a real,
            // nonzero balance both in the original failing run and independently re-checked live —
            // Bet Now genuinely places bets) and NOT a leg-count/threshold mismatch (a live re-check
            // right after this fix found the Settled Bets tab non-empty, with the first settled
            // bet's Detail View correctly showing BetSaver's grayed-out/hidden state exactly as T5
            // expects). The actual failure was that the account had NO settled bet history at all
            // at the moment that run executed — a real bet only moves from Open to Settled once its
            // underlying real-world match finishes, which doesn't happen inside a single test run,
            // so Settled Bets legitimately rendered the same "There are no available bets for this
            // account" empty state used elsewhere in this file (T6-9), leaving structurally no
            // Detail View button for anything to click. Skip with the real reason instead of
            // failing on a locator that cannot exist yet, same pattern as T6-9's own guard.
            const noSettledBets = await page.getByText('There are no available bets for this account').isVisible({ timeout: 3000 }).catch(() => false);
            test.skip(noSettledBets, 'Account has no settled bet history yet — nothing in Settled Bets for Detail View to act on');

            await betSaverPage.clickDetailViewButton();
            await betSaverPage.verifyBetSaverTextNotVisibleInDetail();
            await betSaverPage.takeScreenshot(screenshotDir, 'T5', testInfo);
        });

        // --- Below: ported from the old repo's modules/regression tier. Page object already had
        // every method these need syntactically, but most were never actually live-verified before
        // today — live-testing all 13 surfaced that the BetSaverPage class has more pre-existing
        // locator rot than the static method-existence check could catch: smartPicksButton
        // (`.flex > .col-span-6 > div:nth-child(4)`, used by 5 of these) and addToBetSlip
        // (a literal string that was never a real regex) both confirmed 0 matches live, and
        // selectOutrightBet's own multi-tab check doesn't hold for a genuinely single-leg outright
        // bet. Only T20 (mixed-sport slip) came back clean — kept below. The rest are left out
        // rather than shipped broken; fixing BetSaverPage's stale locators is a real, separate
        // follow-up, not something to guess through here.
        test('T20-Verify Betsaver is not active for a mixed-sport betslip.', async ({ betSaverPage }, testInfo) => {
            await betSaverPage.selectSportBetForMixedSlip();
            await betSaverPage.captureScreenshot('betSaverNotActive', screenshotDir, 'T20', testInfo);
        });
    });
}
