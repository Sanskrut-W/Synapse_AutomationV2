// npx playwright test src/regions/MZ/tests/smoke/betInfluencer/betInfluencer.spec.ts --config=playwright.MZ.config.ts --headed
import { test } from '../../../../../common/fixtures/betwayFixture';
import path from 'path';
import { runBetInfluencerSuite } from '../../../../../common/tests/betInfluencerSuite.shared';

const projectRoot = path.resolve(__dirname, '../../..');
const screenshotDir = path.join(projectRoot, 'screenshots/module/betInfluencer');

runBetInfluencerSuite(test, screenshotDir);
