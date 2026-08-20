// npx playwright test src/regions/TZ/tests/smoke/buildABet/buildABet.spec.ts --config=playwright.TZ.config.ts --headed
import { test } from '../../../../../common/fixtures/betwayFixture';
import path from 'path';
import { runBuildABetSuite } from '../../../../../common/tests/buildABetSuite.shared';

const projectRoot = path.resolve(__dirname, '../../..');
const screenshotDir = path.join(projectRoot, 'screenshots/module/buildABet');

runBuildABetSuite(test, screenshotDir);
