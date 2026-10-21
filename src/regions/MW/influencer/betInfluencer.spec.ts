// Bet Influencer daily flow for MW.
//   npx playwright test --config=playwright.influencer.config.ts --grep "daily"
// Deliberately outside src/regions/MW/tests/ so playwright.MW.config.ts (testDir = .../tests)
// never picks it up and the existing V2 smoke run is unaffected.
import path from 'path';
import { test } from '../../../common/fixtures/betInfluencerFixture';
import { runBetInfluencerDailySuite } from '../../../common/tests/betInfluencerPayoutSuite.shared';

const screenshotDir = path.join(path.resolve(__dirname, '../..'), 'screenshots/influencer/MW');

runBetInfluencerDailySuite(test, screenshotDir);
