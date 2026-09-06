import type { Organization, WebSite, WithContext } from 'schema-dts';
import { AppConfig } from '@/config/app';
import { getBaseUrl } from './urls';

/**
 * Structured data describing the site itself.
 *
 * This is the mechanism both traditional search engines and answer engines
 * (ChatGPT, Perplexity, Claude) use to read a page unambiguously, so it is
 * worth keeping accurate as real content lands.
 */

export function organizationSchema(): WithContext<Organization> {
  const baseUrl = getBaseUrl();
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: AppConfig.name,
    url: baseUrl,
    logo: `${baseUrl}/icon.svg`,
  };
}

export function websiteSchema(): WithContext<WebSite> {
  const baseUrl = getBaseUrl();
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: AppConfig.name,
    description: AppConfig.description,
    url: baseUrl,
    inLanguage: [...AppConfig.locales],
  };
}
