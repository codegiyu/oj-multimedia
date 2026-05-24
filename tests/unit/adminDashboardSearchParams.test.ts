import { describe, expect, it } from 'vitest';
import {
  parseAdminCategoriesListParams,
  parseAdminContentListParams,
  parseAdminDocumentsListParams,
  parseAdminEmailLogsListParams,
  parseAdminHomeAdvertsListParams,
  parseAdminMusicListParams,
  parseAdminStandardListParams,
  parsePositiveInt,
  resolveEmailLogsFilterStatus,
} from '@/lib/utils/adminDashboardSearchParams';

describe('parseAdminStandardListParams', () => {
  it('parses page, search, and status with defaults', () => {
    expect(parseAdminStandardListParams({})).toEqual({
      page: 1,
      pageSize: 12,
      search: '',
      status: 'all',
    });
  });

  it('parses array searchParams from Next', () => {
    expect(
      parseAdminStandardListParams({
        page: ['2'],
        search: ['hello'],
        status: ['draft'],
        limit: ['50'],
      })
    ).toEqual({
      page: 2,
      pageSize: 50,
      search: 'hello',
      status: 'draft',
    });
  });
});

describe('parseAdminContentListParams', () => {
  it('extends standard params with category, artist, and vendor', () => {
    expect(
      parseAdminContentListParams({
        category: 'cat-1',
        artist: 'artist-1',
        vendor: 'vendor-1',
      })
    ).toMatchObject({
      category: 'cat-1',
      artist: 'artist-1',
      vendor: 'vendor-1',
      status: 'all',
    });
  });

  it('defaults extended filters to all', () => {
    expect(parseAdminContentListParams({})).toMatchObject({
      category: 'all',
      artist: 'all',
      vendor: 'all',
      type: 'all',
      startDate: '',
      endDate: '',
    });
  });

  it('parses type and date range', () => {
    expect(
      parseAdminContentListParams({
        type: 'ebook',
        startDate: '2026-01-01',
        endDate: '2026-01-31',
      })
    ).toMatchObject({
      type: 'ebook',
      startDate: '2026-01-01',
      endDate: '2026-01-31',
    });
  });
});

describe('parseAdminMusicListParams', () => {
  it('includes sort default and category', () => {
    expect(parseAdminMusicListParams({ sort: 'downloads', category: 'c1' })).toEqual({
      page: 1,
      pageSize: 12,
      search: '',
      status: 'all',
      category: 'c1',
      artist: 'all',
      vendor: 'all',
      type: 'all',
      startDate: '',
      endDate: '',
      sort: 'downloads',
    });
  });
});

describe('parseAdminDocumentsListParams', () => {
  it('parses search, entityType, and intent', () => {
    expect(
      parseAdminDocumentsListParams({
        search: 'invoice',
        entityType: 'vendor',
        intent: 'verification',
        status: 'pending',
      })
    ).toEqual({
      page: 1,
      pageSize: 12,
      status: 'pending',
      search: 'invoice',
      entityType: 'vendor',
      intent: 'verification',
    });
  });

  it('defaults entityType and intent to all', () => {
    expect(parseAdminDocumentsListParams({})).toMatchObject({
      entityType: 'all',
      intent: 'all',
      search: '',
    });
  });
});

describe('resolveEmailLogsFilterStatus', () => {
  it('prefers tab over status when tab is not all', () => {
    expect(resolveEmailLogsFilterStatus({ tab: 'failed', status: 'sent' })).toBe('failed');
  });

  it('falls back to status when tab is all', () => {
    expect(resolveEmailLogsFilterStatus({ tab: 'all', status: 'sent' })).toBe('sent');
  });
});

describe('parseAdminEmailLogsListParams', () => {
  it('parses email log filters with tab-driven status', () => {
    expect(
      parseAdminEmailLogsListParams({
        search: 'user@example.com',
        type: 'transactional',
        tab: 'pending',
        startDate: '2026-01-01',
        endDate: '2026-01-31',
      })
    ).toEqual({
      page: 1,
      pageSize: 12,
      filterStatus: 'pending',
      search: 'user@example.com',
      type: 'transactional',
      tab: 'pending',
      startDate: '2026-01-01',
      endDate: '2026-01-31',
    });
  });
});

describe('parseAdminCategoriesListParams', () => {
  it('keeps scope parsing', () => {
    expect(parseAdminCategoriesListParams({ scope: 'music' })).toMatchObject({
      scope: 'music',
    });
  });

  it('parses isActive filter', () => {
    expect(parseAdminCategoriesListParams({ isActive: 'inactive' })).toMatchObject({
      isActive: 'inactive',
    });
  });
});

describe('parseAdminHomeAdvertsListParams', () => {
  it('keeps slot parsing', () => {
    expect(parseAdminHomeAdvertsListParams({ slot: 'after_hero' })).toMatchObject({
      slot: 'after_hero',
    });
  });
});

describe('parsePositiveInt', () => {
  it('falls back for invalid values', () => {
    expect(parsePositiveInt('abc', 10)).toBe(10);
    expect(parsePositiveInt('-1', 10)).toBe(10);
  });
});
