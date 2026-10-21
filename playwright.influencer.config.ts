import { defineConfig, devices } from '@playwright/test';
import path from 'path';

/**
 * Bet Influencer automation - a SEPARATE config from the eight playwright.<REGION>.config.ts
 * files, which are left untouched.
 *
 * Why separate rather than a project inside an existing config:
 *   - testDir points at src/regions/<REGION>/influencer, which sits OUTSIDE the .../tests tree
 *     the per-region configs scan, so a normal V2 smoke run never sees these specs and these
 *     runs never drag in the smoke suite.
 *   - The whole framework keys region-specific locator overrides off process.env.REGION
 *     (see src/common/locators/overrides.ts). One region per process is the only safe way to
 *     honour that, exactly as the existing per-region configs do.
 *
 * Usage:
 *   REGION=NG npx playwright test --config=playwright.influencer.config.ts
 */
const REGION = (process.env.REGION || 'ZA').toUpperCase();

// Same domains the per-region configs use. Kept here rather than imported so this file cannot
// affect the existing configs in any way.
const BASE_URLS: Record<string, string> = {
    ZA: 'https://www.betway.co.za',
    GH: 'https://www.betway.com.gh',
    BW: 'https://www.betway.co.bw',
    MW: 'https://www.betway.mw',
    MZ: 'https://en.betway.co.mz',
    NG: 'https://www.betway.com.ng',
    TZ: 'https://en.betway.co.tz',
    ZM: 'https://www.betway.co.zm',
};

const baseURL = BASE_URLS[REGION];
if (!baseURL) {
    throw new Error(`Unknown REGION "${REGION}". Expected one of: ${Object.keys(BASE_URLS).join(', ')}`);
}

// Read by src/common/locators/overrides.ts and src/common/config/oddsApiUrl.ts.
process.env.REGION = REGION;

export default defineConfig({
    testDir: `./src/regions/${REGION}/influencer`,

    // A booking code placed by Account A has to exist before Account B can redeem it, and the
    // Thursday check reads a ledger the daily run writes. Never run these in parallel.
    fullyParallel: false,
    workers: 1,

    // A placed bet is real money and a real payout record. A blind retry would place a second
    // bet and pollute the ledger, so failures are reported rather than retried.
    retries: 0,

    // Two logins, two bet placements and odds selection. Per-test budgets are set in the suite.
    timeout: 20 * 60 * 1000,

    forbidOnly: !!process.env.CI,

    reporter: [
        ['html', { outputFolder: `src/regions/${REGION}/reports/influencer-report`, open: 'never' }],
        ['list'],
        ['json', {
            outputFile: path.resolve(
                `src/regions/${REGION}/reports`,
                process.env.PLAYWRIGHT_JSON_OUTPUT_NAME || 'influencer-results.json'
            ),
        }],
    ],

    use: {
        baseURL,
        viewport: null,
        deviceScaleFactor: undefined,
        launchOptions: {
            args: ['--start-maximized', '--deny-permission-prompts'],
        },
        trace: 'retain-on-failure',
        screenshot: 'only-on-failure',
        actionTimeout: 60000,
        navigationTimeout: 60000,
    },

    projects: [
        {
            name: `${REGION} Bet Influencer`,
            use: {
                ...devices['Desktop Chrome'],
                viewport: null,
                deviceScaleFactor: undefined,
                launchOptions: {
                    args: ['--start-maximized', '--deny-permission-prompts'],
                },
            },
        },
    ],
});
