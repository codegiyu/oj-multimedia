import { describe, expect, it } from 'vitest';
import {
  AUDIO_UPLOAD_MAX_BYTES,
  getUploadMaxBytesForFile,
  getUploadTimeoutMsForFile,
  IMAGE_UPLOAD_MAX_BYTES,
  IMAGE_UPLOAD_TIMEOUT_MS,
  MEDIA_UPLOAD_TIMEOUT_MS,
} from './uploadLimits';

describe('uploadLimits', () => {
  it('returns audio max bytes for mp3 files', () => {
    expect(getUploadMaxBytesForFile('track.mp3', 'other')).toBe(AUDIO_UPLOAD_MAX_BYTES);
  });

  it('returns image max bytes for image intent', () => {
    expect(getUploadMaxBytesForFile('cover.jpg', 'image')).toBe(IMAGE_UPLOAD_MAX_BYTES);
  });

  it('uses longer timeout for audio files', () => {
    expect(getUploadTimeoutMsForFile('track.mp3', 'other')).toBe(MEDIA_UPLOAD_TIMEOUT_MS);
  });

  it('uses shorter timeout for images', () => {
    expect(getUploadTimeoutMsForFile('cover.jpg', 'image')).toBe(IMAGE_UPLOAD_TIMEOUT_MS);
  });
});
