// npx playwright test src/regions/TZ/tests/smoke/betSaver/betSaver.spec.ts --config=playwright.TZ.config.ts --headed
import { test } from '../../../../../common/fixtures/betwayFixture';
import path from 'path';
import { runBetSaverSuite } from '../../../../../common/tests/betSaverSuite.shared';

const projectRoot = path.resolve(__dirname, '../../..');
const screenshotDir = path.join(projectRoot, 'screenshots/module/betSaver');

runBetSaverSuite(test, screenshotDir);
