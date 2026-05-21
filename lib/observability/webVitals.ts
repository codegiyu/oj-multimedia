export type WebVitalMetricName = 'CLS' | 'FCP' | 'FID' | 'INP' | 'LCP' | 'TTFB';

export type WebVitalPayload = {
  name: WebVitalMetricName | string;
  value: number;
  id: string;
  rating?: string;
  navigationType?: string;
};

export function isWebVitalsReportingEnabled(
  flag: string | undefined = process.env.NEXT_PUBLIC_ENABLE_WEB_VITALS
): boolean {
  return flag === '1';
}

export function formatWebVitalPayload(metric: WebVitalPayload): WebVitalPayload {
  return {
    name: metric.name,
    value: Math.round(metric.value * 100) / 100,
    id: metric.id,
    ...(metric.rating ? { rating: metric.rating } : {}),
    ...(metric.navigationType ? { navigationType: metric.navigationType } : {}),
  };
}

export function reportWebVitalToConsole(metric: WebVitalPayload): void {
  if (!isWebVitalsReportingEnabled()) {
    return;
  }

  console.info('[web-vitals]', formatWebVitalPayload(metric));
}
