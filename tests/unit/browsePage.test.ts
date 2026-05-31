import { describe, expect, it } from 'vitest';
import { buildBrowseListQuery, parseBrowsePageParam } from '@/lib/utils/browsePage';
import { BROWSE_LIST_PAGE_SIZE } from '@/lib/constants/browseList';

describe('parseBrowsePageParam', () => {
  it('defaults to 1 when missing or invalid', () => {
    expect(parseBrowsePageParam(undefined)).toBe(1);
    expect(parseBrowsePageParam('')).toBe(1);
    expect(parseBrowsePageParam('0')).toBe(1);
    expect(parseBrowsePageParam('abc')).toBe(1);
  });

  it('parses positive integers', () => {
    expect(parseBrowsePageParam('2')).toBe(2);
    expect(parseBrowsePageParam('10')).toBe(10);
  });
});

describe('buildBrowseListQuery', () => {
  it('builds published list query with default limit', () => {
    const q = buildBrowseListQuery({ page: 2, extra: { type: 'trending' } });

    expect(q).toContain('limit=' + String(BROWSE_LIST_PAGE_SIZE));
    expect(q).toContain('page=2');
    expect(q).toContain('status=published');
    expect(q).toContain('type=trending');
  });

  it('omits all and empty extra values', () => {
    const q = buildBrowseListQuery({ page: 1, extra: { category: 'all', type: undefined } });

    expect(q).not.toContain('category=');
    expect(q).not.toContain('type=');
  });
});
