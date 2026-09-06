import type { Metadata } from 'next';
import { AppConfig } from '@/config/app';
import { getAlternateLanguages, getBaseUrl, getI18nPath } from './urls';

type BuildMetadataOptions = {
  title?: string;
  description?: string;
  /** Route path without a locale prefix, e.g. `/about`. */
  path?: string;
  locale?: string;
  /** Absolute or root-relative OG image. Defaults to the route's own opengraph-image. */
  image?: string;
};

/**
 * Builds a `Metadata` object with canonical and alternate-language links.
 *
 * Two things worth remembering when extending this:
 *  - `title.template` applies to *child* segments, not the segment that sets it.
 *  - Metadata merges shallowly. A child that sets `openGraph` replaces the
 *    parent's entire `openGraph` object rather than merging into it.
 */
export function buildMetadata({
  title,
  description = AppConfig.description,
  path = '/',
  locale = AppConfig.defaultLocale,
  image,
}: BuildMetadataOptions = {}): Metadata {
  const baseUrl = getBaseUrl();
  const canonical = `${baseUrl}${getI18nPath(path, locale)}`;

  return {
    metadataBase: new URL(baseUrl),
    title: title ?? AppConfig.name,
    description,
    alternates: {
      canonical,
      languages: getAlternateLanguages(path),
    },
    openGraph: {
      type: 'website',
      siteName: AppConfig.name,
      title: title ?? AppConfig.name,
      description,
      url: canonical,
      locale,
      ...(image ? { images: [image] } : {}),
    },
    twitter: {
      card: 'summary_large_image',
      title: title ?? AppConfig.name,
      description,
      ...(image ? { images: [image] } : {}),
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-image-preview': 'large',
        'max-snippet': -1,
        'max-video-preview': -1,
      },
    },
  };
}
