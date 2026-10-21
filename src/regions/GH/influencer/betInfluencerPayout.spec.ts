// Bet Influencer Thursday payout verification for GH.
//   npx playwright test --config=playwright.influencer.config.ts --grep "payout"
// Skips itself on any day but Thursday unless FORCE_PAYOUT_CHECK=true.
import path from 'path';
import { test } from '../../../common/fixtures/betInfluencerFixture';
import { runBetInfluencerThursdaySuite } from '../../../common/tests/betInfluencerPayoutSuite.shared';

const screenshotDir = path.join(path.resolve(__dirname, '../..'), 'screenshots/influencer/GH');

runBetInfluencerThursdaySuite(test, screenshotDir);
