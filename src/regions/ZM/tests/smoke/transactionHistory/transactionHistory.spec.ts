// npx playwright test src/regions/ZM/tests/smoke/transactionHistory/transactionHistory.spec.ts --config=playwright.ZM.config.ts --headed
import { test } from '../../../../../common/fixtures/betwayFixture';
import path from 'path';
import { runTransactionHistorySuite } from '../../../../../common/tests/transactionHistorySuite.shared';

const projectRoot = path.resolve(__dirname, '../../..');
const screenshotDir = path.join(projectRoot, 'screenshots/module/transactionHistory');

runTransactionHistorySuite(test, screenshotDir);
