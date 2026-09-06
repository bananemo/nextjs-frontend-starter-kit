import type { RouterTransitionStartEvent, RouterTransitionType } from 'next';
import { page } from '@/lib/analytics';
import { captureException } from '@/lib/observability';

/**
 * Client-side instrumentation.
 *
 * This module runs after the HTML document loads but *before* React hydration,
 * which makes it the right place to install error tracking and analytics.
 *
 * Only synchronous, top-level code is guaranteed to finish before hydration.
 * Asynchronous work started here — a dynamic `import()`, a promise, top-level
 * `await` — is fire-and-forget and may resolve after hydration has begun. If a
 * provider must be live before the first render, import it statically and
 * register it synchronously below.
 *
 * Keep this file cheap: Next.js warns in development when initialisation takes
 * longer than 16ms.
 */

// Register your real providers here, e.g.
//   setObservabilityProvider(sentryProvider);
//   setAnalyticsProvider(myAnalyticsProvider);
// Both default to console implementations until you do.

/*
 * Error boundaries only catch errors thrown during render. Errors from event
 * handlers, `setTimeout` callbacks and rejected promises never reach them, so
 * listen for those directly. Registered synchronously to cover early failures.
 */
if (typeof window !== 'undefined') {
  window.addEventListener('error', (event) => {
    captureException(event.error ?? event.message, {
      level: 'error',
      tags: { source: 'window.onerror' },
    });
  });

  window.addEventListener('unhandledrejection', (event) => {
    captureException(event.reason, {
      level: 'error',
      tags: { source: 'unhandledrejection' },
    });
  });
}

/**
 * Fires at the start of every client-side navigation — the sanctioned hook for
 * page-view tracking.
 *
 * The third argument is typed `RouterTransitionStartEvent | null`: it is null
 * for programmatic `router.push()` and browser back/forward, so guard it.
 */
export function onRouterTransitionStart(
  url: string,
  navigationType: RouterTransitionType,
  event: RouterTransitionStartEvent | null,
) {
  page(url, {
    navigationType,
    prefetchIntent: event?.prefetchIntent ?? null,
  });
}
