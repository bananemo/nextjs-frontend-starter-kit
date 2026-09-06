import { consoleObservabilityProvider } from './console-provider';
import type { CaptureContext, ObservabilityProvider, ObservabilityUser } from './types';

export type {
  CaptureContext,
  ObservabilityProvider,
  ObservabilityUser,
  SeverityLevel,
} from './types';

let provider: ObservabilityProvider = consoleObservabilityProvider;

/**
 * Register the real error-reporting backend.
 *
 * Call this once, synchronously, from `src/instrumentation-client.ts` (browser)
 * or `src/instrumentation.ts` (server). Anything captured before registration
 * goes to the console provider.
 */
export function setObservabilityProvider(next: ObservabilityProvider): void {
  provider = next;
}

export function getObservabilityProvider(): ObservabilityProvider {
  return provider;
}

/*
 * Call sites import only the functions below. Swapping providers therefore
 * never requires touching application code.
 */

export function captureException(error: unknown, context?: CaptureContext): void {
  provider.captureException(error, context);
}

export function captureMessage(message: string, context?: CaptureContext): void {
  provider.captureMessage(message, context);
}

export function setUser(user: ObservabilityUser | null): void {
  provider.setUser(user);
}
