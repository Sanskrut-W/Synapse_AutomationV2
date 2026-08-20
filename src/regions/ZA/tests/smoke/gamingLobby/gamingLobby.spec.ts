// npx playwright test src/regions/ZA/tests/smoke/gamingLobby/gamingLobby.spec.ts --config=playwright.ZA.config.ts --headed
import { test } from '../../../../../common/fixtures/betwayFixture';
import path from 'path';
import { runGamingLobbySuite } from '../../../../../common/tests/gamingLobbySuite.shared';

const screenshotDir = path.join(path.resolve(__dirname, '../../..'), 'screenshots/module/gamingLobby');

runGamingLobbySuite(test, screenshotDir);
