/**
 * Analytics provider template.
 *
 * This file is a starting point, not live code — nothing imports it and no
 * vendor SDK is installed. To wire up a real provider:
 *
 *   1. Copy this file to `src/lib/analytics/providers/<vendor>-provider.ts`.
 *   2. Install the vendor SDK and fill in the TODOs below.
 *   3. Add any required keys to the `client` block in `src/lib/env.ts`
 *      (`NEXT_PUBLIC_ANALYTICS_KEY` / `NEXT_PUBLIC_ANALYTICS_HOST` are stubbed
 *      in already) and to `.env.example`.
 *   4. Register it synchronously in `src/instrumentation-client.ts`:
 *
 *        import { setAnalyticsProvider } from '@/lib/analytics';
 *        import { vendorAnalyticsProvider } from '@/lib/analytics/providers/vendor-provider';
 *        setAnalyticsProvider(vendorAnalyticsProvider);
 *
 *   5. Drop this template's entry from the `ignore` list in `knip.config.ts`
 *      if you no longer need it.
 *
 * Application code calls `track` / `identify` / `page` / `reset` from
 * `@/lib/analytics` and never imports a provider directly, so none of it
 * changes when you swap vendors.
 *
 * Note: `page()` is already called for you on every client navigation from
 * `onRouterTransitionStart` in `src/instrumentation-client.ts`. If your vendor
 * captures page views automatically, make `page()` a no-op to avoid
 * double-counting.
 */

import type { AnalyticsProvider } from '../types';

export const customAnalyticsProvider: AnalyticsProvider = {
  track(_event, _properties) {
    // TODO: forward to the vendor SDK, e.g. sdk.capture(_event, _properties)
  },

  identify(_userId, _traits) {
    // TODO: e.g. sdk.identify(_userId, _traits)
  },

  page(_url, _properties) {
    // TODO: e.g. sdk.capture('$pageview', { $current_url: _url, ..._properties })
  },

  reset() {
    // TODO: clear the stored identity, e.g. sdk.reset()
  },
};
