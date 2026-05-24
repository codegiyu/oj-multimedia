import { describe, expect, it } from 'vitest';
import { CONTENT_IMAGE_DEFAULTS, resolveContentImage } from '@/lib/constants/contentImageDefaults';

describe('phase 1 content image foundation', () => {
  it('exposes public and dashboard default paths', () => {
    expect(CONTENT_IMAGE_DEFAULTS.public).toBe('/images/album-1.jpg');
    expect(CONTENT_IMAGE_DEFAULTS.dashboard).toBe('/placeholder.svg');
  });

  it('resolves missing src to the correct context default', () => {
    expect(resolveContentImage('', 'public')).toBe('/images/album-1.jpg');
    expect(resolveContentImage('', 'dashboard')).toBe('/placeholder.svg');
  });
});
