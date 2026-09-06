'use client';

import { useReportWebVitals } from 'next/web-vitals';
import { track } from './index';

type ReportWebVitalsCallback = Parameters<typeof useReportWebVitals>[0];

/*
 * Defined at module scope on purpose. `useReportWebVitals` replays every metric
 * collected so far whenever it receives a new function identity, so an inline
 * arrow would double-report on each render.
 *
 * `Metric` is not re-exported publicly, hence the Parameters<> indirection.
 */
const reportWebVitals: ReportWebVitalsCallback = (metric) => {
  track('web_vitals', {
    name: metric.name,
    // CLS is a unitless ratio; scale it so every metric reports as an integer.
    value: Math.round(metric.name === 'CLS' ? Number(metric.value) * 1000 : Number(metric.value)),
    rating: metric.rating,
    navigationType: metric.navigationType,
    id: metric.id,
  });
};

/**
 * Reports Core Web Vitals through the analytics layer.
 *
 * Rendered from the root layout. Kept as its own client component so the
 * `'use client'` boundary stays as small as possible.
 */
export function WebVitals() {
  useReportWebVitals(reportWebVitals);
  return null;
}
