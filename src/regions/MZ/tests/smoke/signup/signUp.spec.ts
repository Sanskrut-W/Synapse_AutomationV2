// npx playwright test src/regions/MZ/tests/smoke/signup/signUp.spec.ts --config=playwright.MZ.config.ts --headed
import path from 'path';
import { test } from '../../../../../common/fixtures/betwayFixture';
import { runSignUpSuite } from '../../../../../common/tests/signUpSuite.shared';

const projectRoot = path.resolve(__dirname, '../../..');
const screenshotDir = path.join(projectRoot, 'screenshots/module/signUp');

runSignUpSuite(test, screenshotDir);
