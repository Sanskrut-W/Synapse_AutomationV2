import fs from 'fs';
import path from 'path';
import { activeRegion } from '../config/oddsApiUrl';

// Region-aware — the old repo's version hardcoded `regions/ZA/json-data/...` even though it
// lived in "shared" code; every other region silently wrote/read ZA's file. Using the active
// region here means this genuinely works once multiple regions are migrated.
function allBookingCodesPath() {
    return path.resolve(__dirname, '../../regions', activeRegion(), 'json-data/AllBookingCodes.json');
}

export async function storeAllBookingCode(BetInfluencerPage: import('../pages/BetInfluencerModal').BetInfluencerModal) {
    const monthNames = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December',
    ];
    const now = new Date();
    const currentMonth = monthNames[now.getMonth()];
    const currentYear = now.getFullYear();

    const apiPartial = `/BookingCode/${currentMonth}/${currentYear}`;
    console.log('Watching API containing:', apiPartial);
    let allPagesData = [];
    let currentPage = 1;
    let hasNext = true;
    await BetInfluencerPage.gotoDetailSectionBetInfluencerModal();
    while (hasNext) {
        const apiResponsePromise = BetInfluencerPage.page.waitForResponse((response: import('@playwright/test').Response) =>
            response.url().includes(apiPartial) &&
            response.url().includes(`page=${currentPage}`) &&
            response.status() === 200
        );
        if (currentPage === 1) {
            await BetInfluencerPage.loc.summaryButton.click();
            await BetInfluencerPage.clickDetailButton();
        }

        const apiResponse = await apiResponsePromise;
        const data = await apiResponse.json();

        allPagesData.push(data);
        hasNext = data.hasNextPage;
        if (hasNext) {
            currentPage++;
            await BetInfluencerPage.page.getByText('next').click();
        }
    }
    const output = { totalPages: allPagesData.length, pages: allPagesData };
    fs.writeFileSync(allBookingCodesPath(), JSON.stringify(output, null, 2));
}

export function getFirstBookingCode() {
    const filePath = allBookingCodesPath();
    if (fs.existsSync(filePath)) {
        const rawData = fs.readFileSync(filePath, 'utf-8');
        const bookingData = JSON.parse(rawData);
        if (bookingData.pages?.length > 0 && bookingData.pages[0].result?.length > 0) {
            return bookingData.pages[0].result[0].bookingCode;
        }
    }
    throw new Error('No booking codes found in AllBookingCodes.json');
}

export function getLastBookingCode() {
    const filePath = allBookingCodesPath();
    if (fs.existsSync(filePath)) {
        const rawData = fs.readFileSync(filePath, 'utf-8');
        const bookingData = JSON.parse(rawData);
        if (bookingData.pages?.length > 0) {
            const lastPage = bookingData.pages[bookingData.pages.length - 1];
            if (lastPage.result?.length > 0) {
                return lastPage.result[lastPage.result.length - 1].bookingCode;
            }
        }
    }
    throw new Error('No booking codes found in AllBookingCodes.json');
}
