export type AnalyticsProperties = Record<string, unknown>;

export type AnalyticsTraits = {
  email?: string;
  name?: string;
} & AnalyticsProperties;

/**
 * The contract every analytics backend implements.
 *
 * Deliberately the smallest set that covers the common vendors (PostHog,
 * Segment, Amplitude, GA, Vercel Analytics), so adapters stay thin.
 */
export type AnalyticsProvider = {
  /** A discrete user action. */
  track: (event: string, properties?: AnalyticsProperties) => void;
  /** Associate subsequent events with a known user. */
  identify: (userId: string, traits?: AnalyticsTraits) => void;
  /** A page view. Called automatically on navigation — see instrumentation-client.ts. */
  page: (url: string, properties?: AnalyticsProperties) => void;
  /** Clear the current identity, e.g. on sign-out. */
  reset: () => void;
};
