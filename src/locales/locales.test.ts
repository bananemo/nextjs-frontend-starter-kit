import { describe, expect, it } from 'vitest';
import { routing } from '@/lib/i18n/routing';
import en from './en.json';
import zhTW from './zh-TW.json';

/**
 * `en.json` types every translation key (see `src/types/i18n.d.ts`), but that
 * augmentation says nothing about the other locales. This closes the gap: a key
 * added to `en.json` and forgotten elsewhere fails the test run rather than
 * rendering the raw key to a user.
 */

type MessageTree = { [key: string]: string | MessageTree };

/** Flattens a message tree to dotted paths, e.g. `Home.features.ui`. */
function flatten(tree: MessageTree, prefix = ''): string[] {
  return Object.entries(tree).flatMap(([key, value]) => {
    const path = prefix ? `${prefix}.${key}` : key;
    return typeof value === 'string' ? [path] : flatten(value, path);
  });
}

/** Collects the dotted paths whose value is blank. */
function emptyPaths(tree: MessageTree, prefix = ''): string[] {
  return Object.entries(tree).flatMap(([key, value]) => {
    const path = prefix ? `${prefix}.${key}` : key;
    if (typeof value !== 'string') {
      return emptyPaths(value, path);
    }
    return value.trim() === '' ? [path] : [];
  });
}

const LOCALE_MESSAGES: Record<string, MessageTree> = {
  en,
  'zh-TW': zhTW,
};

describe('locales', () => {
  const referenceKeys = flatten(en).toSorted();

  it('has a message file for every configured locale', () => {
    expect(Object.keys(LOCALE_MESSAGES).toSorted()).toStrictEqual([...routing.locales].toSorted());
  });

  it.each(routing.locales.filter((locale) => locale !== routing.defaultLocale))(
    'keeps %s in sync with the default locale',
    (locale) => {
      const keys = flatten(LOCALE_MESSAGES[locale] ?? {}).toSorted();

      expect(
        keys.filter((key) => !referenceKeys.includes(key)),
        'unexpected keys',
      ).toStrictEqual([]);
      expect(
        referenceKeys.filter((key) => !keys.includes(key)),
        'missing keys',
      ).toStrictEqual([]);
    },
  );

  it.each(Object.entries(LOCALE_MESSAGES))('has no blank translations in %s', (_locale, tree) => {
    expect(emptyPaths(tree)).toStrictEqual([]);
  });
});
