import { describe, expect, it } from 'vitest';
import {
  buildAccountArtistContentQuery,
  buildAccountOrdersQuery,
  buildAccountVendorProductsQuery,
  isAccountListUnfiltered,
} from '@/lib/account/accountListFilters';

describe('buildAccountOrdersQuery', () => {
  it('includes pagination, search, and status', () => {
    const params = buildAccountOrdersQuery({
      page: 2,
      pageSize: 12,
      search: '  ORD-123  ',
      status: 'pending',
    });
    expect(params.get('page')).toBe('2');
    expect(params.get('limit')).toBe('12');
    expect(params.get('search')).toBe('ORD-123');
    expect(params.get('status')).toBe('pending');
  });

  it('omits empty search and all status', () => {
    const params = buildAccountOrdersQuery({
      page: 1,
      pageSize: 10,
      search: '  ',
      status: 'all',
    });
    expect(params.has('search')).toBe(false);
    expect(params.has('status')).toBe(false);
  });
});

describe('buildAccountVendorProductsQuery', () => {
  it('includes category when set', () => {
    const params = buildAccountVendorProductsQuery({
      page: 1,
      pageSize: 10,
      search: 'shirt',
      status: 'published',
      category: '507f1f77bcf86cd799439011',
    });
    expect(params.get('search')).toBe('shirt');
    expect(params.get('status')).toBe('published');
    expect(params.get('category')).toBe('507f1f77bcf86cd799439011');
  });
});

describe('buildAccountArtistContentQuery', () => {
  it('includes artist content filters', () => {
    const params = buildAccountArtistContentQuery({
      page: 1,
      pageSize: 10,
      search: 'worship',
      status: 'draft',
    });
    expect(params.get('search')).toBe('worship');
    expect(params.get('status')).toBe('draft');
  });
});

describe('isAccountListUnfiltered', () => {
  it('detects active filters', () => {
    expect(isAccountListUnfiltered('', '', undefined)).toBe(true);
    expect(isAccountListUnfiltered('x', '', undefined)).toBe(false);
    expect(isAccountListUnfiltered('', 'pending', undefined)).toBe(false);
    expect(isAccountListUnfiltered('', 'all', 'cat-id')).toBe(false);
  });
});
