// npx playwright test src/regions/ZM/tests/smoke/newHomePage/newHomePage.spec.ts --config=playwright.ZM.config.ts --headed
import { test } from '../../../../../common/fixtures/betwayFixture';
import path from 'path';
import { runNewHomePageSuite } from '../../../../../common/tests/newHomePageSuite.shared';

const projectRoot = path.resolve(__dirname, '../../..');
const screenshotDir = path.join(projectRoot, 'screenshots/smoke/newHomePage');

runNewHomePageSuite(test, screenshotDir);
