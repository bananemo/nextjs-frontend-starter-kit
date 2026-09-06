import type { MetadataRoute } from 'next';
import { getAlternateLanguages, getBaseUrl } from '@/lib/seo/urls';

/**
 * Routes to publish, without a locale prefix.
 *
 * Kept as an explicit list: the App Router has no route manifest to enumerate,
 * and an explicit list means adding a page is a deliberate indexing decision.
 */
const ROUTES = ['', '/demo/form'];

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = getBaseUrl();
  const lastModified = new Date();

  return ROUTES.map((route) => ({
    url: `${baseUrl}${route === '' ? '/' : route}`,
    lastModified,
    changeFrequency: 'weekly',
    priority: route === '' ? 1 : 0.7,
    alternates: {
      languages: getAlternateLanguages(route === '' ? '/' : route),
    },
  }));
}
