import { hasLocale } from 'next-intl';
import { getRequestConfig } from 'next-intl/server';
import { notFound } from 'next/navigation';
import * as rootParams from 'next/root-params';
import { routing } from './routing';

/**
 * Resolves the active locale and loads its messages.
 *
 * Wired up through `createNextIntlPlugin` in `next.config.ts`.
 *
 * Reads the `[locale]` segment via `next/root-params` rather than the
 * deprecated `requestLocale`. Because the segment acts as a catch-all for
 * unknown top-level paths, an unrecognised value is a 404 rather than a
 * silent fallback to the default locale.
 */
export default getRequestConfig(async () => {
  const requested = await rootParams.locale();

  if (!hasLocale(routing.locales, requested)) {
    notFound();
  }

  const messages = await import(`../../locales/${requested}.json`);

  return {
    locale: requested,
    messages: messages.default,
  };
});
