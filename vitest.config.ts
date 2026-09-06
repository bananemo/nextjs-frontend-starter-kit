import react from '@vitejs/plugin-react';
import { playwright } from '@vitest/browser-playwright';
import { loadEnv } from 'vite';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [react()],
  resolve: {
    tsconfigPaths: true,
  },
  test: {
    coverage: {
      include: ['src/**/*'],
      exclude: ['src/**/*.stories.{js,jsx,ts,tsx}', 'src/components/ui/**'],
    },
    projects: [
      {
        // Plain modules — no DOM needed, so these stay fast.
        extends: true,
        test: {
          name: 'unit',
          include: ['src/**/*.test.{js,ts}'],
          environment: 'node',
        },
      },
      {
        /*
         * Components run in a real Chromium rather than jsdom, so layout,
         * focus and pointer behaviour match what users actually get.
         */
        extends: true,
        test: {
          name: 'ui',
          include: ['src/**/*.test.tsx'],
          browser: {
            enabled: true,
            headless: true,
            provider: playwright(),
            screenshotDirectory: 'vitest-test-results',
            instances: [{ browser: 'chromium' }],
          },
        },
      },
    ],
    reporters: ['default', ...(process.env.CI ? ['github-actions' as const] : [])],
    // Expose .env variables to the Node-side tests.
    env: loadEnv('', process.cwd(), ''),
  },
  define: {
    // ...and to the browser-side tests, which only see NEXT_PUBLIC_ vars.
    'process.env': JSON.stringify(loadEnv('', process.cwd(), 'NEXT_PUBLIC_')),
  },
});
