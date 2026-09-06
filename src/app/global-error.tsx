'use client';

import { useEffect } from 'react';
import { captureException } from '@/lib/observability';

/**
 * Last-resort error boundary, used when the root layout itself fails.
 *
 * It replaces the root layout, so it must render its own <html> and <body>.
 * Global styles do not reach it and the theme class is never applied, hence the
 * inline styles and the `color-scheme` hint so it follows the OS preference.
 *
 * Error boundaries are Client Components, so `metadata` cannot be exported
 * here — React's <title> is the supported alternative.
 */
export default function GlobalError({
  error,
  retry,
}: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  useEffect(() => {
    captureException(error, {
      level: 'fatal',
      tags: { boundary: 'global' },
      extra: { digest: error.digest },
    });
  }, [error]);

  return (
    <html lang="en">
      <body
        style={{
          colorScheme: 'light dark',
          fontFamily: 'system-ui, sans-serif',
          margin: 0,
          padding: '4rem 1.5rem',
        }}
      >
        <title>Something went wrong</title>
        <main style={{ margin: '0 auto', maxWidth: '40rem' }}>
          <h1 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Something went wrong</h1>
          <p style={{ marginBottom: '1.5rem', opacity: 0.7 }}>
            The application failed to load. The error has been reported.
          </p>
          <button
            onClick={() => {
              retry();
            }}
            style={{
              border: '1px solid currentColor',
              borderRadius: '0.375rem',
              background: 'transparent',
              color: 'inherit',
              cursor: 'pointer',
              padding: '0.5rem 1rem',
            }}
            type="button"
          >
            Try again
          </button>
        </main>
      </body>
    </html>
  );
}
