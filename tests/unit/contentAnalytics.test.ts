import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { ENDPOINTS } from '@/lib/constants/endpoints';

const requestMock = vi.fn().mockResolvedValue({ data: { success: true } });

vi.mock('@/lib/services/callApi', () => ({
  api: { request: (...args: unknown[]) => requestMock(...args) },
}));

describe('sendContentAnalyticsEvent', () => {
  beforeEach(() => {
    requestMock.mockClear();
    vi.stubGlobal('sessionStorage', {
      getItem: vi.fn(() => null),
      setItem: vi.fn(),
    });
    vi.stubGlobal('crypto', { randomUUID: () => 'test-session-id' });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.resetModules();
  });

  it('POSTs to the versioned analytics path from ENDPOINTS', async () => {
    const { sendContentAnalyticsEvent } = await import('@/lib/services/contentAnalytics');

    sendContentAnalyticsEvent('music', 'track-slug', 'view', { force: true });

    expect(requestMock).toHaveBeenCalledWith(
      expect.objectContaining({
        url: ENDPOINTS.PUBLIC_CONTENT_ANALYTICS_EVENT.path,
        method: 'POST',
        data: expect.objectContaining({
          entityType: 'music',
          entityIdOrSlug: 'track-slug',
          event: 'view',
        }),
      })
    );
    expect(ENDPOINTS.PUBLIC_CONTENT_ANALYTICS_EVENT.path).toBe(
      '/api/v1/public/analytics/content-event'
    );
  });
});
