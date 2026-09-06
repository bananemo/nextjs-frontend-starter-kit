import type { KnipConfig } from 'knip';

const config: KnipConfig = {
  entry: [
    /*
     * Referenced by string from `next.config.ts` via `createNextIntlPlugin`,
     * so it is not statically resolvable.
     */
    'src/lib/i18n/request.ts',

    /*
     * The starter kit's public API. These exist to be imported by whoever
     * builds on the template, so their exports are unreferenced here by
     * design rather than dead.
     */
    'src/lib/analytics/index.ts',
    'src/lib/observability/index.ts',
    'src/lib/observability/error-boundary.tsx',
    'src/lib/i18n/navigation.ts',
    'src/lib/seo/json-ld.tsx',
    'src/config/app.ts',
    'src/components/forms/fields/*.tsx',
    'src/components/forms/common/*.ts',
  ],

  ignore: [
    // Vendored by the shadcn CLI and overwritten by `shadcn add`.
    'src/components/ui/**',
    // Copy-and-fill skeleton for consumers; intentionally unreferenced.
    'src/lib/analytics/providers/custom-provider.template.ts',
  ],

  // Match the custom Playwright test suffixes used in `playwright.config.ts`.
  playwright: {
    entry: ['tests/**/*.@(integ|e2e).ts'],
  },

  compilers: {
    css: (text: string) => [...text.matchAll(/(?<=@)import[^;]+/gu)].join('\n'),
  },

  treatConfigHintsAsErrors: true,
};

export default config;
