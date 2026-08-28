import { Page, expect } from '@playwright/test';
import { BasePage } from './BasePage';
import { SafeActions } from '../actions/SafeActions';
import { css, role, text, label, first, at } from '../locators/sel';
import { highlightElements } from '../flows/HighlightElements';
import { ScreenshotHelper } from '../flows/ScreenshotHelper';

export class FeedsPage extends BasePage {
    private readonly TEST_TRANSACTION_ID = '12345678';

    constructor(page: Page, safeActions: SafeActions) {
        super(page, safeActions);

        this.loc = { ...this.loc, ...this.build('feeds', {
            feeds: first(css('.feeds-header-container')),
            helpIcon: label('Betway Feeds Help Button'),
            dotsIcon: at(css("button:has-text('dots-icon')"), 1),
            // Source options ({"text-is": true}) aren't a valid getByText option, ignored at runtime.
            unfollowButton: at(text('Unfollow'), 1),
            followButton: at(label('Follow', { exact: true }), 1),
            followingIcon: first(role('button', { name: 'Following' })),
            feedsProfile: css('#bw-feeds-sidebar button:has-text("Feed Avatar")'),
            profilenameInFeeds: first(role('textbox', { name: 'Profile Name' })),
            handleInFeeds: first(role('textbox', { name: 'Handle' })),
            createProfileinFeeds: first(role('button', { name: 'Create Profile' })),
            createProfileInFooterFeeds: first(css('.create-post-button-container-inner')),
            firstFeeds: first(css('feeds-card-header.hydrated >>div')),
            commentsInPopup: at(role('button', { name: 'Comment' }), 10),
            comments: first(role('button', { name: 'Comment' })),
            commentsPopup: first(text('Comments')),
            commentTextBox: first(role('textbox', { name: 'Write a comment...' })),
            helpInComments: first(css('feeds-comments-author ui-button:has(img[alt="dots-icon"])')),
            submitincomments: first(role('button', { name: 'Submit' })),
            removeComments: first(text('REMOVE')),
            firstCommentDiv: first(css('feeds-comments-author.hydrated')),
            likebutton: first(role('button', { name: 'Like' })),
            reportButton: first(text('REPORT')),
            shareButtonInPopup: at(role('button', { name: 'Share' }), 10),
            shareButton: first(role('button', { name: 'Share' })),
            sharePopup: first(text('Share Post', { exact: true })),
            whatsAppButton: first(css('div.share-button')),
            closeComments: at(css('#modal-close-btn'), 1),
            closePopup: first(css('#modal-close-btn')),
            profilePopup: first(css('feeds-profile-form.hydrated')),
            editIcon: first(role('button', { name: 'Feeds Avatar' })),
            feedsHeader: at(css('div.feeds-header-container'), 1),
            searchInFeeds: first(role('textbox', { name: 'Find friends, teams & leagues to follow' })),
            suggestedFeedsFollow: first(label('Follow', { exact: true })),
            suggestedFeedsUnFollow: first(role('button', { name: 'Unfollow' })),
            searchOnHome: first(role('textbox', { name: 'Search teams or leagues' })),
            followInSearch: at(css('button:has-text("Follow")'), 1),
            searchCloseInHome: first(css(':text("Results") >> svg')),
            mobileNumber: first(role('textbox', { name: 'Mobile Number' })),
            password: first(role('textbox', { name: 'Enter Password' })),
            loginButton: first(role('button', { name: 'Login' })),
        }) };
    }

    // --- Utility Functions (Keep for page object internal use) ---

    // goto() and Login() are inherited from BasePage

    /** This helper must remain as it performs page context manipulation and returns a Page object. */
    async clickWhatsAppButtonAndGetNewPage() {
        const [newPage] = await Promise.all([
            this.page.context().waitForEvent('page'),
            this.loc.whatsAppButton.click(),
        ]);
        await newPage.waitForLoadState('domcontentloaded');
        return newPage; // Returns the Page object for the WhatsApp screen
    }

    // --- New Test-Specific Flow Functions (Actions Only) ---

    /** T1: Click Feeds icon and wait for header to be ready. */
    async navigateToFeeds() {
        await this.page.waitForTimeout(2000);
        await this.loc.feeds.click();
    }

    /** T2: Click "i" (help) icon and pause. */
    async clickHelpIcon() {
        await this.loc.helpIcon.click();
        await this.page.waitForTimeout(2000);
    }

