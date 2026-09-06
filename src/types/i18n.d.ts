import type { routing } from '@/lib/i18n/routing';
import type messages from '@/locales/en.json';

/**
 * Makes translation keys type-safe.
 *
 * Augmenting next-intl's `AppConfig` turns `t('Home.title')` into a checked
 * lookup: an unknown key, or one whose namespace does not match, becomes a
 * compile error rather than a string that silently renders as the key itself.
 *
 * `en.json` is the source of truth for the shape; `locales.test.ts` asserts the
 * other locales stay in sync with it.
 */
declare module 'next-intl' {
  // oxlint-disable-next-line typescript/consistent-type-definitions -- module
  // augmentation requires `interface`; a type alias cannot merge.
  type AppConfig = {
    Locale: (typeof routing.locales)[number];
    Messages: typeof messages;
  };
}
