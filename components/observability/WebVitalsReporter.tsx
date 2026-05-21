'use client';

import { useReportWebVitals } from 'next/web-vitals';
import { reportWebVitalToConsole } from '@/lib/observability/webVitals';

export function WebVitalsReporter() {
  useReportWebVitals(metric => {
    reportWebVitalToConsole({
      name: metric.name,
      value: metric.value,
      id: metric.id,
      rating: metric.rating,
      navigationType: metric.navigationType,
    });
  });

  return null;
}
