import { AppConfig } from '@/config/app';
import { Env } from '@/lib/env';
import { routing } from '@/lib/i18n/routing';

/** Canonical origin, without a trailing slash. */
export function getBaseUrl(): string {
  if (Env.NEXT_PUBLIC_APP_URL) {
    return Env.NEXT_PUBLIC_APP_URL.replace(/\/$/u, '');
  }
  // Set automatically on Vercel deployments.
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
  }
  return 'http://localhost:3000';
}

/**
 * Prefixes a path with a locale, honouring the `as-needed` strategy where the
 * default locale is served without a prefix.
 */
export function getI18nPath(path: string, locale: string): string {
  if (locale === AppConfig.defaultLocale) {
    return path;
  }
  return `/${locale}${path}`;
}

/** `{ 'zh-TW': 'https://…/zh-TW/about' }` for a route's non-default locales. */
export function getAlternateLanguages(path: string): Record<string, string> {
  const baseUrl = getBaseUrl();
  return Object.fromEntries(
    routing.locales
      .filter((locale) => locale !== routing.defaultLocale)
      .map((locale) => [locale, `${baseUrl}${getI18nPath(path, locale)}`]),
  );
}
