import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  deliverFileUrl,
  executeContentDownload,
  getContentDownloadStrategy,
  getMusicDownloadStrategy,
  isStaticOjDownloadHost,
  resolveEffectiveFileUrl,
  triggerDownloadViaApi,
} from './contentDownload';

vi.mock('@/lib/services/contentAnalytics', () => ({
  sendContentAnalyticsEvent: vi.fn(),
}));

import { sendContentAnalyticsEvent } from '@/lib/services/contentAnalytics';

describe('resolveEffectiveFileUrl', () => {
  it('prefers downloadUrl over audioUrl for music', () => {
    expect(
      resolveEffectiveFileUrl({
        kind: 'music',
        _id: '1',
        title: 'T',
        creatorName: 'A',
        downloadUrl: 'https://cdn.example.com/dl.mp3',
        mediaUrl: 'https://cdn.example.com/play.mp3',
      })
    ).toBe('https://cdn.example.com/dl.mp3');
  });

  it('falls back to audioUrl when downloadUrl is missing', () => {
    expect(
      resolveEffectiveFileUrl({
        kind: 'music',
        _id: '1',
        title: 'T',
        creatorName: 'A',
        mediaUrl: 'https://cdn.example.com/play.mp3',
      })
    ).toBe('https://cdn.example.com/play.mp3');
  });
});

describe('getContentDownloadStrategy', () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it('enables purchase flow for monetized music with price', () => {
    const strategy = getContentDownloadStrategy({
      kind: 'music',
      _id: 'track-1',
      title: 'Song',
      creatorName: 'Artist',
      isMonetizable: true,
      price: 500,
    });

    expect(strategy.requiresPurchase).toBe(true);
    expect(strategy.canDownload).toBe(true);
    expect(strategy.useDownloadApi).toBe(false);
  });

  it('uses download API when explicit downloadUrl is set', () => {
    vi.stubEnv('NEXT_PUBLIC_BASE_URL', 'https://api.example.com');

    const strategy = getContentDownloadStrategy({
      kind: 'music',
      _id: 'track-2',
      title: 'Song',
      creatorName: 'Artist',
      downloadUrl: 'https://cdn.example.com/song.mp3',
    });

    expect(strategy.useDownloadApi).toBe(true);
    expect(strategy.downloadApiUrl).toContain('/public/music/track-2/download');
  });

  it('uses download API for audioUrl when no downloadUrl is set', () => {
    const strategy = getContentDownloadStrategy({
      kind: 'music',
      _id: 'track-3',
      title: 'Song',
      creatorName: 'Artist',
      mediaUrl: 'https://cdn.example.com/play.mp3',
    });

    expect(strategy.useDownloadApi).toBe(true);
    expect(strategy.effectiveFileUrl).toBe('https://cdn.example.com/play.mp3');
  });

  it('uses download API for hosted video files', () => {
    vi.stubEnv('NEXT_PUBLIC_BASE_URL', 'https://api.example.com');

    const strategy = getContentDownloadStrategy({
      kind: 'video',
      _id: 'vid-1',
      title: 'Clip',
      creatorName: 'Creator',
      mediaUrl: 'https://cdn.example.com/video.mp4',
    });

    expect(strategy.useDownloadApi).toBe(true);
    expect(strategy.downloadApiUrl).toContain('/public/videos/vid-1/download');
  });

  it('legacy getMusicDownloadStrategy rejects card-only download without media', () => {
    const strategy = getMusicDownloadStrategy({
      _id: 'track-card',
      title: 'Song',
      artistName: 'Artist',
      source: 'card',
    });

    expect(strategy.canDownload).toBe(false);
  });
});

describe('executeContentDownload', () => {
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
    vi.stubGlobal('open', vi.fn());
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it('opens non-static URLs in a new tab via deliverFileUrl', () => {
    deliverFileUrl('https://r2.example.com/file.mp3', 'song.mp3');

    expect(window.open).toHaveBeenCalledWith(
      'https://r2.example.com/file.mp3',
      '_blank',
      'noopener,noreferrer'
    );
  });

  it('triggers download API via anchor click for music with downloadUrl', async () => {
    vi.stubEnv('NEXT_PUBLIC_BASE_URL', 'https://api.example.com');

    const result = await executeContentDownload({
      kind: 'music',
      _id: 'track-dl',
      title: 'Song',
      creatorName: 'Artist',
      downloadUrl: 'https://cdn.example.com/song.mp3',
    });

    expect(result.started).toBe(true);
    expect(clickSpy).toHaveBeenCalled();
    expect(sendContentAnalyticsEvent).not.toHaveBeenCalled();
  });

  it('triggerDownloadViaApi does not assign window.location', () => {
    vi.stubEnv('NEXT_PUBLIC_BASE_URL', 'https://api.example.com');
    triggerDownloadViaApi('https://api.example.com/api/v1/public/music/x/download');

    expect(clickSpy).toHaveBeenCalled();
  });
});

describe('isStaticOjDownloadHost', () => {
  it('detects static.ojmultimedia.com', () => {
    expect(isStaticOjDownloadHost('https://static.ojmultimedia.com/favicon.png')).toBe(true);
    expect(isStaticOjDownloadHost('https://cdn.example.com/file.mp3')).toBe(false);
  });
});
