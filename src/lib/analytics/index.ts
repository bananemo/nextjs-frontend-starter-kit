import { consoleAnalyticsProvider } from './console-provider';
import type { AnalyticsProperties, AnalyticsProvider, AnalyticsTraits } from './types';

export type { AnalyticsProperties, AnalyticsProvider, AnalyticsTraits } from './types';

let provider: AnalyticsProvider = consoleAnalyticsProvider;

/**
 * Register the real analytics backend.
 *
 * Call this once, synchronously, from `src/instrumentation-client.ts`. Until
 * you do, events go to the console provider.
 */
export function setAnalyticsProvider(next: AnalyticsProvider): void {
  provider = next;
}

export function getAnalyticsProvider(): AnalyticsProvider {
  return provider;
}

/*
 * Call sites import only the functions below, so swapping providers never
 * requires touching application code.
 */

export function track(event: string, properties?: AnalyticsProperties): void {
  provider.track(event, properties);
}

export function identify(userId: string, traits?: AnalyticsTraits): void {
  provider.identify(userId, traits);
}

export function page(url: string, properties?: AnalyticsProperties): void {
  provider.page(url, properties);
}

export function reset(): void {
  provider.reset();
}
