import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  formatClientError,
  isClientErrorReportingEnabled,
  reportClientError,
} from '../../lib/observability/clientErrorReporting';

describe('clientErrorReporting', () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.restoreAllMocks();
  });

  it('detects when Sentry DSN reporting is enabled', () => {
    expect(isClientErrorReportingEnabled(undefined)).toBe(false);
    expect(isClientErrorReportingEnabled('https://example@o0.ingest.sentry.io/0')).toBe(true);
  });

  it('formats Error instances for structured reporting', () => {
    expect(formatClientError(new Error('boom'))).toEqual({
      message: 'boom',
      name: 'Error',
    });
  });

  it('logs reportable payload when DSN is configured', async () => {
    vi.stubEnv('NEXT_PUBLIC_SENTRY_DSN', 'https://example@o0.ingest.sentry.io/0');
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    await reportClientError(new Error('failed'), { route: '/music' });

    expect(errorSpy).toHaveBeenCalledWith('[client-error:reportable]', {
      message: 'failed',
      name: 'Error',
      route: '/music',
    });
  });
});
