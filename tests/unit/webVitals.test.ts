import { describe, expect, it, vi } from 'vitest';
import {
  formatWebVitalPayload,
  isWebVitalsReportingEnabled,
  reportWebVitalToConsole,
} from '../../lib/observability/webVitals';

describe('webVitals', () => {
  it('is disabled unless NEXT_PUBLIC_ENABLE_WEB_VITALS=1', () => {
    expect(isWebVitalsReportingEnabled(undefined)).toBe(false);
    expect(isWebVitalsReportingEnabled('0')).toBe(false);
    expect(isWebVitalsReportingEnabled('1')).toBe(true);
  });

  it('formats metric values for structured logging', () => {
    expect(
      formatWebVitalPayload({
        name: 'LCP',
        value: 1234.567,
        id: 'v1',
        rating: 'good',
      })
    ).toEqual({
      name: 'LCP',
      value: 1234.57,
      id: 'v1',
      rating: 'good',
    });
  });

  it('does not log when reporting is disabled', () => {
    const info = vi.spyOn(console, 'info').mockImplementation(() => {});

    reportWebVitalToConsole({ name: 'INP', value: 120, id: 'v2' });

    expect(info).not.toHaveBeenCalled();
    info.mockRestore();
  });

  it('logs structured payload when reporting is enabled', () => {
    vi.stubEnv('NEXT_PUBLIC_ENABLE_WEB_VITALS', '1');
    const info = vi.spyOn(console, 'info').mockImplementation(() => {});

    reportWebVitalToConsole({ name: 'CLS', value: 0.04, id: 'v3', rating: 'good' });

    expect(info).toHaveBeenCalledWith('[web-vitals]', {
      name: 'CLS',
      value: 0.04,
      id: 'v3',
      rating: 'good',
    });
    info.mockRestore();
    vi.unstubAllEnvs();
  });
});
