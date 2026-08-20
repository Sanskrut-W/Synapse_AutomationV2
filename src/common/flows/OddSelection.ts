import { Page } from '@playwright/test';
import { API_URLS, activeRegion, OddsApiConfig } from '../config/oddsApiUrl';

/**
 * Odds-selection helpers — region-agnostic. The old repo had THREE diverged copies of this file
 * (ZA's commonflows, NG's commonflows, and a "shared" Common-Flows/OddSelection.ts that was
 * actually hardcoded to NG's domain in its active code, with a half-written region-parameterized
 * version commented out above it). This file finishes that half-written version, validated
 * against ZA's proven-correct behavior (the 5 real functions in the old ZA commonflows/OddSelection.ts).
 */

async function waitForOddsApi(page: Page, apiUrl: string) {
    const response = await page.waitForResponse((r) => r.url().startsWith(apiUrl) && r.status() === 200);
    return response.json();
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
    await page.reload({ waitUntil: 'domcontentloaded' });
    const data = await waitForOddsApi(page, soccerUpcoming);
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
    await page.reload({ waitUntil: 'domcontentloaded' });
    const data = await waitForOddsApi(page, soccerHighlights);
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
    await page.reload({ waitUntil: 'domcontentloaded' });
    const data = await waitForOddsApi(page, esports);
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
    await page.locator('#pv_id_3').click();
    await page.getByText('Draw No Bet').last().click();
    const data = await waitForOddsApi(page, soccerHighlights);
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
    await page.reload({ waitUntil: 'domcontentloaded' });
    await page.getByRole('img', { name: 'Table Tennis' }).click();
    const data = await waitForOddsApi(page, liveTableTennis);
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
    // stabilize page
    await page.reload({ waitUntil: 'domcontentloaded' });

    // close modal if present
    try { await page.locator('#modal-close-btn').click({ timeout: 10000 }); } catch { /* not shown */ }

    // ensure Upcoming tab is active
    await page.locator('#sports-tabs div').filter({ hasText: 'Upcoming' }).first().click();

    const data = await waitForOddsApi(page, soccerUpcoming);

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
            await oddLocator.click();
            selected++;
            await page.waitForTimeout(1000);
        } catch {
            continue;
        }
    }
    return selected;
}
