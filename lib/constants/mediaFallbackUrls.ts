import { CONTENT_IMAGE_DEFAULTS } from '@/lib/constants/contentImageDefaults';

export const MEDIA_FALLBACK_URLS = {
  image: CONTENT_IMAGE_DEFAULTS.dashboard,
  audio: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
  video: 'https://samplelib.com/lib/preview/mp4/sample-5s.mp4',
  file: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
} as const;

export function getFallbackUrlForAccept(accept: string): string {
  const normalized = accept.toLowerCase();
  if (normalized.includes('image/')) return MEDIA_FALLBACK_URLS.image;
  if (normalized.includes('audio/')) return MEDIA_FALLBACK_URLS.audio;
  if (normalized.includes('video/')) return MEDIA_FALLBACK_URLS.video;
  return MEDIA_FALLBACK_URLS.file;
}