    /** T3 & T4: Unfollow if visible, then Follow. */
    async prepareForFollowAndPerformFollow() {
        const isFeedVisible = await this.loc.firstFeeds.isVisible({ timeout: 5000 });

        // T3 - Setup: Attempt to unfollow if already followed (Idempotency)
        if (isFeedVisible) {
            if (await this.loc.dotsIcon.isVisible()) {
                await this.loc.dotsIcon.click();
                if (await this.loc.unfollowButton.isVisible()) {
                    await this.loc.unfollowButton.click();
                    await this.page.waitForTimeout(2000); // Wait for action
                }
            }
        }
        // State is now ready for T3 screenshot of the 'Follow' button state or initial view.
        // Return visibility flag for potential conditional screenshot in spec
        return { isFeedVisible };
    }

    async performFollowAction() {
        // T4 - Action: Click Follow button
        await this.loc.followButton.click();
        await this.page.waitForTimeout(1000); // Wait for count/state change
    }

    /** T6: Click dots and verify unfollow button presence. */
    async clickDotsAndShowUnfollow() {
        await this.loc.dotsIcon.waitFor({ state: 'visible' });
        await this.loc.dotsIcon.click();
        await this.loc.unfollowButton.waitFor({ state: 'visible' });
        await this.page.waitForTimeout(2000);
    }

    /** T7: Click comments button to open popup. */
    async openCommentsPopup() {
        await this.loc.comments.waitFor({ state: 'visible' });
        await this.loc.comments.click();
        await this.page.waitForTimeout(2000);
    }

    /** T8: Fill comment text box. */
    async fillCommentTextBox() {
        await this.loc.commentTextBox.fill('Home team will win the match');
    }

    /** T9: Submit comment. */
    async submitComment() {
        await this.loc.submitincomments.click();
        await this.page.waitForTimeout(2000);
    }

    /** T10: Remove comment. */
    async removePostedComment() {
        await this.loc.firstCommentDiv.waitFor({ state: 'visible', timeout: 10000 });
        await this.loc.firstCommentDiv.hover();
        await this.loc.helpInComments.waitFor({ state: 'visible', timeout: 10000 });
        await this.loc.helpInComments.click();
        await this.loc.removeComments.click();
        await this.page.waitForTimeout(2000);
    }

    /** T11-T13: Open comments, show report, and click like. */
    async setupCommentActions() {
        // T11: Open comments popup
        await this.loc.comments.waitFor({ state: 'visible' });
        await this.loc.comments.click();
        await this.page.waitForTimeout(2000);
    }

    async showReportButton() {
        // T12: Report button
        await this.loc.firstCommentDiv.waitFor({ state: 'visible', timeout: 10000 });
        await this.loc.firstCommentDiv.hover();
        await this.loc.helpInComments.waitFor({ state: 'visible', timeout: 10000 });
        await this.loc.helpInComments.click();
    }

    async performLikeAction() {
        // T13: Like button. Clicks the main like button, not the one in the menu.
        await this.loc.likebutton.click();
        await this.page.waitForTimeout(2000);
        await this.loc.closeComments.click(); // Cleanup
    }

    /** T14: Click share button to show popup. */
    async clickShareButton() {
        await this.loc.shareButton.waitFor({ state: 'visible' });
        await this.loc.shareButton.click();
        await this.page.waitForTimeout(1000);
    }

    /** T15: Clicks WhatsApp button and returns the new page for screenshot. */
    async clickWhatsAppAndReturnNewPage() {
        return this.clickWhatsAppButtonAndGetNewPage();
    }

    /** T17: Click profile and wait for counts. */
    async openProfileAndReadyForCounts() {
        await this.page.waitForTimeout(2000);
        await this.loc.feeds.click();
        await this.page.waitForTimeout(2000);

        // Confirmed live (TZ): a Betway account that has never created a Feeds profile shows a
        // "Create Profile" onboarding modal (profilenameInFeeds/handleInFeeds/createProfileinFeeds
        // below) instead of the profile's Post/Followers/Following counts block. That counts block
        // is a second `.feeds-header-container` element (loc.feedsHeader targets it at nth(1)) that
        // only renders once a profile exists — without one it never appears, which is what made the
        // T17 screenshot step (captureScreenshot('feedsHeader', ...) -> highlightElements ->
        // locator.evaluate) hang until the full 60s action timeout was hit. Bootstrapping a profile
        // here — using locators that were already declared for exactly this but never wired up to
        // any method — makes the flow work regardless of whether the logged-in account already has
        // a Feeds profile. Once created, re-opening the sidebar (above) renders the counts block
        // within ~1s (confirmed live), well inside the wait below.
        if (await this.loc.createProfileinFeeds.isVisible({ timeout: 5000 }).catch(() => false)) {
            await this.loc.profilenameInFeeds.fill('Auto Testing');
            await this.loc.handleInFeeds.fill(`autotesting${Date.now()}`);
            await this.loc.createProfileinFeeds.click();
            await this.page.waitForTimeout(3000);
        }
    }

