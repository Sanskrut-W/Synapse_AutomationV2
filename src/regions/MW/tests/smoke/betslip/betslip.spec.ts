// npx playwright test src/regions/MW/tests/smoke/betslip/betslip.spec.ts --config=playwright.MW.config.ts --headed
import { test } from '../../../../../common/fixtures/betwayFixture';
import path from 'path';
import { runBetslipSuite } from '../../../../../common/tests/betslipSuite.shared';

const projectRoot = path.resolve(__dirname, '../../..');
const screenshotDir = path.join(projectRoot, 'screenshots/smoke/betslip');

runBetslipSuite(test, screenshotDir);
