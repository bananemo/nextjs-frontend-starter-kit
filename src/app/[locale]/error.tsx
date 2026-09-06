'use client';

import { useTranslations } from 'next-intl';
import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { captureException } from '@/lib/observability';

/**
 * Segment-level error boundary.
 *
 * In Next.js 16 the recovery prop is `retry`, not `reset`: `retry()` re-fetches
 * and re-renders the boundary's children, whereas `reset()` only clears the
 * error state without re-fetching.
 */
export default function Error({
  error,
  retry,
}: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  const t = useTranslations('Error');

  useEffect(() => {
    captureException(error, {
      level: 'error',
      tags: { boundary: 'segment' },
      // Server errors arrive with a generic message; the digest is the only
      // way to correlate them with the server-side log entry.
      extra: { digest: error.digest },
    });
  }, [error]);

  return (
    <div className="mx-auto flex max-w-3xl flex-col items-start gap-4 px-6 py-16" role="alert">
      <h1 className="text-heading-2">{t('title')}</h1>
      <p className="text-body-1 text-muted-foreground">{t('description')}</p>
      <Button
        onClick={() => {
          retry();
        }}
        variant="outline"
      >
        {t('retry')}
      </Button>
    </div>
  );
}
