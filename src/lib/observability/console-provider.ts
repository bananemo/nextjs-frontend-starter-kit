import type { ObservabilityProvider } from './types';

/**
 * Default provider: writes to the console.
 *
 * It exists so the layer is always wired and call sites never need a null
 * check. Swap it out with `setObservabilityProvider` — see the README.
 */
export const consoleObservabilityProvider: ObservabilityProvider = {
  captureException(error, context) {
    console.error('[observability] exception', error, context ?? '');
  },

  captureMessage(message, context) {
    const level = context?.level ?? 'info';
    const log = level === 'error' || level === 'fatal' ? console.error : console.warn;
    log(`[observability] ${level}: ${message}`, context ?? '');
  },

  setUser(user) {
    console.warn('[observability] setUser', user);
  },
};
