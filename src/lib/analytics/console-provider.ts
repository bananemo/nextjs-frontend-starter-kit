import type { AnalyticsProvider } from './types';

const isDev = process.env.NODE_ENV === 'development';

/**
 * Default provider.
 *
 * Logs in development so you can see the event stream while building, and
 * no-ops in production so an unconfigured deployment stays silent rather than
 * filling the console. Swap it out with `setAnalyticsProvider`.
 */
export const consoleAnalyticsProvider: AnalyticsProvider = {
  track(event, properties) {
    if (isDev) {
      console.warn('[analytics] track', event, properties ?? {});
    }
  },

  identify(userId, traits) {
    if (isDev) {
      console.warn('[analytics] identify', userId, traits ?? {});
    }
  },

  page(url, properties) {
    if (isDev) {
      console.warn('[analytics] page', url, properties ?? {});
    }
  },

  reset() {
    if (isDev) {
      console.warn('[analytics] reset');
    }
  },
};
