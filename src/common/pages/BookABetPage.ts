import { Page } from '@playwright/test';
import { BasePage } from './BasePage';
import { SafeActions } from '../actions/SafeActions';
import { css, role, text, xpath, first, at } from '../locators/sel';
import { highlightElements } from '../flows/HighlightElements';
import { ScreenshotHelper } from '../flows/ScreenshotHelper';

export class BookABetPage extends BasePage {
    constructor(page: Page, safeActions: SafeActions) {
        super(page, safeActions);

        this.loc = { ...this.loc, ...this.build('bookABet', {
            mobileNumber: first(role('textbox', { name: 'Mobile Number' })),
            password: first(role('textbox', { name: 'Enter Password' })),
            loginButton: first(role('button', { name: 'Login' })),
            bookABet: first(role('button', { name: 'Codesicon' })),
            bookABetSearch: first(role('textbox', { name: 'Search', exact: true })),
            bookABetSearchIcon: first(css('form img')),
            sortByOdds: xpath("//span[contains(@aria-label,'Bets Taken')]/div"),
            arrowFilter: css('.flex.w-8.h-8.p-1'),
            sportButton: first(role('link', { name: 'Sport Sport' })),
            shareButton: xpath('(//div[@class="flex items-center cursor-pointer"])[1]'),
            copyBookingCode: css("span[class='flex items-center gap-1'] div[class='md:relative']"),
            zoomInButton: first(css('svg.absolute.z-20')),
            zoomCloseButton: at(xpath("//div[@class='p-dialog-content']/div/div"), 1),
            detailedView: first(css('div.flex.bg-light-200 >> svg.rotate-180')),
            addToBetSlip: first(xpath("(//button[contains(@aria-label,'Add to Betslip')])[1]")),
            multiBetSlip: css('#betslip-multi-tab'),
            singleBetSlip: css('#betslip-single-tab'),
            betNowButton: first(css('#betslip-strike-btn')),
            myBetsButton: first(role('button', { name: 'My Bets' })),
            // #transaction-history-account-nav never matched anything on any region, live-confirmed
            // — the only real "transaction-history" ids on the My Bets panel are the pagination
            // arrows (-prev/-next). "Transaction History" is a real sidebar link on the same
            // account panel navigateToMyBets() already opens.
            transactionHistoryButton: role('link', { name: 'Transaction History' }),
            paginationNextButton: first(xpath("//div[normalize-space()='2']")),
            infoButton: css("//div[@class='md:relative']//*[name()='svg']"),
            whatsAppButton: css('a[href*="whatsapp.com"]'),
            telegramButton: first(css('.flex.w-full > a:nth-child(2)')),
            downloadButton: css('a:nth-child(6) > .rounded'),
            codeNotFound: first(text('Booking Code not found')),
            sortByOddsDD: css('div.p-dropdown-items:has-text("Odds Win Boost Outcomes Bets Taken")'),
            shareyourBet: first(text('Share your bet:Booking Code')),
            gotit: first(role('button', { name: 'Got it' })),
            closePopup: css('#modal-close-btn'),
            betslipDeleteButton: css('#betslip-remove-all img'),
            socialMediaButtons: css('.flex.w-full.mt-2.justify-evenly'),
        }) };
    }

    // --- Screenshot Utility Methods (MUST be kept here to use 'this.page' and 'this.loc') ---

    async captureScreenshot(locatorName: string, screenshotDir: string, fileName: string, testInfo: any) {
        const locator = this.loc[locatorName];
        await highlightElements(locator);
        await ScreenshotHelper(this.page, screenshotDir, fileName, testInfo);
    }
    async takeScreenshot(fileName: string, screenshotDir: string, testInfo: any) {
        await ScreenshotHelper(this.page, screenshotDir, fileName, testInfo);
    }

    // --- Core Navigation Methods ---

    // goto() and Login() are inherited from BasePage

    async closePopup() {
        const closeButton = this.loc.closePopup;
        if (await closeButton.isVisible({ timeout: 1000 })) {
            await closeButton.click();
            await this.page.waitForTimeout(500);
        }
    }

    async clickGotIt() {
        await this.loc.gotit.click();
        await this.page.waitForTimeout(1000);
    }

    async clickSportButton() {
        await this.loc.sportButton.click();
        await this.page.waitForTimeout(500);
    }

    async clickBookingCode() {
        await this.loc.bookABet.click();
        await this.page.waitForTimeout(500);
    }

    // --- POM Methods (Only perform actions and return control) ---

    // T2: Navigate to Book A Bet Search
    async navigateToBookABetSearch() {
        await this.clickGotIt();
        await this.clickBookingCode();
        await this.page.waitForTimeout(1000);
    }

    // T3: Verify Search box visibility setup
    async navigateToBookABetSearchViaSport() {
        await this.loc.sportButton.click();
        await this.clickBookingCode();
    }

    // T4: Click Search text box
    async clickSearchTextBox() {
        await this.loc.bookABetSearch.click();
        await this.page.waitForTimeout(2000);
    }

    // T5: Enter booking code via clipboard (T5 Setup)
    async copyBookingCodeFlow() {
        await this.loc.shareButton.click();
        await this.page.waitForTimeout(1000);
        await this.loc.copyBookingCode.click();
        await this.page.waitForTimeout(1000);
        await this.closePopup();
        await this.page.waitForTimeout(1000);
    }

