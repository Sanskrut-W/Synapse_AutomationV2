import { Page } from '@playwright/test';
import { BetInfluencerModal } from './BetInfluencerModal';
import { SafeActions } from '../actions/SafeActions';
import { OddsSelectionAbove } from '../flows/OddSelection';
import { GetBookingCode } from '../flows/GetBookingCode';
import { BetInfluencerAccount } from '../config/betInfluencerAccounts';

/** One row of the Bet Influencer "Details" API — the payout record for a booking code. */
export interface InfluencerLedgerRow {
    bookingCode: string;
    cumulativeWagerAmount: number;
    amountEarned: number;
    amountPaid: number;
    timesUsed: number;
    lastPayoutDate: string | null;
}

/**
 * Bet Influencer daily/payout automation.
 *
 * Extends BetInfluencerModal rather than BasePage so the whole live-proven chain comes for free
 * (BetInfluencerModal -> BetslipPage -> SportsPage -> LoginPage -> HomePage -> BasePage): login,
 * logout, odds selection, Bet Now + odds-change retry, the betslip booking-code input, and the
 * Bet Influencer panel navigation. Nothing in those classes is modified.
 *
 * What is new here is only what the daily/Thursday flow needs and the existing suite does not
 * have: credential-parameterised versions of the two halves (the existing User1PlaceBets /
 * User2PlaceBetsFromBookingCode hardcode user1 and user5), and a data-driven payout lookup.
 */
export class BetInfluencerPage extends BetInfluencerModal {
    constructor(page: Page, safeActions: SafeActions) {
        super(page, safeActions);
    }

    // ── Part 1 helpers ───────────────────────────────────────────────────────

    /**
     * Account A: log in, build a multi-leg betslip, place it, and capture the booking code the
     * confirmation modal shows. Logs out at the end so Account B can take over the same context.
     */
    async placeBetAsInfluencer(account: BetInfluencerAccount, legs: number = 5) {
        await this.gotoSportsPage();
        await this.LoginArgs(account.mobile, account.password);

        // OddsSelectionAbove silently skips any event it cannot click and returns how many legs it
        // actually got — ignoring that turns a thin feed into a confusing downstream failure.
        const selected = await OddsSelectionAbove(legs, 1.2, this.page);
        if (selected < legs) {
            throw new Error(
                `Only ${selected} of ${legs} legs could be selected — the betslip would not produce a ` +
                `shareable booking code. Usually too few qualifying events in the live feed, or a popup ` +
                `intercepted the odd clicks.`
            );
        }

        const stake = await this.readStake();
        await this.clickBetNowBtn();
        await this.retryBetIfOddsChanged();

        const confirmationText = await this.loc.bookingCodeMessage.locator('..').innerText();
        const bookingCode = await GetBookingCode(confirmationText);
        if (!bookingCode) {
            throw new Error(`Bet placed but no booking code could be parsed from the confirmation: "${confirmationText}"`);
        }

        const betId = this.parseBetId(confirmationText);
        await this.dismissConfirmation();
        await this.LogOut();

        console.log(`[BetInfluencer] Account A placed ${legs} legs -> booking code ${bookingCode} (stake: ${stake ?? 'unknown'}, betId: ${betId ?? 'unknown'}).`);
        return { bookingCode, betId, stake };
    }

    /**
     * Account B: log in, load Account A's booking code into the betslip and place it. This is the
     * action that actually earns the influencer a payout.
     */
    async redeemBookingCodeAsFollower(account: BetInfluencerAccount, bookingCode: string) {
        await this.LoginArgs(account.mobile, account.password);
        await this.loc.betslipButton.click();
        await this.loc.bookingCodeInput.fill(bookingCode);
        await this.page.keyboard.press('Enter');

        // The loaded code has to actually populate the slip before Bet Now means anything.
        await this.loc.betNowBtn.waitFor({ state: 'visible' });
        await this.clickBetNowBtn();
        await this.retryBetIfOddsChanged();
        await this.dismissConfirmation();
        await this.LogOut();

        console.log(`[BetInfluencer] Account B placed a bet from booking code ${bookingCode}.`);
    }

