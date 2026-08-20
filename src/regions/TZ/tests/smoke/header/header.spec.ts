// npx playwright test src/regions/TZ/tests/smoke/header/header.spec.ts --config=playwright.TZ.config.ts --headed
import { test } from '../../../../../common/fixtures/betwayFixture';
import path from 'path';
import { runHeaderSuite } from '../../../../../common/tests/headerSuite.shared';

const projectRoot = path.resolve(__dirname, '../../..');
const screenshotDir = path.join(projectRoot, 'screenshots/module/header');

runHeaderSuite(test, screenshotDir);
