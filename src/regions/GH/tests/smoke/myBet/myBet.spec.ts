// npx playwright test src/regions/GH/tests/smoke/myBet/myBet.spec.ts --config=playwright.GH.config.ts --headed
import { test } from '../../../../../common/fixtures/betwayFixture';
import path from 'path';
import { runMyBetSuite } from '../../../../../common/tests/myBetSuite.shared';

const projectRoot = path.resolve(__dirname, '../../..');
const screenshotDir = path.join(projectRoot, 'screenshots/module/myBets');

runMyBetSuite(test, screenshotDir);
