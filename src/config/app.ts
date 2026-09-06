import type { LocalePrefixMode } from 'next-intl/routing';

/** Locale prefix strategy: the default locale is served without a prefix. */
const localePrefix: LocalePrefixMode = 'as-needed';

/**
 * Centralised application configuration.
 *
 * Customise this for your product — it feeds i18n routing, metadata, the
 * sitemap and the web manifest.
 */
export const AppConfig = {
  name: 'Next.js Frontend Starter Kit',
  description: 'A frontend-only Next.js starter with swappable observability and analytics layers.',
  locales: ['en', 'zh-TW'],
  defaultLocale: 'en',
  localePrefix,
} as const;

export type Locale = (typeof AppConfig.locales)[number];