    // ── Part 2 helpers ───────────────────────────────────────────────────────

    /**
     * Every booking-code payout row for the logged-in influencer, read from the same paginated
     * API the Details panel renders from.
     *
     * Reading the API rather than scraping the table is deliberate: the response carries
     * amountEarned / amountPaid / timesUsed / lastPayoutDate per code, which is exactly the
     * question Thursday asks, and it is not subject to the panel's pagination rendering.
     */
    async fetchInfluencerLedgerRows(): Promise<InfluencerLedgerRow[]> {
        const now = new Date();
        const month = now.toLocaleString('en-US', { month: 'long' });
        const apiPartial = `/BookingCode/${month}/${now.getFullYear()}`;

        const rows: InfluencerLedgerRow[] = [];
        let currentPage = 1;
        let hasNext = true;

        await this.gotoDetailSectionBetInfluencerModal();

        while (hasNext) {
            const responsePromise = this.page.waitForResponse(
                (r) => r.url().includes(apiPartial) && r.url().includes(`page=${currentPage}`) && r.status() === 200
            );

            if (currentPage === 1) {
                await this.loc.summaryButton.click();
                await this.clickDetailButton();
            }

            const data = await (await responsePromise).json();
            for (const row of data.result || []) {
                rows.push({
                    bookingCode: row.bookingCode,
                    cumulativeWagerAmount: Number(row.cumulativeWagerAmount) || 0,
                    amountEarned: Number(row.amountEarned) || 0,
                    amountPaid: Number(row.amountPaid) || 0,
                    timesUsed: Number(row.timesUsed) || 0,
                    lastPayoutDate: row.lastPayoutDate ?? null,
                });
            }

            hasNext = Boolean(data.hasNextPage);
            if (hasNext) {
                currentPage++;
                await this.loc.nextButton.click();
            }
        }

        console.log(`[BetInfluencer] Read ${rows.length} payout row(s) for ${month} ${now.getFullYear()}.`);
        return rows;
    }

    /** The payout row for one booking code, or null if the influencer panel has never seen it. */
    findPayoutRow(rows: InfluencerLedgerRow[], bookingCode: string): InfluencerLedgerRow | null {
        return rows.find(r => r.bookingCode?.toUpperCase() === bookingCode.toUpperCase()) ?? null;
    }

    // ── Internals ────────────────────────────────────────────────────────────

    /** Best-effort stake read; the amount is reporting detail, never a reason to fail a bet. */
    private async readStake(): Promise<string | null> {
        try {
            const input = this.page.locator('#bet-amount-input').first();
            await input.waitFor({ state: 'visible', timeout: 5000 });
            return (await input.inputValue()) || null;
        } catch {
            console.warn('[BetInfluencer] Stake field not readable — recording the bet without it.');
            return null;
        }
    }

    /**
    /**
     * Best-effort bet id from the confirmation modal.
     *
     * NOTE: unlike the booking code, no confirmed locator or wording for a bet/reference id has
     * been verified live on any region. These patterns are a guess against the modal text, and
     * null is a perfectly normal result. The ledger keys off bookingCode, which is what the
     * payout API matches on, so a missing bet id never blocks Thursday verification.
     */
    private parseBetId(confirmationText: string): string | null {
        const patterns = [
            /Bet\s*(?:ID|Id|Reference|Ref)\s*[:#]?\s*([A-Z0-9-]{4,})/i,
            /Reference\s*(?:Number)?\s*[:#]?\s*([A-Z0-9-]{4,})/i,
        ];
        for (const re of patterns) {
            const m = confirmationText.match(re);
            if (m) return m[1];
        }
        return null;
    }

    /** Close the bet-confirmation modal if it is up. Never fatal, the bet is already placed. */
    private async dismissConfirmation() {
        try {
            await this.page.locator('#modal-close-btn').first().click({ timeout: 5000 });
        } catch {
            // Already dismissed, or this region does not show one.
        }
    }
}
