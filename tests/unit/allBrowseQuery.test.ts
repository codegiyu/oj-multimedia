import { describe, expect, it } from 'vitest';
import { ALL_BROWSE_CONFIG } from '@/lib/constants/allBrowseConfig';
import { buildAllBrowseListQuery } from '@/lib/utils/allBrowseQuery';
import { BROWSE_LIST_PAGE_SIZE } from '@/lib/constants/browseList';

describe('buildAllBrowseListQuery', () => {
  it('maps combined q, sort, and category for music', () => {
    const query = buildAllBrowseListQuery(ALL_BROWSE_CONFIG.music, {
      page: 2,
      q: 'worship',
      sort: 'popular',
      category: 'gospel',
    });

    expect(query).toContain('page=2');
    expect(query).toContain(`limit=${BROWSE_LIST_PAGE_SIZE}`);
    expect(query).toContain('status=published');
    expect(query).toContain('q=worship');
    expect(query).toContain('sort=popular');
    expect(query).toContain('category=gospel');
  });

  it('omits default sort and empty q', () => {
    const query = buildAllBrowseListQuery(ALL_BROWSE_CONFIG.news, {
      page: 1,
      sort: 'newest',
      q: '   ',
      category: 'all',
    });

    expect(query).not.toContain('q=');
    expect(query).not.toContain('sort=');
    expect(query).not.toContain('category=');
  });

  it('maps combined q, sort, category, and status for prayer requests', () => {
    const query = buildAllBrowseListQuery(ALL_BROWSE_CONFIG['prayer-request'], {
      page: 1,
      q: 'healing',
      sort: 'featured',
      category: 'family',
      status: 'active',
    });

    expect(query).toContain('q=healing');
    expect(query).toContain('sort=featured');
    expect(query).toContain('category=family');
    expect(query).toContain('status=active');
    expect(query).not.toContain('status=published');
  });

  it('omits workflow status when filter is all', () => {
    const query = buildAllBrowseListQuery(ALL_BROWSE_CONFIG.question, {
      page: 1,
      status: 'all',
    });

    expect(query).not.toContain('status=');
  });

  it('sends status=all for polls when filter is all', () => {
    const query = buildAllBrowseListQuery(ALL_BROWSE_CONFIG.poll, {
      page: 1,
      status: 'all',
    });

    expect(query).toContain('status=all');
    expect(query).not.toContain('status=published');
  });

  it('maps resource type and artist scope flags', () => {
    const resourceQuery = buildAllBrowseListQuery(ALL_BROWSE_CONFIG.resource, {
      page: 1,
      type: 'ebook',
      q: 'study',
    });

    expect(resourceQuery).toContain('type=ebook');
    expect(resourceQuery).toContain('q=study');

    const artistQuery = buildAllBrowseListQuery(ALL_BROWSE_CONFIG.artist, {
      page: 1,
      rising: true,
      featured: 'true',
    });

    expect(artistQuery).toContain('rising=true');
    expect(artistQuery).toContain('featured=true');
    expect(artistQuery).not.toContain('spotlight=');
  });
});
