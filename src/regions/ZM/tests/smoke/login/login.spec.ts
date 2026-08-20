// npx playwright test src/regions/ZM/tests/smoke/login/login.spec.ts --config=playwright.ZM.config.ts --headed
import { test } from '../../../../../common/fixtures/betwayFixture';
import path from 'path';
import { runLoginSuite } from '../../../../../common/tests/loginSuite.shared';

const projectRoot = path.resolve(__dirname, '../../..');
const screenshotDir = path.join(projectRoot, 'screenshots/module/login');

runLoginSuite(test, screenshotDir);
