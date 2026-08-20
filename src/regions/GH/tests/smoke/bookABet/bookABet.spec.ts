// npx playwright test src/regions/GH/tests/smoke/bookABet/bookABet.spec.ts --config=playwright.GH.config.ts --headed
import { test } from '../../../../../common/fixtures/betwayFixture';
import path from 'path';
import { runBookABetSuite } from '../../../../../common/tests/bookABetSuite.shared';

const projectRoot = path.resolve(__dirname, '../../..');
const screenshotDir = path.join(projectRoot, 'screenshots/module/bookABet');

runBookABetSuite(test, screenshotDir);
