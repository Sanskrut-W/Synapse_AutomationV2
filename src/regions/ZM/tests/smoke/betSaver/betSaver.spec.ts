// npx playwright test src/regions/ZM/tests/smoke/betSaver/betSaver.spec.ts --config=playwright.ZM.config.ts --headed
import { test } from '../../../../../common/fixtures/betwayFixture';
import path from 'path';
import { runBetSaverSuite } from '../../../../../common/tests/betSaverSuite.shared';

const projectRoot = path.resolve(__dirname, '../../..');
const screenshotDir = path.join(projectRoot, 'screenshots/module/betSaver');

runBetSaverSuite(test, screenshotDir);
