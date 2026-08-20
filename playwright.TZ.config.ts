import { defineConfig, devices } from '@playwright/test';
import path from 'path';

// Read by src/common/locators/overrides.ts (overridesForGroup) to select the active region's
// locator overrides, and reused by the Dashboard tool's `execution.env.REGION` on triggered runs.
process.env.REGION = process.env.REGION || 'TZ';

export default defineConfig({
  testDir: './src/regions/TZ/tests',

  fullyParallel: true,
  timeout: 90000,

  forbidOnly: !!process.env.CI,

  // Retry ONLY failed tests once — same as the old repo.
  retries: 1,

  workers: process.env.CI ? 7 : 7,

  reporter: [
    ['html', { outputFolder: 'playwright-report', open: 'never' }],
    ['list'],
    ['json', { outputFile: path.resolve('src/regions/TZ/reports', process.env.PLAYWRIGHT_JSON_OUTPUT_NAME || 'test-results.json') }],
    ['allure-playwright', { resultsDir: path.resolve('src/regions/TZ/reports/allure-results') }],
  ],

  use: {
    // Domain root — page objects pass their own path to BasePage.goto()
    baseURL: 'https://en.betway.co.tz',

    // Use real browser window size
    viewport: null,
    deviceScaleFactor: undefined,

    launchOptions: {
      args: ['--start-maximized'],
    },

    trace: 'on-first-retry',
    screenshot: 'only-on-failure',

    actionTimeout: 60000,
    navigationTimeout: 60000,
  },

  projects: [
    {
      name: 'TZ Region',
      use: {
        ...devices['Desktop Chrome'],
        viewport: null,
        deviceScaleFactor: undefined,
        launchOptions: {
          args: ['--start-maximized'],
        },
      },
    },
  ],
});
