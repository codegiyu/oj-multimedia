import { afterEach, describe, expect, it, vi } from 'vitest';
import { executeMusicDownload, getMusicDownloadStrategy } from './musicDownload';

vi.mock('@/lib/services/contentAnalytics', () => ({
  sendContentAnalyticsEvent: vi.fn(),
}));

describe('musicDownload (re-exports)', () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.restoreAllMocks();
  });

  it('does not allow card download without media URLs', () => {
    const strategy = getMusicDownloadStrategy({
      _id: 'track-x',
      title: 'Song',
      artistName: 'Artist',
      source: 'card',
    });

    expect(strategy.canDownload).toBe(false);
  });

  it('redirects using explicit downloadUrl', async () => {
    vi.stubEnv('NEXT_PUBLIC_BASE_URL', 'https://api.example.com');
    Object.defineProperty(window, 'location', {
      configurable: true,
      value: { href: '' },
    });

    const result = await executeMusicDownload({
      _id: 'track-dl',
      title: 'Song',
      artistName: 'Artist',
      downloadUrl: 'https://cdn.example.com/song.mp3',
      source: 'detail',
    });

    expect(result.started).toBe(true);
    expect(window.location.href).toContain('/public/music/track-dl/download');
  });
});
