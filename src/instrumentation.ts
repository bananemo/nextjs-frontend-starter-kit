import type { Instrumentation } from 'next';
import { captureException } from '@/lib/observability';

/**
 * Server-side instrumentation.
 *
 * `register` runs once per server instance, before any request is handled, and
 * in every runtime — so anything runtime-specific must be imported lazily
 * inside the matching `NEXT_RUNTIME` branch rather than at module scope.
 */
export function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    // Register your Node.js observability provider here, e.g.
    //   const { setObservabilityProvider } = await import('@/lib/observability');
    //   setObservabilityProvider(sentryProvider);
  }
}

/**
 * Called for every error Next.js captures on the server.
 *
 * Typed via `Instrumentation.onRequestError` rather than by hand: the shipped
 * type has no `renderType` field and marks `renderSource` optional, so a
 * hand-written signature copied from the prose docs will not compile.
 */
export const onRequestError: Instrumentation.onRequestError = (error, request, context) => {
  captureException(error, {
    level: 'error',
    tags: {
      routerKind: context.routerKind,
      routeType: context.routeType,
      method: request.method,
    },
    extra: {
      path: request.path,
      routePath: context.routePath,
      revalidateReason: context.revalidateReason,
    },
  });
};
