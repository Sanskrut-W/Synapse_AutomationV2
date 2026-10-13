// npx playwright test src/regions/MW/tests/smoke/gamingLobby/gamingLobby.spec.ts --config=playwright.MW.config.ts --headed
import { test } from '../../../../../common/fixtures/betwayFixture';
import path from 'path';
import { runGamingLobbySuite } from '../../../../../common/tests/gamingLobbySuite.shared';

const projectRoot = path.resolve(__dirname, '../../..');
const screenshotDir = path.join(projectRoot, 'screenshots/module/gamingLobby');

runGamingLobbySuite(test, screenshotDir);
