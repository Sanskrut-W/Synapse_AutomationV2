import { Page } from '@playwright/test';
import { API_URLS, activeRegion, OddsApiConfig } from '../config/oddsApiUrl';

/**
 * Odds-selection helpers — region-agnostic. The old repo had THREE diverged copies of this file
 * (ZA's commonflows, NG's commonflows, and a "shared" Common-Flows/OddSelection.ts that was
 * actually hardcoded to NG's domain in its active code, with a half-written region-parameterized
 * version commented out above it). This file finishes that half-written version, validated
 * against ZA's proven-correct behavior (the 5 real functions in the old ZA commonflows/OddSelection.ts).
 */

/**
 * Registers the response listener BEFORE running `trigger` (the reload/click that actually causes
 * the odds-API request), not after. Every call site here used to reload/click FIRST and only then
 * call waitForResponse — a real, confirmed race: if the site answers fast enough, the response
 * already arrives before the listener attaches, and waitForResponse then hangs for its full
 * timeout waiting for a response that already happened. This was surfacing consistently on GH.
 */
/**
 * Clicks `locator`, dismissing any promotional popup that appears in between retries. Confirmed
 * live on MZ: promotional interstitials (their own dedicated close button, distinct from any
 * legitimate panel) can mount on a delay — a "show after a few seconds" pattern — so a single
 * close-before-clicking pass can miss one that appears mid-retry. Safe to use only where nothing
 * legitimate could be open yet (e.g. right after a fresh reload).
 */
async function clickDismissingPopups(page: Page, locator: ReturnType<Page['locator']>, attempts = 6) {
    for (let i = 0; i < attempts; i++) {
        try {
            await locator.click({ timeout: 8000 });
            return;
        } catch (e) {
            if (i === attempts - 1) throw e;
            const closeButtons = page.locator('#modal-close-btn').filter({ visible: true });
            const closeCount = await closeButtons.count().catch(() => 0);
            for (let j = 0; j < closeCount; j++) {
                try { await closeButtons.first().click({ timeout: 3000 }); await page.waitForTimeout(300); } catch { /* not shown */ }
            }
        }
    }
}

async function waitForOddsApi(page: Page, apiUrl: string, trigger: () => Promise<unknown>) {
    // Confirmed live on GH: `trigger` can run multiple steps after the awaited response arrives
    // (e.g. OddsSelectionAbove's trigger reloads, then separately clicks the "Upcoming" tab) — if
    // any of those later steps causes another navigation before `.json()` is called, Chrome
    // discards the earlier response's body ("Response body is not available for a response that
    // was navigated away from"). Reading the body as soon as the response itself resolves — not
    // after `trigger()` finishes — avoids the race.
    const responseJsonPromise = page
        .waitForResponse((r) => r.url().startsWith(apiUrl) && r.status() === 200)
        .then((r) => r.json());
    await trigger();
    return responseJsonPromise;
}

/**
 * Most regions only have SOME of the 4 odds-API fields verified against the live site (many were
 * a straight ZA copy-paste in the old repo — see per-field comments in oddsApiUrl.ts). Validating
 * only `soccerUpcoming` (as an earlier version of this file did) let an unverified empty field
 * silently pass through: `waitForResponse(r => r.url().startsWith(''))` matches the FIRST 200
 * response on the page, not the intended API — a wrong-answer bug, not a loud failure. Each
 * function below requires its OWN field explicitly instead.
 */
function requireUrl(field: keyof OddsApiConfig): string {
    const region = activeRegion();
    const url = API_URLS[region]?.[field];
    if (!url) {
        throw new Error(`No '${field}' odds-API URL configured for region '${region}' yet — see src/common/config/oddsApiUrl.ts`);
    }
    return url;
}

export async function OddsSelection(numberOflegs: number, page: Page) {
    const soccerUpcoming = requireUrl('soccerUpcoming');
    const data = await waitForOddsApi(page, soccerUpcoming, () => page.reload({ waitUntil: 'domcontentloaded' }));
    for (let i = 0; i < numberOflegs; i++) {
        const eventId = data.events?.[i]?.eventId;
        if (!eventId) continue;
        const priceObj = data.prices?.find((p: any) => p.outcomeId === `${eventId}11`);
        if (!priceObj) continue;
        await page.locator(`//div[@id="${eventId}"]`).locator('div[price]').getByText(`${priceObj.priceDecimal}`, { exact: false }).first().click();
        await page.waitForTimeout(1000);
    }
}

export async function placeBetWithIndex(legNum: number, page: Page) {
    const soccerHighlights = requireUrl('soccerHighlights');
    const data = await waitForOddsApi(page, soccerHighlights, () => page.reload({ waitUntil: 'domcontentloaded' }));
    for (let i = legNum; i < 10; i++) {
        const eventId = data.events?.[i]?.eventId;
        if (!eventId) continue;
        const priceObj = data.prices?.find((p: any) => p.outcomeId === `${eventId}11`);
        if (!priceObj) continue;
        const oddValue = page.locator(`//div[@id="${eventId}"]`).locator('div[price]').getByText(`${priceObj.priceDecimal}`, { exact: false }).first();
        await oddValue.click();
        await page.waitForTimeout(1000);
        break;
    }
}

export async function EsportsOddsSelection(numberOflegs: number, page: Page) {
    const esports = requireUrl('esports');
    const data = await waitForOddsApi(page, esports, () => page.reload({ waitUntil: 'domcontentloaded' }));
    for (let i = 1; i < numberOflegs; i++) {
        const eventId = data.events?.[i]?.eventId;
        if (!eventId) continue;
        const priceObj = data.prices?.find((p: any) => p.outcomeId === `${eventId}1864`);
        if (!priceObj) continue;
        const oddValue = page.locator(`//div[@id="${eventId}"]`).locator('div[price]').getByText(`${priceObj.priceDecimal}`, { exact: false }).first();
        await oddValue.click();
        await page.waitForTimeout(1000);
    }
    await page.waitForTimeout(5000);
}

