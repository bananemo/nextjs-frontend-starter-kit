// Validate environment variables at build time rather than failing silently at
// runtime. Must stay first — it throws before any other config is evaluated.
import './src/lib/env';
import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const isDev = process.env.NODE_ENV === 'development';

/**
 * Content Security Policy.
 *
 * This is the static-friendly form: headers only, no nonce. A nonce-based CSP
 * has to be generated per request in `proxy.ts`, which forces every page to be
 * dynamically rendered and is incompatible with Partial Prerendering. If you
 * need a strict CSP more than you need static rendering, see the upgrade path
 * documented in the README.
 *
 * `unsafe-eval` is only required in development, where React uses `eval`.
 */
const csp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ''}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' blob: data:",
  "font-src 'self' data:",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  'upgrade-insecure-requests',
].join('; ');

const baseConfig: NextConfig = {
  /*
   * Vercel is the default target and needs no `output` setting. `standalone`
   * emits a self-contained server bundle for the Dockerfile, and is opt-in so
   * the default build layout is unchanged. See the README.
   */
  output: process.env.DOCKER_BUILD ? 'standalone' : undefined,
  reactStrictMode: true,
  poweredByHeader: false,
  // Stable in v16 — types `href` on next/link and the next/navigation methods.
  typedRoutes: true,
  devIndicators: {
    position: 'bottom-right',
  },
  headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'Content-Security-Policy', value: csp },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-DNS-Prefetch-Control', value: 'on' },
          { key: 'Referrer-Policy', value: 'origin-when-cross-origin' },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(), browsing-topics=()',
          },
        ],
      },
    ];
  },
};

const withNextIntl = createNextIntlPlugin('./src/lib/i18n/request.ts');

export default withNextIntl(baseConfig);
