export type SeverityLevel = 'debug' | 'info' | 'warning' | 'error' | 'fatal';

export type ObservabilityUser = {
  id: string;
  email?: string;
  username?: string;
} & Record<string, unknown>;

export type CaptureContext = {
  /** Free-form key/value pairs attached to the event. */
  tags?: Record<string, string>;
  /** Structured detail; providers usually render this as "extra" data. */
  extra?: Record<string, unknown>;
  level?: SeverityLevel;
};

/**
 * The contract every error-reporting backend implements.
 *
 * `captureException` takes `unknown` on purpose: Next.js hands error boundaries
 * an `unknown` (see `ErrorInfo` in `next/error`) and `onRequestError` does the
 * same, so anything narrower would be a lie at the call site.
 */
export type ObservabilityProvider = {
  captureException: (error: unknown, context?: CaptureContext) => void;
  captureMessage: (message: string, context?: CaptureContext) => void;
  setUser: (user: ObservabilityUser | null) => void;
};
