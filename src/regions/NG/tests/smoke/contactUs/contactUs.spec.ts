// npx playwright test src/regions/NG/tests/smoke/contactUs/contactUs.spec.ts --config=playwright.NG.config.ts --headed
import { test } from '../../../../../common/fixtures/betwayFixture';
import path from 'path';
import { runContactUsSuite } from '../../../../../common/tests/contactUsSuite.shared';

const projectRoot = path.resolve(__dirname, '../../..');
const screenshotDir = path.join(projectRoot, 'screenshots/module/contactUs');

runContactUsSuite(test, screenshotDir);
