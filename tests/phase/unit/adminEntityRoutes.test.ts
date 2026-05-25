import { describe, expect, it } from 'vitest';
import { buildAdminListQuery } from '@/lib/admin/buildListQuery';
import { appendAdminListRecordId } from '@/lib/admin/adminListUrl';
import {
  buildAdminDocumentEntityHref,
  buildAdminEntityFilterHref,
  buildAdminEntityHref,
  resolveEntityId,
} from '@/lib/admin/entityRoutes';
import { ADMIN_LIST_FILTER_ALL } from '@/lib/admin/listFilters';

describe('admin entity routes (phase 4b)', () => {
  it('buildAdminEntityHref links artists and users with id param', () => {
    expect(buildAdminEntityHref('artist', '507f1f77bcf86cd799439011')).toBe(
      '/admin/dashboard/artists?id=507f1f77bcf86cd799439011'
    );
    expect(buildAdminEntityHref('user', '507f1f77bcf86cd799439012')).toBe(
      '/admin/dashboard/users?id=507f1f77bcf86cd799439012'
    );
  });

  it('buildAdminEntityHref sets marketplace tab before id', () => {
    expect(buildAdminEntityHref('vendor', '507f1f77bcf86cd799439013')).toBe(
      '/admin/dashboard/marketplace?tab=vendors&id=507f1f77bcf86cd799439013'
    );
    expect(buildAdminEntityHref('product', '507f1f77bcf86cd799439014')).toBe(
      '/admin/dashboard/marketplace?tab=products&id=507f1f77bcf86cd799439014'
    );
  });

  it('buildAdminEntityHref preserves list filters alongside id', () => {
    const listParams = buildAdminListQuery('music', {
      page: 2,
      pageSize: 12,
      search: 'worship',
      status: 'published',
      category: 'worship',
      artist: ADMIN_LIST_FILTER_ALL,
      vendor: ADMIN_LIST_FILTER_ALL,
      type: ADMIN_LIST_FILTER_ALL,
      startDate: '',
      endDate: '',
    });
    const withId = appendAdminListRecordId(listParams, '507f1f77bcf86cd799439099');
    const href = buildAdminEntityHref('music', '507f1f77bcf86cd799439099', {
      listParams: withId,
    });

    expect(href).toContain('/admin/dashboard/music?');
    expect(href).toContain('search=worship');
    expect(href).toContain('id=507f1f77bcf86cd799439099');
  });

  it('buildAdminEntityFilterHref targets filtered content lists', () => {
    expect(buildAdminEntityFilterHref('music', '507f1f77bcf86cd799439011')).toBe(
      '/admin/dashboard/music?artist=507f1f77bcf86cd799439011'
    );
    expect(buildAdminEntityFilterHref('marketplace-products', '507f1f77bcf86cd799439012')).toBe(
      '/admin/dashboard/marketplace?tab=products&vendor=507f1f77bcf86cd799439012'
    );
  });

  it('buildAdminDocumentEntityHref maps document entity types', () => {
    expect(buildAdminDocumentEntityHref('artist', '507f1f77bcf86cd799439011')).toBe(
      '/admin/dashboard/artists?id=507f1f77bcf86cd799439011'
    );
    expect(buildAdminDocumentEntityHref('unknown', '507f1f77bcf86cd799439011')).toBeNull();
  });

  it('resolveEntityId accepts string or populated ref', () => {
    expect(resolveEntityId('507f1f77bcf86cd799439011')).toBe('507f1f77bcf86cd799439011');
    expect(resolveEntityId({ _id: '507f1f77bcf86cd799439012' })).toBe('507f1f77bcf86cd799439012');
    expect(resolveEntityId(null)).toBeNull();
  });
});
