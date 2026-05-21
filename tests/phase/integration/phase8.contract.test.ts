import { describe, expect, it } from 'vitest';
import {
  formatWebVitalPayload,
  isWebVitalsReportingEnabled,
} from '../../../lib/observability/webVitals';

describe('Phase 8 contract (observability & release readiness)', () => {
  it('gates web vitals reporting on NEXT_PUBLIC_ENABLE_WEB_VITALS', () => {
    expect(isWebVitalsReportingEnabled('1')).toBe(true);
    expect(isWebVitalsReportingEnabled()).toBe(false);
  });

  it('formats Core Web Vitals payloads for production logging', () => {
    expect(
      formatWebVitalPayload({
        name: 'INP',
        value: 180.123,
        id: 'metric-1',
        rating: 'good',
      }).value
    ).toBe(180.12);
  });
});