    /** T18: Perform Like, Comment, and Share actions in Profile Popup. */
    async performProfileActions() {
        await this.loc.likebutton.click();

        // Comment flow
        await this.loc.commentsInPopup.click();
        await this.page.waitForTimeout(2000);
        // Screenshot T18a happens now
        await this.loc.closeComments.click();

        // Share flow
        await this.loc.shareButtonInPopup.click();
        await this.page.waitForTimeout(2000);
        // Screenshot T18b happens now
        await this.loc.closeComments.click();
    }

    /** T19: Close the Public Profile pop up window. */
    async closeProfilePopup() {
        await this.loc.closePopup.click();
        await this.page.waitForTimeout(2000);
    }

    /** T20: Search for a term. */
    async performFeedsSearch() {
        await this.loc.searchInFeeds.click();
        await this.loc.searchInFeeds.fill('Champions');
        await this.loc.searchInFeeds.press('Backspace');
        await this.page.waitForTimeout(4000);
    }

    /** T21: Perform search, follow, and clean up. */
    async performSearchFollowCleanup() {
        // Setup: Search for term
        await this.loc.searchInFeeds.click();
        await this.loc.searchInFeeds.fill('Champions');
        await this.loc.searchInFeeds.press('Backspace');
        await this.page.waitForTimeout(4000);
        await this.loc.searchInFeeds.press('Backspace');
        // T21a Ready state for follow
        await this.loc.suggestedFeedsFollow.click();
        await this.page.waitForTimeout(2000);
        // T21b Ready state for post-follow

        // Cleanup: Unfollow
        await this.loc.suggestedFeedsUnFollow.click();
    }

    /** T22: Perform search, ensure followed, unfollow, and clean up. */
    async performSearchUnfollowCleanup() {
        // Setup: Search for term
        await this.loc.searchInFeeds.click();
        await this.loc.searchInFeeds.fill('Champions');
        await this.loc.searchInFeeds.press('Backspace');
        await this.page.waitForTimeout(4000);
        await this.loc.searchInFeeds.press('Backspace');
        // Ensure it's followed before testing unfollow (idempotency)
        if (await this.loc.suggestedFeedsFollow.isVisible()) {
            await this.loc.suggestedFeedsFollow.click();
            await this.page.waitForTimeout(1000);
        }
    }
    async performSearchUnfollow() {
        // T22a Ready state for unfollow
        await this.loc.suggestedFeedsUnFollow.click();
        await this.page.waitForTimeout(2000);
        // T22b Ready state for post-unfollow
    }

    /** T23 & T24: Search, show suggestions, follow, and cleanup. */
    async performSearchShowSuggestionsAndFollow() {
        // T23: Search for term to show suggestions
        await this.loc.searchInFeeds.click();
        await this.loc.searchInFeeds.fill('Champions');
        await this.loc.searchInFeeds.press('Backspace');
        await this.page.waitForTimeout(4000);
        await this.loc.searchInFeeds.press('Backspace');
        // T23 Screenshot happens now.

        // T24: Follow action
        await this.loc.suggestedFeedsFollow.click();
        await this.page.waitForTimeout(2000);
        // T24 Screenshot happens now.

        // Cleanup: Unfollow
        await this.loc.suggestedFeedsUnFollow.click();
    }

    /** T25: Follow feeds from Home search bar. */
    async performHomeSearchFollow() {
        await this.loc.searchOnHome.click();
        await this.loc.searchOnHome.fill('NFL');
        await this.loc.searchOnHome.press('Enter');
        await this.page.waitForTimeout(4000);

        await this.loc.followInSearch.click();
        await this.page.waitForTimeout(2000);
    }

    async captureScreenshot(locatorName: string, screenshotDir: string, fileName: string, testInfo: any) {
        const locator = this.loc[locatorName];
        await highlightElements(locator);
        await ScreenshotHelper(this.page, screenshotDir, fileName, testInfo);
    }
    async takeScreenshot(screenshotDir: string, fileName: string, testInfo: any) {
        await ScreenshotHelper(this.page, screenshotDir, fileName, testInfo);
    }

    /** T5: Verify feed section presence. */
    async waitForFeedSectionPresence() {
        await this.page.waitForTimeout(4000);
        await expect(this.loc.feeds).toBeVisible();
    }
}
