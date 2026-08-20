// npx playwright test src/regions/NG/tests/smoke/hamburgerMenu/hamburgerMenu.spec.ts --config=playwright.NG.config.ts --headed
import { test } from '../../../../../common/fixtures/betwayFixture';
import path from 'path';
import { runHamburgerMenuSuite } from '../../../../../common/tests/hamburgerMenuSuite.shared';

const projectRoot = path.resolve(__dirname, '../../..');
const screenshotDir = path.join(projectRoot, 'screenshots/module/header');

runHamburgerMenuSuite(test, screenshotDir);
