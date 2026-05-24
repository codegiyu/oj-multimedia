import { describe, expect, it } from 'vitest';
import { buildAdminListQuery, musicSortParam } from '@/lib/admin/buildListQuery';
import type {
  AdminCategoriesListParams,
  AdminContentListParams,
  AdminDocumentsListParams,
  AdminEmailLogsListParams,
  AdminHomeAdvertsListParams,
  AdminStandardListParams,
} from '@/lib/utils/adminDashboardSearchParams';

const standard: AdminStandardListParams = {
  page: 2,
  pageSize: 12,
  search: '  hello  ',
  status: 'published',
};

const content: AdminContentListParams = {
  ...standard,
  category: '507f1f77bcf86cd799439011',
  artist: 'all',
  vendor: 'all',
  type: 'all',
  startDate: '',
  endDate: '',
};

describe('musicSortParam', () => {
  it('maps UI sort keys to API sort fields', () => {
    expect(musicSortParam('downloads')).toBe('-downloads');
    expect(musicSortParam('plays')).toBe('-plays');
    expect(musicSortParam('newest')).toBe('-createdAt');
  });
});

describe('buildAdminListQuery', () => {
  it('builds standard list query', () => {
    const params = buildAdminListQuery('standard', standard, { sort: '-createdAt' });
    expect(params.get('page')).toBe('2');
    expect(params.get('limit')).toBe('12');
    expect(params.get('sort')).toBe('-createdAt');
    expect(params.get('search')).toBe('hello');
    expect(params.get('status')).toBe('published');
  });

  it('omits all status and empty search', () => {
    const params = buildAdminListQuery('standard', {
      page: 1,
      pageSize: 12,
      search: '  ',
      status: 'all',
    });
    expect(params.has('search')).toBe(false);
    expect(params.has('status')).toBe(false);
  });

  it('builds music query with category slug and sort key', () => {
    const withCategory: AdminContentListParams = {
      ...content,
      category: 'worship',
    };
    const params = buildAdminListQuery('music', withCategory, { sortKey: 'downloads' });
    expect(params.get('category')).toBe('worship');
    expect(params.get('sort')).toBe('-downloads');
  });

  it('builds documents query with entity filters', () => {
    const docParams: AdminDocumentsListParams = {
      page: 1,
      pageSize: 12,
      status: 'pending',
      search: 'key-abc',
      entityType: 'vendor',
      intent: 'verification',
    };
    const params = buildAdminListQuery('documents', docParams);
    expect(params.get('search')).toBe('key-abc');
    expect(params.get('status')).toBe('pending');
    expect(params.get('entityType')).toBe('vendor');
    expect(params.get('intent')).toBe('verification');
  });

  it('builds email logs query', () => {
    const emailParams: AdminEmailLogsListParams = {
      page: 1,
      pageSize: 12,
      filterStatus: 'sent',
      search: 'user@example.com',
      type: 'transactional',
      tab: 'all',
      startDate: '2026-01-01',
      endDate: '2026-01-31',
    };
    const params = buildAdminListQuery('emailLogs', emailParams);
    expect(params.get('status')).toBe('sent');
    expect(params.get('search')).toBe('user@example.com');
    expect(params.get('type')).toBe('transactional');
    expect(params.get('startDate')).toBe('2026-01-01');
    expect(params.get('endDate')).toBe('2026-01-31');
  });

  it('builds categories query with scope', () => {
    const catParams: AdminCategoriesListParams = {
      page: 1,
      pageSize: 12,
      search: 'worship',
      scope: 'music',
      status: 'all',
      isActive: 'all',
    };
    const params = buildAdminListQuery('categories', catParams, { sort: 'displayOrder' });
    expect(params.get('scope')).toBe('music');
    expect(params.get('search')).toBe('worship');
  });

  it('builds home adverts query with slot', () => {
    const advertParams: AdminHomeAdvertsListParams = {
      page: 1,
      pageSize: 12,
      slot: 'after_hero',
      search: '',
    };
    const params = buildAdminListQuery('homeAdverts', advertParams, { sort: 'displayOrder' });
    expect(params.get('slot')).toBe('after_hero');
  });

  it('builds vendor-scoped marketplace query', () => {
    const params = buildAdminListQuery(
      'marketplaceWithVendor',
      {
        ...content,
        category: '507f1f77bcf86cd799439011',
        vendor: '507f1f77bcf86cd799439012',
      },
      { sort: '-createdAt' }
    );
    expect(params.get('vendor')).toBe('507f1f77bcf86cd799439012');
    expect(params.get('category')).toBe('507f1f77bcf86cd799439011');
  });

  it('builds marketplace orders query with date range', () => {
    const params = buildAdminListQuery(
      'marketplaceOrders',
      {
        ...content,
        vendor: '507f1f77bcf86cd799439012',
        startDate: '2026-01-01',
        endDate: '2026-01-31',
      },
      { sort: '-createdAt' }
    );
    expect(params.get('vendor')).toBe('507f1f77bcf86cd799439012');
    expect(params.get('startDate')).toBe('2026-01-01');
    expect(params.get('endDate')).toBe('2026-01-31');
  });

  it('builds content query with resource type', () => {
    const params = buildAdminListQuery('content', { ...content, type: 'ebook' });
    expect(params.get('type')).toBe('ebook');
  });

  it('builds categories query with isActive', () => {
    const catParams: AdminCategoriesListParams = {
      page: 1,
      pageSize: 12,
      search: '',
      scope: 'all',
      status: 'all',
      isActive: 'active',
    };
    const params = buildAdminListQuery('categories', catParams, { sort: 'displayOrder' });
    expect(params.get('isActive')).toBe('active');
  });

  it('builds home adverts query with search', () => {
    const advertParams: AdminHomeAdvertsListParams = {
      page: 1,
      pageSize: 12,
      slot: 'all',
      search: 'https://example.com',
    };
    const params = buildAdminListQuery('homeAdverts', advertParams, { sort: 'displayOrder' });
    expect(params.get('search')).toBe('https://example.com');
  });
});
