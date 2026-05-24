import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { buildAdminListQuery } from '@/lib/admin/buildListQuery';
import { adminListSupportsFilter, ADMIN_LIST_FILTER_FIELDS } from '@/lib/admin/listFilters';
import {
  buildAccountOrdersQuery,
  buildAccountVendorProductsQuery,
} from '@/lib/account/accountListFilters';
import {
  ADMIN_LIST_API_P95_TARGET_MS,
  ADMIN_LIST_QUERY_BUILD_ITERATIONS,
  ADMIN_LIST_QUERY_BUILD_MAX_MS,
  ADMIN_LIST_SEARCH_DEBOUNCE_MS,
} from '@/lib/constants/adminListPerformance';
import { DEFAULT_SEARCH_DEBOUNCE_MS } from '@/components/general/FilterableDataPage';

describe('admin list filters contract (phase 4)', () => {
  it('defines API latency and debounce budgets', () => {
    expect(ADMIN_LIST_API_P95_TARGET_MS).toBeLessThanOrEqual(300);
    expect(ADMIN_LIST_SEARCH_DEBOUNCE_MS).toBe(DEFAULT_SEARCH_DEBOUNCE_MS);
    expect(ADMIN_LIST_SEARCH_DEBOUNCE_MS).toBeGreaterThanOrEqual(300);
    expect(ADMIN_LIST_SEARCH_DEBOUNCE_MS).toBeLessThanOrEqual(400);
  });

  it('registry documents filter fields for music and marketplace orders', () => {
    expect(adminListSupportsFilter('music', 'category')).toBe(true);
    expect(adminListSupportsFilter('music', 'artist')).toBe(true);
    expect(adminListSupportsFilter('marketplaceOrders', 'startDate')).toBe(true);
    expect(adminListSupportsFilter('pastors', 'status')).toBe(true);
    expect(adminListSupportsFilter('users', 'status')).toBe(true);
    expect(ADMIN_LIST_FILTER_FIELDS.emailLogs).toContain('tab');
  });

  it('builds admin music list query with category and search under perf budget', () => {
    const start = performance.now();
    for (let i = 0; i < ADMIN_LIST_QUERY_BUILD_ITERATIONS; i++) {
      buildAdminListQuery('music', {
        page: 1,
        pageSize: 12,
        search: 'worship',
        status: 'published',
        category: 'worship',
        artist: 'all',
        vendor: 'all',
        type: 'all',
        startDate: '',
        endDate: '',
        // sort: 'newest',
      });
    }
    const elapsed = performance.now() - start;
    expect(elapsed).toBeLessThan(ADMIN_LIST_QUERY_BUILD_MAX_MS);

    const params = buildAdminListQuery('music', {
      page: 1,
      pageSize: 12,
      search: 'worship',
      status: 'published',
      category: 'worship',
      artist: 'all',
      vendor: 'all',
      type: 'all',
      startDate: '',
      endDate: '',
      // sort: 'newest',
    });
    expect(params.get('category')).toBe('worship');
    expect(params.get('search')).toBe('worship');
  });

  it('builds account and vendor list queries for phase 3 pages', () => {
    const orders = buildAccountOrdersQuery({
      page: 1,
      pageSize: 10,
      search: 'ORD',
      status: 'pending',
    });
    expect(orders.get('search')).toBe('ORD');

    const products = buildAccountVendorProductsQuery({
      page: 1,
      pageSize: 10,
      search: 'shirt',
      status: 'published',
      category: '507f1f77bcf86cd799439011',
    });
    expect(products.get('category')).toBe('507f1f77bcf86cd799439011');
  });

  it('exposes accessible search input labelling in FilterableDataPage', () => {
    const source = readFileSync('components/general/FilterableDataPage.tsx', 'utf8');
    expect(source).toContain('aria-label={searchPlaceholder}');
  });
});
