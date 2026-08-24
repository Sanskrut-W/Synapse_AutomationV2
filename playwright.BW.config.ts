import { defineConfig, devices } from '@playwright/test';
import path from 'path';

// Read by src/common/locators/overrides.ts (overridesForGroup) to select the active region's
// locator overrides, and reused by the Dashboard tool's `execution.env.REGION` on triggered runs.
process.env.REGION = process.env.REGION || 'BW';

export default defineConfig({
  testDir: './src/regions/BW/tests',

  fullyParallel: true,
  timeout: 90000,

  forbidOnly: !!process.env.CI,

  // Retry ONLY failed tests once — same as the old repo.
  retries: 1,

  workers: process.env.CI ? 7 : 7,

  reporter: [
    ['html', { outputFolder: 'playwright-report', open: 'never' }],
    ['list'],
    ['json', { outputFile: path.resolve('src/regions/BW/reports', process.env.PLAYWRIGHT_JSON_OUTPUT_NAME || 'test-results.json') }],
    ['allure-playwright', { resultsDir: path.resolve('src/regions/BW/reports/allure-results') }],
  ],

  use: {
    // Domain root — page objects pass their own path to BasePage.goto()
    baseURL: 'https://www.betway.co.bw',

    // Use real browser window size
    viewport: null,
    deviceScaleFactor: undefined,

    launchOptions: {
      // Chromium's native permission prompts (e.g. sites repeatedly asking to "access other apps
      // and services on this device") sit above the page and can't be dismissed via page.locator()
      // — auto-deny them at launch so they never block a headed run or intercept a screenshot.
      args: ['--start-maximized', '--deny-permission-prompts'],
    },

    trace: 'on-first-retry',
    screenshot: 'only-on-failure',

    actionTimeout: 60000,
    navigationTimeout: 60000,
  },

  projects: [
    {
      name: 'BW Region',
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
