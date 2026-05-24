import { describe, expect, it } from 'vitest';
import { CONTENT_IMAGE_DEFAULTS, resolveContentImage } from '@/lib/constants/contentImageDefaults';

describe('contentImageDefaults', () => {
  it('defines public and dashboard fallback paths', () => {
    expect(CONTENT_IMAGE_DEFAULTS.public).toBe('/images/album-1.jpg');
    expect(CONTENT_IMAGE_DEFAULTS.dashboard).toBe('/placeholder.svg');
  });

  it('returns the public default when src is missing or blank', () => {
    expect(resolveContentImage(undefined, 'public')).toBe('/images/album-1.jpg');
    expect(resolveContentImage(null, 'public')).toBe('/images/album-1.jpg');
    expect(resolveContentImage('', 'public')).toBe('/images/album-1.jpg');
    expect(resolveContentImage('   ', 'public')).toBe('/images/album-1.jpg');
  });

  it('returns the dashboard default when src is missing or blank', () => {
    expect(resolveContentImage(undefined, 'dashboard')).toBe('/placeholder.svg');
    expect(resolveContentImage('', 'dashboard')).toBe('/placeholder.svg');
    expect(resolveContentImage('  ', 'dashboard')).toBe('/placeholder.svg');
  });

  it('returns trimmed src when provided', () => {
    expect(resolveContentImage('  https://cdn.example.com/cover.jpg  ', 'public')).toBe(
      'https://cdn.example.com/cover.jpg'
    );
    expect(resolveContentImage('/uploads/thumb.png', 'dashboard')).toBe('/uploads/thumb.png');
  });
});
