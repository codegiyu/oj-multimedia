import { afterEach, describe, expect, it, vi } from 'vitest';
import { API_V1_PREFIX } from './types';
import { getPublicMusicDownloadUrl, getPublicVideoDownloadUrl } from './post';

describe('public download URL helpers', () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it('builds versioned music download URLs', () => {
    vi.stubEnv('NEXT_PUBLIC_BASE_URL', 'https://api.example.com/');

    expect(getPublicMusicDownloadUrl('my-track')).toBe(
      `https://api.example.com${API_V1_PREFIX}/public/music/my-track/download`
    );
  });

  it('builds versioned video download URLs', () => {
    vi.stubEnv('NEXT_PUBLIC_BASE_URL', 'https://api.example.com');

    expect(getPublicVideoDownloadUrl('clip-1')).toBe(
      `https://api.example.com${API_V1_PREFIX}/public/videos/clip-1/download`
    );
  });

  it('encodes idOrSlug in the path', () => {
    vi.stubEnv('NEXT_PUBLIC_BASE_URL', 'https://api.example.com');

    expect(getPublicMusicDownloadUrl('a/b c')).toBe(
      `https://api.example.com${API_V1_PREFIX}/public/music/${encodeURIComponent('a/b c')}/download`
    );
  });
});
