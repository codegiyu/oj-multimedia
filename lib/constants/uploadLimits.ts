/** Default max audio upload size (50 MB). */
export const AUDIO_UPLOAD_MAX_BYTES = 50 * 1024 * 1024;

/** Default max image upload size for admin forms (10 MB). */
export const IMAGE_UPLOAD_MAX_BYTES = 10 * 1024 * 1024;

/** XHR timeout for audio/video PUT uploads (5 minutes). */
export const MEDIA_UPLOAD_TIMEOUT_MS = 5 * 60 * 1000;

/** XHR timeout for image PUT uploads (60 seconds). */
export const IMAGE_UPLOAD_TIMEOUT_MS = 60 * 1000;

export function formatUploadBytes(size: number): string {
  if (size < 1024) return `${size} B`;
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;

  return `${(size / (1024 * 1024)).toFixed(1)} MB`;
}

const AUDIO_EXTENSIONS = new Set(['mp3', 'wav', 'flac', 'aac', 'm4a', 'ogg']);
const VIDEO_EXTENSIONS = new Set(['mp4', 'webm', 'mov']);

export function getUploadMaxBytesForFile(filename: string, intent: string): number | undefined {
  const ext = filename.includes('.') ? (filename.split('.').pop()?.toLowerCase() ?? '') : '';

  if (AUDIO_EXTENSIONS.has(ext) || VIDEO_EXTENSIONS.has(ext) || intent === 'other') {
    return AUDIO_UPLOAD_MAX_BYTES;
  }

  if (intent === 'image' || ['avatar', 'logo', 'card-image', 'banner-image'].includes(intent)) {
    return IMAGE_UPLOAD_MAX_BYTES;
  }

  return undefined;
}

export function getUploadTimeoutMsForFile(filename: string, intent: string): number {
  const ext = filename.includes('.') ? (filename.split('.').pop()?.toLowerCase() ?? '') : '';

  if (AUDIO_EXTENSIONS.has(ext) || VIDEO_EXTENSIONS.has(ext) || intent === 'other') {
    return MEDIA_UPLOAD_TIMEOUT_MS;
  }

  return IMAGE_UPLOAD_TIMEOUT_MS;
}
