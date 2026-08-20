// npx playwright test src/regions/TZ/tests/smoke/footer/footer.spec.ts --config=playwright.TZ.config.ts --headed
import { test } from '../../../../../common/fixtures/betwayFixture';
import path from 'path';
import { runFooterSuite } from '../../../../../common/tests/footerSuite.shared';

const projectRoot = path.resolve(__dirname, '../../..');
const screenshotDir = path.join(projectRoot, 'screenshots/module/footer');

runFooterSuite(test, screenshotDir);
