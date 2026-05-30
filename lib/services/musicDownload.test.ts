import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { executeMusicDownload, getMusicDownloadStrategy } from './musicDownload';

vi.mock('@/lib/services/contentAnalytics', () => ({
  sendContentAnalyticsEvent: vi.fn(),
}));

describe('musicDownload (re-exports)', () => {
  const clickSpy = vi.fn<() => void>();

  beforeEach(() => {
    clickSpy.mockClear();
    vi.spyOn(document.body, 'appendChild').mockImplementation(node => {
      if (node instanceof HTMLAnchorElement) {
        vi.spyOn(node, 'click').mockImplementation(clickSpy);
      }

      return node;
    });
    vi.spyOn(document.body, 'removeChild').mockImplementation(node => node);
  });

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

  it('uses download API for explicit downloadUrl', async () => {
    vi.stubEnv('NEXT_PUBLIC_BASE_URL', 'https://api.example.com');

    const result = await executeMusicDownload({
      _id: 'track-dl',
      title: 'Song',
      artistName: 'Artist',
      downloadUrl: 'https://cdn.example.com/song.mp3',
      source: 'detail',
    });

    expect(result.started).toBe(true);
    expect(clickSpy).toHaveBeenCalled();
  });

  it('uses download API when only audioUrl is set', async () => {
    const strategy = getMusicDownloadStrategy({
      _id: 'track-audio',
      title: 'Song',
      artistName: 'Artist',
      audioUrl: 'https://cdn.example.com/play.mp3',
      source: 'detail',
    });

    expect(strategy.useDownloadApi).toBe(true);
  });
});
