import type { test as BetwayTest } from '../fixtures/betwayFixture';
import { ScreenshotHelper } from '../flows/ScreenshotHelper';
import { activeRegion } from '../config/oddsApiUrl';

// New module: ContactUsPage already existed with a full set of verification methods but had ZERO
// test coverage across all 8 regions — no *Suite.shared.ts file ever referenced it, and the
// fixture only instantiates it lazily. Confirmed live on GH's real /contact-us page: there's no
// contact FORM anymore (no email/mobile/query inputs, no Submit button — same "feature redesigned
// away" pattern already seen with Feeds), but the live-chat entry point, Standard Rate Call
// number, and X/Facebook social links are all real and present today. Tests below cover only what
// was confirmed live; the pre-existing form-related methods on ContactUsPage are left untouched.
export function runContactUsSuite(test: typeof BetwayTest, screenshotDir: string) {
    test.describe('Contact Us Page Tests', () => {
        test('T1-Verify Contact Us page has a working live-chat entry point', async ({ contactUs, page }, testInfo) => {
            await contactUs.verifyChatToLiveSupport();
            await ScreenshotHelper(page, screenshotDir, 'T1-contactUs-chat', testInfo);
        });

        test('T2-Verify Standard Rate Call section shows a real phone number', async ({ contactUs, page }, testInfo) => {
            await contactUs.verifyCall();
            await contactUs.verifyCallPhoneNumber();
            await ScreenshotHelper(page, screenshotDir, 'T2-contactUs-call', testInfo);
        });

        test('T3a-Verify the X social link is present on the Contact Us page', async ({ contactUs, page }, testInfo) => {
            await contactUs.verifySocialXLink();
            await ScreenshotHelper(page, screenshotDir, 'T3a-contactUs-x', testInfo);
        });

        // Confirmed live: MW's real Contact Us page has no Facebook link at all (Instagram + X
        // only) — not a stale locator, a genuine per-region difference.
        test('T3b-Verify the Facebook social link is present on the Contact Us page', async ({ contactUs, page }, testInfo) => {
            test.skip(activeRegion() === 'MW', 'MW has no Facebook link on its Contact Us page (Instagram + X only).');
            await contactUs.verifySocialFacebookLink();
            await ScreenshotHelper(page, screenshotDir, 'T3b-contactUs-facebook', testInfo);
        });

        // Confirmed live only for GH so far ("@Betway_GH") — other regions likely follow the same
        // "@Betway_<code>" pattern but that's unverified, so this stays GH-only rather than
        // guessing it into the region-agnostic social-link check above.
        test('T4-Verify the X handle shown is GH\'s real account (@Betway_GH)', async ({ contactUs, page }, testInfo) => {
            test.skip(activeRegion() !== 'GH', 'X handle text confirmed live only for GH so far — see comment above.');
            await page.getByText('@Betway_GH').first().waitFor({ state: 'visible', timeout: 15000 });
            await ScreenshotHelper(page, screenshotDir, 'T4-contactUs-xhandle-GH', testInfo);
        });
    });
}
