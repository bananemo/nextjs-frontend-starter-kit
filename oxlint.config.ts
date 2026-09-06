import { defineConfig } from 'oxlint';
import core from 'ultracite/oxlint/core';
import next from 'ultracite/oxlint/next';
import react from 'ultracite/oxlint/react';
import tanstack from 'ultracite/oxlint/tanstack';
import vitest from 'ultracite/oxlint/vitest';

export default defineConfig({
  extends: [core, react, next, tanstack, vitest],
  /*
   * `src/components/ui` is vendored by the shadcn CLI and is overwritten by
   * `shadcn add`, so local style fixes there do not survive. Treat it as
   * generated code.
   */
  ignorePatterns: ['src/components/ui/**'],
  rules: {
    'no-warning-comments': 'off', // Allow TODO/FIXME comments
    'no-inline-comments': 'off',
    'sort-keys': 'off',
    'func-style': 'off',

    // Match the conventions carried over from greeni-frontend's biome.json.
    'typescript/consistent-type-definitions': ['error', 'type'],
    'typescript/no-misused-promises': 'off', // react-hook-form's handleSubmit returns a Promise-typed handler
    'typescript/strict-boolean-expressions': 'off',
    'typescript/strict-void-return': 'off',
    'typescript/no-unsafe-assignment': 'off',
    'typescript/no-unsafe-call': 'off',
    'typescript/no-unsafe-member-access': 'off',

    'react/function-component-definition': 'off', // Allow both declarations and arrow components
    'react/no-unstable-nested-components': 'off',

    'prefer-named-capture-group': 'off',
  },
  overrides: [
    {
      // Stories and scripts are allowed to log.
      files: ['**/*.stories.tsx', '**/*.stories.ts', 'scripts/**'],
      rules: {
        'no-console': 'off',
      },
    },
    {
      // The observability/analytics console providers exist to write to the console.
      files: ['src/lib/observability/console-provider.ts', 'src/lib/analytics/console-provider.ts'],
      rules: {
        'no-console': 'off',
      },
    },
  ],
});
