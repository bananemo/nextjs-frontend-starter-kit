import { createEnv } from '@t3-oss/env-nextjs';
import * as z from 'zod';

/**
 * Build-time validated environment variables.
 *
 * Imported from `next.config.ts` so a missing or malformed variable fails the
 * build instead of surfacing as `undefined` at runtime.
 *
 * Every key must be destructured explicitly in `runtimeEnv`: Next.js inlines
 * `process.env.NEXT_PUBLIC_*` by literal textual substitution, so dynamic
 * access (`process.env[name]`) is never replaced and would read as undefined
 * in the browser.
 */
export const Env = createEnv({
  server: {},

  client: {
    /** Canonical origin, used for metadataBase, sitemap and robots. */
    NEXT_PUBLIC_APP_URL: z.url().optional(),

    /**
     * Analytics is provider-agnostic by design — see `src/lib/analytics`.
     * Add the keys your chosen provider needs here; nothing is wired by default.
     */
    NEXT_PUBLIC_ANALYTICS_KEY: z.string().optional(),
    NEXT_PUBLIC_ANALYTICS_HOST: z.url().optional(),

    /** Observability is likewise provider-agnostic — see `src/lib/observability`. */
    NEXT_PUBLIC_SENTRY_DSN: z.string().optional(),
    NEXT_PUBLIC_SENTRY_DISABLED: z.string().optional(),
  },

  shared: {
    NODE_ENV: z.enum(['test', 'development', 'production']).optional(),
  },

  runtimeEnv: {
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
    NEXT_PUBLIC_ANALYTICS_KEY: process.env.NEXT_PUBLIC_ANALYTICS_KEY,
    NEXT_PUBLIC_ANALYTICS_HOST: process.env.NEXT_PUBLIC_ANALYTICS_HOST,
    NEXT_PUBLIC_SENTRY_DSN: process.env.NEXT_PUBLIC_SENTRY_DSN,
    NEXT_PUBLIC_SENTRY_DISABLED: process.env.NEXT_PUBLIC_SENTRY_DISABLED,
    NODE_ENV: process.env.NODE_ENV,
  },

  emptyStringAsUndefined: true,
  skipValidation: Boolean(process.env.CI) || process.env.npm_lifecycle_event === 'lint',
});