    // T5: Enter booking code via clipboard (T5 Action)
    async pasteAndSearchBookingCode() {
        await this.loc.bookABetSearch.click();
        await this.loc.bookABetSearch.fill(''); // Clear any existing value
        await this.page.keyboard.press('Control+V'); // Paste clipboard content
        await this.loc.bookABetSearchIcon.click();
        await this.loc.multiBetSlip.click();
        await this.page.waitForTimeout(2000);
    }

    // T6: Search without code
    async searchWithoutBookingCode() {
        await this.loc.sportButton.click();
        await this.clickBookingCode();
        await this.loc.bookABetSearchIcon.click();
        await this.page.waitForTimeout(3000);
        // Do not assert here, let the spec file handle the assertion
    }

    // T8/T12: Open Sort By Odds dropdown
    async openSortByOddsDropdown() {
        await this.loc.sportButton.click();
        await this.clickBookingCode();
        await this.loc.sortByOdds.click();
        await this.page.waitForTimeout(1000);
    }

    // T10/T11: Click Arrow Filter
    // T4 calls this twice in a row to toggle ascending/descending — the Booking Codes panel opened
    // by the first call has no "Sport Sport" nav link inside it (confirmed live on MW: the nav bar
    // isn't rendered while that panel is open), so re-running the navigation on the second call
    // would hang waiting for a link that isn't there. Only navigate in if not already on the panel.
    async clickArrowFilter() {
        const alreadyOnPanel = await this.loc.arrowFilter.isVisible().catch(() => false);
        if (!alreadyOnPanel) {
            await this.loc.sportButton.click();
            await this.clickBookingCode();
        }
        await this.loc.arrowFilter.click();
        await this.page.waitForTimeout(1000);
    }

    // T13: Click Info Button
    async clickInfoButton() {
        await this.loc.sportButton.click();
        await this.clickBookingCode();
        await this.loc.infoButton.click();
        await this.page.waitForTimeout(1000);
    }

    // T14: Detailed View Tabs setup
    async openDetailedViewTabs() {
        await this.loc.sportButton.click();
        await this.clickBookingCode();
        await this.page.waitForTimeout(2000);
        // Do not assert, let the spec file do it
        await this.page.waitForTimeout(2000);
    }

    // T15-T20: Share flow setup
    async openSharePopup() {
        await this.loc.sportButton.click();
        await this.clickBookingCode();
        await this.loc.shareButton.click();
        await this.page.waitForTimeout(1000);
    }

    // T18/T19: Copy Booking Code
    async clickCopyBookingCode() {
        await this.loc.copyBookingCode.click();
        await this.page.waitForTimeout(1000);
    }

    // T21: Zoom in and setup for T27 scanner
    async zoomIn() {
        await this.loc.zoomInButton.click();
        await this.page.waitForTimeout(1000);
    }

    // T27: Scroll down to scanner
    async scrollToBottom() {
        await this.page.evaluate(() => {
            const container = document.querySelector('[role="dialog"]');
            if (container) {
                container.scrollTo({ top: container.scrollHeight, behavior: 'smooth' });
            } else {
                window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
            }
        });
        await this.page.waitForTimeout(1000);
    }

    // T22/T28: Close Zoom Popup
    async closeZoomPopup() {
        await this.loc.zoomCloseButton.click();
        await this.page.waitForTimeout(1000);
    }

    // T25: Click WhatsApp button
    async clickWhatsAppButtonAndGetNewPage() {
        const [newPage] = await Promise.all([
            this.page.context().waitForEvent('page'),
            this.loc.whatsAppButton.click(),
        ]);
        await newPage.waitForLoadState('domcontentloaded');
        return newPage;
    }

    // T26: Click Download
    async clickDownloadButton() {
        await this.loc.downloadButton.click();
        await this.page.waitForTimeout(1000);
    }

    // T31: Click detailed view to expand list
    async clickDetailedView() {
        await this.loc.detailedView.click();
        await this.page.waitForTimeout(2000);
    }

    // T33-T36: Bet Submission Flow actions
    async clickAddToBetSlip() {
        await this.loc.addToBetSlip.click();
        await this.loc.multiBetSlip.click();
        await this.page.waitForTimeout(1000);
    }

    async clickBetNow() {
        await this.loc.betNowButton.click();
        await this.page.waitForTimeout(1000);
    }

    async navigateToMyBets() {
        await this.loc.myBetsButton.click();
        await this.page.waitForTimeout(1000);
    }

    async navigateToTransactionHistory() {
        // navigateToMyBets() already leaves the account panel open, and "Transaction History" is
        // one of that same panel's sidebar links — no need to open the hamburger menu (its button
        // sits behind this panel's backdrop, which was intercepting the click).
        await this.loc.transactionHistoryButton.click();
        await this.page.waitForTimeout(1000);
    }

    // T37/T38: Click Dropdown and Pagination
    async setupDropdownAndPagination() {
        await this.loc.detailedView.click(); // Expand dropdown
        await this.page.waitForTimeout(1000);
    }

    async clickNextPagination() {
        await this.loc.paginationNextButton.click();
        await this.page.evaluate(() => {
            window.scrollBy({ top: -150, behavior: 'smooth' });
        });
        await this.page.waitForTimeout(6000);
    }
}
