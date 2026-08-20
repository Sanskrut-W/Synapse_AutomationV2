// npx playwright test src/regions/NG/tests/smoke/feeds/feeds.spec.ts --config=playwright.NG.config.ts --headed
import { test } from '../../../../../common/fixtures/betwayFixture';
import path from 'path';
import { runFeedsSuite } from '../../../../../common/tests/feedsSuite.shared';

const projectRoot = path.resolve(__dirname, '../../..');
const screenshotDir = path.join(projectRoot, 'screenshots/module/feeds');

runFeedsSuite(test, screenshotDir);
