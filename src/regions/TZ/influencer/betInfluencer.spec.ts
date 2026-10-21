// Bet Influencer daily flow for TZ.
//   npx playwright test --config=playwright.influencer.config.ts --grep "daily"
// Deliberately outside src/regions/TZ/tests/ so playwright.TZ.config.ts (testDir = .../tests)
// never picks it up and the existing V2 smoke run is unaffected.
import path from 'path';
import { test } from '../../../common/fixtures/betInfluencerFixture';
import { runBetInfluencerDailySuite } from '../../../common/tests/betInfluencerPayoutSuite.shared';

const screenshotDir = path.join(path.resolve(__dirname, '../..'), 'screenshots/influencer/TZ');

runBetInfluencerDailySuite(test, screenshotDir);
