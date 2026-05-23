import { afterEach, describe, expect, it, vi } from 'vitest';
import { getMusicDownloadStrategy } from './musicDownload';

describe('getMusicDownloadStrategy', () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it('uses tracked download for list cards with only _id', () => {
    vi.stubEnv('NEXT_PUBLIC_BASE_URL', 'https://api.example.com');

    const strategy = getMusicDownloadStrategy({
      _id: 'track-1',
      title: 'Song',
      artistName: 'Artist',
      source: 'card',
    });

    expect(strategy.useTrackedDownload).toBe(true);
    expect(strategy.canDownload).toBe(true);
    expect(strategy.trackedDownloadUrl).toContain('/public/music/track-1/download');
  });

  it('requires media URLs for detail items without card source', () => {
    const strategy = getMusicDownloadStrategy({
      _id: 'track-2',
      title: 'Song',
      artistName: 'Artist',
      source: 'detail',
    });

    expect(strategy.useTrackedDownload).toBe(false);
    expect(strategy.canDownload).toBe(false);
  });

  it('prefers tracked download when media URLs exist on detail items', () => {
    const strategy = getMusicDownloadStrategy({
      _id: 'track-3',
      title: 'Song',
      artistName: 'Artist',
      downloadUrl: 'https://cdn.example.com/song.mp3',
      source: 'detail',
    });

    expect(strategy.useTrackedDownload).toBe(true);
    expect(strategy.canDownload).toBe(true);
  });

  it('allows direct downloadUrl only when tracked path is unavailable', () => {
    const strategy = getMusicDownloadStrategy({
      _id: 'track-3b',
      title: 'Song',
      artistName: 'Artist',
      downloadUrl: 'https://cdn.example.com/song.mp3',
      isMonetizable: true,
      source: 'detail',
    });

    expect(strategy.useTrackedDownload).toBe(false);
    expect(strategy.canDownload).toBe(true);
  });

  it('disables tracked download for monetizable items', () => {
    const strategy = getMusicDownloadStrategy({
      _id: 'track-4',
      title: 'Song',
      artistName: 'Artist',
      audioUrl: 'https://cdn.example.com/song.mp3',
      isMonetizable: true,
      source: 'card',
    });

    expect(strategy.useTrackedDownload).toBe(false);
    expect(strategy.canDownload).toBe(false);
  });
});
