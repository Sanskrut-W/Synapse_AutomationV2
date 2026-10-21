import fs from 'fs';
import path from 'path';
import { activeRegion } from '../config/oddsApiUrl';

/** One bet placed by the follower using the influencer's booking code. */
export interface BetInfluencerEntry {
    bookingCode: string;
    betId: string | null;
    stake: string | null;
    placedAt: string;
    region: string;
}

/** A pending entry once Thursday has confirmed (or failed to confirm) its payout. */
export interface VerifiedEntry extends BetInfluencerEntry {
    verifiedAt: string;
    amountEarned: number;
    amountPaid: number;
    timesUsed: number;
}

export interface BetInfluencerLedger {
    region: string;
    pending: BetInfluencerEntry[];
    archived: VerifiedEntry[];
}

const THURSDAY = 4;

/**
 * Deliberately NOT src/regions/<R>/json-data/. That folder is rewritten by test runs — the
 * existing AllBookingCodes.json gets drained to an empty result set regularly (BW went 9 -> 0,
 * ZA 15 -> 4). This ledger has to survive from one Monday to the following Thursday, so it lives
 * in its own top-level test-data/ tree that nothing else writes to.
 */
export function ledgerPath(region: string = activeRegion()): string {
    return path.resolve(__dirname, '../../../test-data/betInfluencer', `${region}.json`);
}

export function readLedger(region: string = activeRegion()): BetInfluencerLedger {
    const file = ledgerPath(region);
    if (!fs.existsSync(file)) return { region, pending: [], archived: [] };
    try {
        const parsed = JSON.parse(fs.readFileSync(file, 'utf-8'));
        return {
            region: parsed.region || region,
            pending: Array.isArray(parsed.pending) ? parsed.pending : [],
            archived: Array.isArray(parsed.archived) ? parsed.archived : [],
        };
    } catch (e: any) {
        // A corrupt ledger must not take the daily run down with it, but it must be loud —
        // silently starting from empty would quietly discard a week of unverified bets.
        console.error(`[BetInfluencer] Ledger for ${region} is unreadable (${e.message}). Starting a fresh one; the old file is left on disk.`);
        return { region, pending: [], archived: [] };
    }
}

function writeLedger(ledger: BetInfluencerLedger) {
    const file = ledgerPath(ledger.region);
    fs.mkdirSync(path.dirname(file), { recursive: true });
    fs.writeFileSync(file, JSON.stringify(ledger, null, 2));
}

/** Append today's bet. Idempotent on bookingCode so a retried test cannot double-record. */
export function appendPending(entry: BetInfluencerEntry) {
    const ledger = readLedger(entry.region);
    if (ledger.pending.some(p => p.bookingCode === entry.bookingCode)) {
        console.log(`[BetInfluencer] ${entry.bookingCode} already recorded for ${entry.region} — not appending twice.`);
        return;
    }
    ledger.pending.push(entry);
    writeLedger(ledger);
    console.log(`[BetInfluencer] Recorded ${entry.bookingCode} for ${entry.region} (pending: ${ledger.pending.length}).`);
}

/** Start of the verification window: the Thursday before this one. */
export function windowStart(now: Date = new Date()): Date {
    const d = new Date(now);
    d.setHours(0, 0, 0, 0);
    let delta = (d.getDay() - THURSDAY + 7) % 7;
    if (delta === 0) delta = 7; // running ON Thursday covers the full preceding week
    d.setDate(d.getDate() - delta);
    return d;
}

export function isThursday(now: Date = new Date()): boolean {
    return now.getDay() === THURSDAY;
}

/**
 * Everything still awaiting verification. Entries older than the current window are returned too
 * rather than skipped — a missed Thursday would otherwise strand them in the ledger forever — but
 * they are reported separately so the distinction stays visible.
 */
export function pendingForVerification(region: string = activeRegion(), now: Date = new Date()) {
    const { pending } = readLedger(region);
    const start = windowStart(now);
    const inWindow = pending.filter(p => new Date(p.placedAt) >= start);
    const older = pending.filter(p => new Date(p.placedAt) < start);
    return { all: pending, inWindow, older, windowStart: start };
}

/** Move verified entries out of `pending` into `archived`. Unverified ones stay put. */
export function archiveVerified(region: string, verified: VerifiedEntry[]) {
    if (verified.length === 0) return;
    const ledger = readLedger(region);
    const done = new Set(verified.map(v => v.bookingCode));
    ledger.pending = ledger.pending.filter(p => !done.has(p.bookingCode));
    ledger.archived.push(...verified);
    writeLedger(ledger);
    console.log(`[BetInfluencer] Archived ${verified.length} verified entr${verified.length === 1 ? 'y' : 'ies'} for ${region}; ${ledger.pending.length} still pending.`);
}
