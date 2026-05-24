import { describe, expect, it } from 'vitest';
import { CONTENT_IMAGE_DEFAULTS } from '@/lib/constants/contentImageDefaults';

describe('phase 2 public content images', () => {
  it('keeps the public default path for missing content covers', () => {
    expect(CONTENT_IMAGE_DEFAULTS.public).toBe('/images/album-1.jpg');
  });
});
