import { expect, test } from '@playwright/test';
import {
  getPublicMusicDownloadUrl,
  getPublicVideoDownloadUrl,
} from '@/lib/constants/endpoints/post';

/** Phase 1 regression — no dev server required. */
test.describe('public download URL contract', () => {
  test('music download path includes /api/v1', () => {
    const url = getPublicMusicDownloadUrl('sample-track');

    expect(url).toContain('/api/v1/public/music/sample-track/download');
  });

  test('video download path includes /api/v1', () => {
    const url = getPublicVideoDownloadUrl('sample-video');

    expect(url).toContain('/api/v1/public/videos/sample-video/download');
  });
});
