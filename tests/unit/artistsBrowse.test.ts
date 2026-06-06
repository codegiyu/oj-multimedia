import { describe, expect, it } from 'vitest';
import { buildArtistsBrowseQuery } from '@/lib/utils/artistsBrowse';

describe('buildArtistsBrowseQuery', () => {
  it('adds rising scope param', () => {
    const q = buildArtistsBrowseQuery(1, { limit: 4, scope: 'rising' });
    expect(q).toContain('rising=true');
    expect(q).toContain('limit=4');
  });

  it('adds featured scope param', () => {
    const q = buildArtistsBrowseQuery(2, { scope: 'featured' });
    expect(q).toContain('featured=true');
    expect(q).toContain('page=2');
  });

  it('adds spotlight scope param', () => {
    const q = buildArtistsBrowseQuery(1, { scope: 'spotlight' });
    expect(q).toContain('spotlight=true');
  });
});
