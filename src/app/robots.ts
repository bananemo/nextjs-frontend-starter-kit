import type { MetadataRoute } from 'next';
import { getBaseUrl } from '@/lib/seo/urls';

/**
 * AI crawlers are allowed explicitly rather than left to the wildcard rule.
 * Answer-engine visibility depends on them being able to read the site, and
 * naming them makes the decision reviewable instead of accidental.
 */
const AI_CRAWLERS = [
  'GPTBot',
  'OAI-SearchBot',
  'ChatGPT-User',
  'ClaudeBot',
  'Claude-User',
  'PerplexityBot',
  'Google-Extended',
  'Applebot-Extended',
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: '*', allow: '/' },
      { userAgent: AI_CRAWLERS, allow: '/' },
    ],
    sitemap: `${getBaseUrl()}/sitemap.xml`,
  };
}
