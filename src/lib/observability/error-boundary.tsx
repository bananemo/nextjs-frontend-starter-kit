'use client';

import { catchError } from 'next/error';
import type { ErrorInfo } from 'next/error';
import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { captureException } from './index';

type ErrorBoundaryProps = {
  /** Heading shown in place of the failed subtree. */
  title?: string;
  /** Label for the recovery button. */
  retryLabel?: string;
};

function ErrorFallbackBody({
  error,
  retry,
  title,
  retryLabel,
}: {
  error: unknown;
  retry: () => void;
  title: string;
  retryLabel: string;
}) {
  useEffect(() => {
    captureException(error, { tags: { boundary: 'component' } });
  }, [error]);

  return (
    <div
      className="flex flex-col items-start gap-3 rounded-lg border border-destructive/30 bg-destructive/5 p-4"
      role="alert"
    >
      <p className="text-body-1 font-medium">{title}</p>
      <Button
        onClick={() => {
          retry();
        }}
        size="sm"
        variant="outline"
      >
        {retryLabel}
      </Button>
    </div>
  );
}

function Fallback(props: ErrorBoundaryProps, { error, retry }: ErrorInfo) {
  return (
    <ErrorFallbackBody
      error={error}
      retry={retry}
      retryLabel={props.retryLabel ?? 'Try again'}
      title={props.title ?? 'Something went wrong'}
    />
  );
}

/**
 * Component-level error boundary.
 *
 * Built on `catchError` rather than a hand-rolled class component because it is
 * framework-aware: `redirect()` and `notFound()` work by throwing, and
 * `catchError` lets those pass through instead of swallowing them. `retry()`
 * also re-renders inside a Transition, preserving state outside the boundary.
 *
 * Note the fallback signature — `(props, errorInfo)` as two positional
 * arguments, not a single props object.
 */
export const ErrorBoundary = catchError<ErrorBoundaryProps>(Fallback);
