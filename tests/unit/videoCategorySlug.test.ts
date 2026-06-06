import { describe, expect, it } from 'vitest';
import {
  isVideoCategorySlug,
  normalizeVideoCategorySlug,
  VIDEO_CATEGORY_SLUGS,
} from '@/lib/constants/contentTaxonomy';

describe('video category slugs', () => {
  it('defines movies and drama without legacy movie slug', () => {
    expect(VIDEO_CATEGORY_SLUGS).toContain('movies');
    expect(VIDEO_CATEGORY_SLUGS).toContain('drama');
    expect(VIDEO_CATEGORY_SLUGS).not.toContain('movie');
  });

  it('normalizes legacy movie slug to movies', () => {
    expect(normalizeVideoCategorySlug('movie')).toBe('movies');
    expect(isVideoCategorySlug('movie')).toBe(false);
    expect(isVideoCategorySlug('movies')).toBe(true);
  });

  it('falls back unknown slugs to creative', () => {
    expect(normalizeVideoCategorySlug('unknown-slug')).toBe('creative');
    expect(normalizeVideoCategorySlug(undefined)).toBe('creative');
  });
});
