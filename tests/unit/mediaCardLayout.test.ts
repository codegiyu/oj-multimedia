import { describe, expect, it } from 'vitest';
import {
  MEDIA_BROWSE_GRID_CLASS,
  MUSIC_RAIL_ITEM_CLASS,
  MUSIC_RAIL_SCROLL_PX,
  VIDEO_DEFAULT_RAIL_ITEM_CLASS,
  VIDEO_RAIL_SCROLL_PX,
} from '@/lib/constants/mediaCardLayout';

describe('mediaCardLayout', () => {
  it('exports stable browse grid classes', () => {
    expect(MEDIA_BROWSE_GRID_CLASS).toBe(
      'grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
    );
  });

  it('exports stable rail item classes', () => {
    expect(MUSIC_RAIL_ITEM_CLASS).toContain('min-w-[240px]');
    expect(MUSIC_RAIL_ITEM_CLASS).toContain('2xl:w-[260px]');
    expect(VIDEO_DEFAULT_RAIL_ITEM_CLASS).toContain('xl:w-[320px]');
  });

  it('exports scroll amounts aligned to max rail widths', () => {
    expect(MUSIC_RAIL_SCROLL_PX).toBe(260);
    expect(VIDEO_RAIL_SCROLL_PX).toBe(320);
  });
});
