import type { test as BetwayTest } from '../fixtures/betwayFixture';
import { expect } from '@playwright/test';
import { activeRegion } from '../config/oddsApiUrl';

export function runBookABetSuite(test: typeof BetwayTest, screenshotDir: string) {
    test.describe('BookABet Module Tests', () => {
        test.beforeEach(async () => {
            // Confirmed live: neither BW nor GH has a "Codesicon"-named button (or any other
            // dedicated Booking Codes entry point — checked the full nav, header, and hamburger
            // menu) anywhere on the sports page. Every test in this module routes through
            // clickBookingCode()/navigateToBookABetSearch(), which needs that button, so the whole
            // suite is unreachable here — not a locator typo, the feature's entry point genuinely
            // isn't exposed the way ZA's is. Skipping rather than guessing at a replacement.
            test.skip(['BW', 'GH'].includes(activeRegion()), 'No discoverable Booking Codes entry point on the live site for this region');
        });

        // T1: Verify Booking code button presence and functionality in sport section.
        test('T1-Verify Booking code button presence and functionality in sport section.', async ({ bookABetPage }, testInfo) => {
            await bookABetPage.navigateToBookABetSearch();
            await bookABetPage.captureScreenshot('bookABetSearch', screenshotDir, 'T1-bookabet', testInfo);
        });

        // T2: Verify Search booking code textbox presence and functionality on booking code page.
        test('T2-Verify Search booking code textbox presence and functionality on booking code page.', async ({ bookABetPage }, testInfo) => {
            await bookABetPage.navigateToBookABetSearchViaSport(); // Setup to get to the screen
            await bookABetPage.clickSearchTextBox();
            await bookABetPage.captureScreenshot('bookABetSearch', screenshotDir, 'T2-bookabet', testInfo);
        });

        // T3: Verify user is able to sort the booking code by winboost,odds,outcome and bets taken on booking code page.
        test('T3-Verify user is able to sort the booking code by winboost,odds,outcome and bets taken on booking code page.', async ({ bookABetPage }, testInfo) => {
            await bookABetPage.openSortByOddsDropdown();
            await bookABetPage.captureScreenshot('sortByOddsDropdown', screenshotDir, 'T3-bookabet', testInfo);
        });

        // T4: Verify Ascending and Descending button presence and functionality on booking code page.
        test('T4-Verify Ascending and Descending button presence and functionality on booking code page.', async ({ bookABetPage }, testInfo) => {
            await bookABetPage.clickArrowFilter(); // Click 1 (UP)
            await bookABetPage.clickArrowFilter(); // Click 2 (DOWN)
            await bookABetPage.captureScreenshot('arrowFilterDown', screenshotDir, 'T4-bookabet', testInfo);
        });

        // T5: Verify text message is displayed on clicking "i" icon
        test('T5-Verify text message is displayed on clicking "i" icon', async ({ bookABetPage }, testInfo) => {
            await bookABetPage.clickInfoButton();
            await bookABetPage.captureScreenshot('infoButton', screenshotDir, 'T5-bookabet', testInfo);
        });

        // T6: Verify Booking code dropdown presence and functionality on booking code page.
        test('T6-Verify Booking code dropdown presence and functionality on booking code page.', async ({ bookABetPage }, testInfo) => {
            await bookABetPage.openDetailedViewTabs();
            await bookABetPage.clickDetailedView();
            await bookABetPage.takeScreenshot('T6-bookabet', screenshotDir, testInfo);
        });

        // T7: Verify Share button presence and functionality on booking code page.
        test('T7-Verify Share button presence and functionality on booking code page.', async ({ bookABetPage }, testInfo) => {
            await bookABetPage.openSharePopup();
            await bookABetPage.captureScreenshot('sharePopup', screenshotDir, 'T7-bookabet', testInfo);
        });

        // T8 : Verify Copy booking code functionality on Booking code pop up window.
        test('T8-Verify Copy booking code functionality on Booking code pop up window.', async ({ bookABetPage }, testInfo) => {
            await bookABetPage.openSharePopup();
            await bookABetPage.clickCopyBookingCode();
            await bookABetPage.captureScreenshot('copyBookingCode', screenshotDir, 'T8-bookabet', testInfo);
            await bookABetPage.closePopup();
        });

        // T9 Verify Zoom out feature presence and functionality.
        test('T9-Verify Zoom out feature presence and functionality.', async ({ bookABetPage }, testInfo) => {
            await bookABetPage.openSharePopup();
            await bookABetPage.zoomIn();
            await bookABetPage.scrollToBottom();
            await bookABetPage.takeScreenshot('T9-bookabet', screenshotDir, testInfo);
        });

        // T 10 Verify user is able to share booking code by using social media options.
        test('T10-Verify user is able to share booking code by using social media options.', async ({ bookABetPage }, testInfo) => {
            await bookABetPage.openSharePopup();
            //  WhatsApp Functionality
            const newPage = await bookABetPage.clickWhatsAppButtonAndGetNewPage();
            await bookABetPage.takeScreenshot('T10-bookabet-whatsapp', screenshotDir, testInfo);
            await newPage.close();
        });

        // T11: Verify Presence of Key Betting Options on Booking Code Page.
        test('T11-Verify Presence of Key Betting Options on Booking Code Page.', async ({ bookABetPage }, testInfo) => {
            await bookABetPage.openDetailedViewTabs();
            await bookABetPage.clickDetailedView();
            await bookABetPage.takeScreenshot('T11-bookabet', screenshotDir, testInfo);
        });

        // T12: Verify user able to place a bet by adding legs from Booking code to betslip.
        test('T12-Verify user able to place a bet by adding legs from Booking code to betslip.', async ({ bookABetPage }, testInfo) => {
            await bookABetPage.openDetailedViewTabs(); // Setup
            await bookABetPage.clickAddToBetSlip();
            await bookABetPage.takeScreenshot('T12-bookabet', screenshotDir, testInfo);
        });

        // T13: Verify user able to place a bet by adding legs from Booking code to betslip.
        test('T13-Verify user able to place a bet by adding legs from Booking code to betslip.', async ({ bookABetPage }, testInfo) => {
            await bookABetPage.openDetailedViewTabs(); // Setup
            await bookABetPage.clickAddToBetSlip();
            await bookABetPage.Login();

            await bookABetPage.clickBetNow();
            await bookABetPage.navigateToMyBets();
            await bookABetPage.takeScreenshot('T13a-bookabet', screenshotDir, testInfo);
            await bookABetPage.navigateToTransactionHistory();
            await bookABetPage.takeScreenshot('T13b-bookabet', screenshotDir, testInfo);
        });

        // T14: Verify pagination at the bottom on booking code page.
        test('T14-Verify pagination at the bottom on booking code page.', async ({ bookABetPage }, testInfo) => {
            await bookABetPage.navigateToBookABetSearchViaSport();
            await bookABetPage.clickNextPagination();
            await bookABetPage.takeScreenshot('T14-bookabet', screenshotDir, testInfo);
        });

        // T15 confirmed NOT working live: copyBookingCodeFlow() opens via loc.shareButton, which
        // has zero matches on the real page today — same dead locator behind T7/T8/T9/T10 above
        // (all pre-existing, not introduced by this change). The whole "Share" popup this module's
        // T7-T10/T17/T18/T20 depend on appears to have been replaced by a plain copy-to-clipboard
        // icon in the current UI — left out rather than guessed at; worth a dedicated follow-up to
        // re-derive shareButton/detailedView/zoomInButton/downloadButton/socialMediaButtons
        // against the real current markup.
        // test('T15-Verify user is able to search for a booking code by pasting a copied code.', async ({ bookABetPage }, testInfo) => {
        //     await bookABetPage.clickSportButton();
        //     await bookABetPage.clickBookingCode();
        //     await bookABetPage.copyBookingCodeFlow();
        //     await bookABetPage.pasteAndSearchBookingCode();
        //     await expect(bookABetPage.loc.multiBetSlip).toBeVisible();
        //     await bookABetPage.takeScreenshot('T15-bookabet-search-by-code', screenshotDir, testInfo);
        // });

        // T16 confirmed NOT reliably working live: searchWithoutBookingCode()'s search-icon click
        // still fails intermittently even after fixing bookABetSearchIcon's element type (svg, not
        // img) and scoping — the search bar's own render timing in this specific flow (navigate
        // straight to Booking Codes without ever focusing the search box first) isn't consistent
        // enough to trust yet. Left out rather than shipped flaky; the bookABetSearchIcon fix
        // itself is still a real improvement, kept for whenever this gets revisited.
        // test('T16-Verify "Booking Code not found" error when searching with an empty search box.', async ({ bookABetPage }, testInfo) => {
        //     await bookABetPage.searchWithoutBookingCode();
        //     await expect(bookABetPage.loc.codeNotFound).toBeVisible();
        //     await bookABetPage.takeScreenshot('T16-bookabet-code-not-found', screenshotDir, testInfo);
        // });

        // T17 and T18 confirmed NOT working live — both depend on openSharePopup() (loc.shareButton,
        // 0 matches today), same dead entry point as T15/T20. See note above T15.
        // test('T17-Verify Zoom popup close button is visible and closes the popup.', async ({ bookABetPage }, testInfo) => {
        //     await bookABetPage.openSharePopup();
        //     await bookABetPage.zoomIn();
        //     await expect(bookABetPage.loc.zoomCloseButton).toBeVisible();
        //     await bookABetPage.takeScreenshot('T17-bookabet-zoom-close-visible', screenshotDir, testInfo);
        //     await bookABetPage.closeZoomPopup();
        //     await bookABetPage.takeScreenshot('T17-bookabet-zoom-closed', screenshotDir, testInfo);
        // });

        // test('T18-Verify Download button is visible and clickable on booking code page.', async ({ bookABetPage }, testInfo) => {
        //     await bookABetPage.openSharePopup();
        //     await expect(bookABetPage.loc.downloadButton).toBeVisible();
        //     await bookABetPage.clickDownloadButton();
        //     await bookABetPage.takeScreenshot('T18-bookabet-download', screenshotDir, testInfo);
        // });

        // T19 (ported from old repo's T10): confirms the "UP" (ascending) arrow-filter state on its
        // own — new T4 only ever exercises the double-click/"DOWN" state.
        test('T19-Verify Ascending (UP) sort state on booking code page.', async ({ bookABetPage }, testInfo) => {
            await bookABetPage.clickArrowFilter(); // single click = UP/ascending
            await bookABetPage.takeScreenshot('T19-bookabet-arrow-filter-up', screenshotDir, testInfo);
        });

        // T20 confirmed NOT working live — same dead openSharePopup() entry point as T15/T17/T18.
        // test('T20-Verify social media share buttons are visible on booking code share popup.', async ({ bookABetPage }, testInfo) => {
        //     await bookABetPage.openSharePopup();
        //     await expect(bookABetPage.loc.socialMediaButtons).toBeVisible();
        //     await bookABetPage.takeScreenshot('T20-bookabet-social-media-buttons', screenshotDir, testInfo);
        // });
    });
}
