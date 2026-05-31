import { describe, expect, it } from 'vitest';
import { buildNewsBrowseQuery } from '@/lib/utils/newsBrowse';
import { BROWSE_LIST_PAGE_SIZE } from '@/lib/constants/browseList';
import { NEWS_TYPES } from '@/lib/constants/contentTaxonomy';

describe('buildNewsBrowseQuery', () => {
  it('builds paginated published news query with type', () => {
    const q = buildNewsBrowseQuery('inspirational-stories', 2, {
      type: NEWS_TYPES.trending,
    });

    expect(q).toContain('limit=' + String(BROWSE_LIST_PAGE_SIZE));
    expect(q).toContain('page=2');
    expect(q).toContain('status=published');
    expect(q).toContain('type=trending');
    expect(q).toContain('category=inspirational-stories');
  });

  it('omits category when all', () => {
    const q = buildNewsBrowseQuery('all', 1, { type: NEWS_TYPES.featured, limit: 8 });

    expect(q).toContain('limit=8');
    expect(q).not.toContain('category=');
    expect(q).toContain('type=featured');
  });
});