export async function DrawNoBetOddsSelection(numberOflegs: number, page: Page) {
    const soccerHighlights = requireUrl('soccerHighlights');
    const data = await waitForOddsApi(page, soccerHighlights, async () => {
        await page.locator('#pv_id_3').click();
        await page.getByText('Draw No Bet').last().click();
    });
    for (let i = 0; i < numberOflegs; i++) {
        const eventId = data.events?.[i]?.eventId;
        if (!eventId) continue;
        const priceObj = data.prices?.find((p: any) => p.outcomeId === `${eventId}114`);
        if (!priceObj) continue;
        const oddValue = page.locator(`//div[@id="${eventId}"]`).locator('div[price]').getByText(`${priceObj.priceDecimal}`, { exact: false }).first();
        await oddValue.click();
        await page.waitForTimeout(1000);
    }
    await page.waitForTimeout(5000);
}

export async function LiveOddsSelection(numberOfLegs: number, page: Page) {
    const liveTableTennis = requireUrl('liveTableTennis');
    const data = await waitForOddsApi(page, liveTableTennis, async () => {
        await page.reload({ waitUntil: 'domcontentloaded' });
        await page.getByRole('img', { name: 'Table Tennis' }).click();
    });
    for (let i = 0; i < numberOfLegs; i++) {
        const eventId = data.events?.[i]?.eventId;
        if (!eventId) continue;
        const priceObj = data.prices?.find((p: any) => p.outcomeId === `${eventId}1864`);
        if (!priceObj) continue;
        const oddValue = page.locator(`//div[@id="${eventId}"]`).locator('div[price]').getByText(`${priceObj.priceDecimal}`, { exact: false });
        await oddValue.click();
        await page.waitForTimeout(1000);
    }
    await page.waitForTimeout(5000);
}

export async function OddsSelectionAbove(numberOflegs: number, minOdd: number, page: Page) {
    const soccerUpcoming = requireUrl('soccerUpcoming');

    const data = await waitForOddsApi(page, soccerUpcoming, async () => {
        // Confirmed live on MZ: below Tailwind's `xl` breakpoint a mobile-style bottom tab bar
        // renders and can intercept the odd-price clicks below — each click failure is caught and
        // silently skipped (see the loop below), so this can end with zero legs selected and no
        // thrown error at all. Same class of responsive-layout issue already worked around in
        // NewHomePage/BetSaverPage via an explicit desktop viewport.
        await page.setViewportSize({ width: 1920, height: 1080 });

        // stabilize page — confirmed live on MZ: calling this right after a page/fixture setup
        // that just navigated (e.g. login) can race an in-flight navigation, aborting the reload
        // with net::ERR_ABORTED. Retrying once after a short settle avoids that race.
        try {
            await page.reload({ waitUntil: 'domcontentloaded' });
        } catch {
            await page.waitForTimeout(1000);
            await page.reload({ waitUntil: 'domcontentloaded' });
        }

        // Confirmed live on MZ: right after a reload there's a brief window where client-side
        // session hydration hasn't finished — the header can show a logged-out state (Login/Sign
        // Up buttons) even though the user is genuinely authenticated, which then hides the Bet Now
        // button entirely later in the flow. Same issue already documented and handled in
        // BetSaverPage.preparePage(); best-effort, so a genuinely logged-out flow just times out
        // and continues.
        await page.getByRole('button', { name: 'Deposit' }).waitFor({ state: 'visible', timeout: 15000 }).catch(() => { });

        // close ALL currently-visible modal popups — confirmed live on MZ: more than one can be
        // open at once (several popups share the same underlying modal component, e.g. a
        // promotional interstitial layered with another), so closing only the first can leave a
        // second one still open to intercept the Upcoming-tab click right after.
        const closeButtons = page.locator('#modal-close-btn').filter({ visible: true });
        const closeCount = await closeButtons.count().catch(() => 0);
        for (let i = 0; i < closeCount; i++) {
            try { await closeButtons.first().click({ timeout: 5000 }); await page.waitForTimeout(300); } catch { /* not shown */ }
        }

        // ensure Upcoming tab is active — a delayed-appearing promo can still intercept this even
        // after the sweep above, so retry with fresh dismissals rather than a single attempt.
        await clickDismissingPopups(page, page.locator('#sports-tabs div').filter({ hasText: 'Upcoming' }).first());
    });

    let selected = 0;
    for (let i = 0; i < data.events?.length; i++) {
        if (selected >= numberOflegs) break;
        const event = data.events[i];
        if (!event) continue;
        if (event.isActive === false) continue;
        const eventId = event.eventId;
        if (!eventId) continue;
        const priceObj = data.prices?.find((p: any) => p.outcomeId === `${eventId}11` && parseFloat(String(p.priceDecimal)) > minOdd);
        if (!priceObj) continue;
        const oddLocator = page.locator(`//div[@id="${eventId}"]`).locator('div[price]').getByText(`${priceObj.priceDecimal}`, { exact: false }).first();
        try {
            await oddLocator.waitFor({ state: 'visible', timeout: 10000 });
            await oddLocator.scrollIntoViewIfNeeded();
            // A delayed-appearing promo popup can intercept this click; retry with a dismiss
            // rather than silently skipping the event (see clickDismissingPopups above) — with a
            // small attempt count so a genuinely stale/off-screen odd still fails fast.
            await clickDismissingPopups(page, oddLocator, 2);
            selected++;
            await page.waitForTimeout(1000);
        } catch {
            continue;
        }
    }
    return selected;
}
