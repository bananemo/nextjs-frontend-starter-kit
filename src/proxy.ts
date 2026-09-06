import createMiddleware from 'next-intl/middleware';
import { routing } from '@/lib/i18n/routing';

/**
 * Locale negotiation and routing.
 *
 * In Next.js 16 the `middleware` file convention was renamed to `proxy`.
 * next-intl still publishes its handler from `next-intl/middleware`; only the
 * host file changed name. The `runtime` config option is not available here —
 * proxy always runs on Node.js.
 */
export default createMiddleware(routing);

export const config = {
  /*
   * Run on everything except:
   *  - `api`, `_next`, `_vercel`      framework and platform internals
   *  - extensionless metadata routes  opengraph-image, twitter-image, icon,
   *                                   apple-icon — at any depth, since under
   *                                   `[locale]` they resolve to
   *                                   `/en/opengraph-image` rather than
   *                                   `/opengraph-image`
   *  - any path containing a dot      favicon.ico, robots.txt, sitemap.xml,
   *                                   manifest.webmanifest, llms.txt, public/ assets
   *
   * Metadata routes must be excluded explicitly: without this the proxy
   * rewrites them to `/<locale>/sitemap.xml` and they 404.
   *
   * Note that without any matcher at all, proxy runs on every request,
   * including static files and everything in `public/`.
   */
  matcher:
    '/((?!api|_next|_vercel)(?!(?:.*/)?(?:opengraph-image|twitter-image|apple-icon|icon)(?:/|$))(?!.*\\..*).*)',
};
