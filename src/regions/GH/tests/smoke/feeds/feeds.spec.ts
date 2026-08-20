// npx playwright test src/regions/GH/tests/smoke/feeds/feeds.spec.ts --config=playwright.GH.config.ts --headed
import { test } from '../../../../../common/fixtures/betwayFixture';
import path from 'path';
import { runFeedsSuite } from '../../../../../common/tests/feedsSuite.shared';

const projectRoot = path.resolve(__dirname, '../../..');
const screenshotDir = path.join(projectRoot, 'screenshots/module/feeds');

runFeedsSuite(test, screenshotDir);
