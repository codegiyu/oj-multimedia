import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  deliverFileUrl,
  executeContentDownload,
  getContentDownloadStrategy,
  getMusicDownloadStrategy,
  isStaticOjDownloadHost,
} from './contentDownload';

vi.mock('@/lib/services/contentAnalytics', () => ({
  sendContentAnalyticsEvent: vi.fn(),
}));

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
    expect(strategy.useTrackedDownload).toBe(false);
  });

  it('uses tracked download only when explicit downloadUrl is set', () => {
    vi.stubEnv('NEXT_PUBLIC_BASE_URL', 'https://api.example.com');

    const strategy = getContentDownloadStrategy({
      kind: 'music',
      _id: 'track-2',
      title: 'Song',
      creatorName: 'Artist',
      downloadUrl: 'https://cdn.example.com/song.mp3',
    });

    expect(strategy.useTrackedDownload).toBe(true);
    expect(strategy.trackedDownloadUrl).toContain('/public/music/track-2/download');
  });

  it('allows direct audioUrl when no downloadUrl is set', () => {
    const strategy = getContentDownloadStrategy({
      kind: 'music',
      _id: 'track-3',
      title: 'Song',
      creatorName: 'Artist',
      mediaUrl: 'https://cdn.example.com/play.mp3',
    });

    expect(strategy.useTrackedDownload).toBe(false);
    expect(strategy.canDownload).toBe(true);
    expect(strategy.directUrl).toBe('https://cdn.example.com/play.mp3');
  });

  it('uses tracked video download when a hosted file exists', () => {
    vi.stubEnv('NEXT_PUBLIC_BASE_URL', 'https://api.example.com');

    const strategy = getContentDownloadStrategy({
      kind: 'video',
      _id: 'vid-1',
      title: 'Clip',
      creatorName: 'Creator',
      mediaUrl: 'https://cdn.example.com/video.mp4',
    });

    expect(strategy.useTrackedDownload).toBe(true);
    expect(strategy.trackedDownloadUrl).toContain('/public/videos/vid-1/download');
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
  beforeEach(() => {
    vi.stubGlobal('open', vi.fn());
    Object.defineProperty(window, 'location', {
      configurable: true,
      value: { href: '' },
    });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it('opens non-static URLs in a new tab', () => {
    deliverFileUrl('https://r2.example.com/file.mp3', 'song.mp3');

    expect(window.open).toHaveBeenCalledWith(
      'https://r2.example.com/file.mp3',
      '_blank',
      'noopener,noreferrer'
    );
  });

  it('redirects to tracked music download when downloadUrl is set', async () => {
    vi.stubEnv('NEXT_PUBLIC_BASE_URL', 'https://api.example.com');

    const result = await executeContentDownload({
      kind: 'music',
      _id: 'track-dl',
      title: 'Song',
      creatorName: 'Artist',
      downloadUrl: 'https://cdn.example.com/song.mp3',
    });

    expect(result.started).toBe(true);
    expect(window.location.href).toContain('/public/music/track-dl/download');
  });
});

describe('isStaticOjDownloadHost', () => {
  it('detects static.ojmultimedia.com', () => {
    expect(isStaticOjDownloadHost('https://static.ojmultimedia.com/favicon.png')).toBe(true);
    expect(isStaticOjDownloadHost('https://cdn.example.com/file.mp3')).toBe(false);
  });
});
