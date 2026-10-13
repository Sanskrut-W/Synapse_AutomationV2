// npx playwright test src/regions/MZ/tests/smoke/sportsGrid/sportsGrid.spec.ts --config=playwright.MZ.config.ts --headed
import { test } from '../../../../../common/fixtures/betwayFixture';
import path from 'path';
import { runSportsGridSuite } from '../../../../../common/tests/sportsGridSuite.shared';

const projectRoot = path.resolve(__dirname, '../../..');
const screenshotDir = path.join(projectRoot, 'screenshots/module/sportsGrid');

runSportsGridSuite(test, screenshotDir);
