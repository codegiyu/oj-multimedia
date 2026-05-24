import { describe, expect, it } from 'vitest';
import { CONTENT_IMAGE_DEFAULTS, resolveContentImage } from '@/lib/constants/contentImageDefaults';

describe('phase 4 broken url recovery', () => {
  it('uses local defaults as runtime recovery targets', () => {
    expect(CONTENT_IMAGE_DEFAULTS.public).toBe('/images/album-1.jpg');
    expect(CONTENT_IMAGE_DEFAULTS.dashboard).toBe('/placeholder.svg');
  });

  it('still resolves empty src before runtime recovery runs', () => {
    expect(resolveContentImage('', 'public')).toBe('/images/album-1.jpg');
    expect(resolveContentImage('', 'dashboard')).toBe('/placeholder.svg');
  });
});
