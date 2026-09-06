import { storybookTest } from '@storybook/addon-vitest/vitest-plugin';
import { playwright } from '@vitest/browser-playwright';
import { defineConfig } from 'vitest/config';

/**
 * Runs every story as a test, in a real browser.
 *
 * Kept separate from the main `vitest.config.ts` so `pnpm test` stays fast and
 * story failures are reported as their own CI job.
 *
 * No setup file is needed: since Storybook 10.3 `@storybook/addon-vitest`
 * applies the preview annotations (decorators, parameters) automatically.
 */
export default defineConfig({
  plugins: [storybookTest()],
  test: {
    projects: [
      {
        extends: true,
        test: {
          name: 'storybook',
          browser: {
            enabled: true,
            headless: true,
            provider: playwright(),
            instances: [{ browser: 'chromium' }],
          },
        },
      },
    ],
  },
});
