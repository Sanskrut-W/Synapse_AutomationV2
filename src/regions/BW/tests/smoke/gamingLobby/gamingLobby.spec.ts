// npx playwright test src/regions/BW/tests/smoke/gamingLobby/gamingLobby.spec.ts --config=playwright.BW.config.ts --headed
import { test } from '../../../../../common/fixtures/betwayFixture';
import path from 'path';
import { runGamingLobbySuite } from '../../../../../common/tests/gamingLobbySuite.shared';

const screenshotDir = path.join(path.resolve(__dirname, '../../..'), 'screenshots/module/gamingLobby');

runGamingLobbySuite(test, screenshotDir);
