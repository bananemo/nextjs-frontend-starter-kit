import { defineConfig, devices } from '@playwright/test';

// Default away from 3000 so a running dev server doesn't collide with the tests.
const PORT = process.env.PORT ?? '3008';
const baseURL = `http://localhost:${PORT}`;

export default defineConfig({
  testDir: './tests',
  // Match `*.e2e.ts` / `*.integ.ts` so unit tests are never picked up here.
  testMatch: '*.@(integ|e2e).?(c|m)[jt]s?(x)',
  timeout: 30 * 1000,
  expect: { timeout: 15 * 1000 },
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? 'github' : 'list',

  webServer: {
    // Test against a production build in CI — it is what actually ships.
    command: process.env.CI ? 'pnpm start' : 'pnpm dev',
    url: baseURL,
    timeout: 120 * 1000,
    reuseExistingServer: !process.env.CI,
    gracefulShutdown: { signal: 'SIGTERM', timeout: 2000 },
    env: { PORT },
  },

  use: {
    baseURL,
    trace: process.env.CI ? 'on-first-retry' : 'retain-on-failure',
    video: process.env.CI ? 'retain-on-failure' : undefined,
  },

  /*
   * Chromium only. Adding Firefox roughly doubles the e2e run and needs extra
   * setup inside the CI container; add it back here if you need cross-browser
   * coverage:
   *   { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
   */
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
});
