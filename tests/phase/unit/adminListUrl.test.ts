import { describe, expect, it } from 'vitest';
import { buildAdminListQuery } from '@/lib/admin/buildListQuery';
import {
  appendAdminListRecordId,
  buildAdminDashboardHref,
  serializeAdminListUrlKey,
} from '@/lib/admin/adminListUrl';
import { buildAdminListNuqsParsers } from '@/lib/admin/adminListNuqsParsers';
import { ADMIN_LIST_FILTER_ALL } from '@/lib/admin/listFilters';

describe('admin list URL helpers (phase 4a)', () => {
  it('buildAdminListNuqsParsers includes id and resource-specific filters', () => {
    const music = buildAdminListNuqsParsers('music');
    expect(music).toHaveProperty('page');
    expect(music).toHaveProperty('search');
    expect(music).toHaveProperty('status');
    expect(music).toHaveProperty('category');
    expect(music).toHaveProperty('artist');
    expect(music).toHaveProperty('id');

    const email = buildAdminListNuqsParsers('emailLogs');
    expect(email).toHaveProperty('type');
    expect(email).toHaveProperty('startDate');
    expect(email).toHaveProperty('endDate');
    expect(email).toHaveProperty('tab');
  });

  it('serializeAdminListUrlKey is stable for the same filter state', () => {
    const a = serializeAdminListUrlKey({ page: 2, search: 'ada', status: 'active', id: '' });
    const b = serializeAdminListUrlKey({ page: 2, search: 'ada', status: 'active', id: '' });
    expect(a).toBe(b);
    expect(a).not.toBe(
      serializeAdminListUrlKey({ page: 1, search: 'ada', status: 'active', id: '' })
    );
  });

  it('appendAdminListRecordId preserves list filters', () => {
    const base = buildAdminListQuery('users', {
      page: 2,
      pageSize: 12,
      search: 'ada',
      status: 'active',
    });
    const withId = appendAdminListRecordId(base, '507f1f77bcf86cd799439011');
    expect(withId.get('page')).toBe('2');
    expect(withId.get('search')).toBe('ada');
    expect(withId.get('status')).toBe('active');
    expect(withId.get('id')).toBe('507f1f77bcf86cd799439011');
  });

  it('buildAdminDashboardHref round-trips filters and record id', () => {
    const params = buildAdminListQuery('music', {
      page: 1,
      pageSize: 12,
      search: 'worship',
      status: 'published',
      category: 'worship',
      artist: '507f1f77bcf86cd799439011',
      vendor: ADMIN_LIST_FILTER_ALL,
      type: ADMIN_LIST_FILTER_ALL,
      startDate: '',
      endDate: '',
    });
    const href = buildAdminDashboardHref(
      '/admin/dashboard/music',
      params,
      '507f1f77bcf86cd799439099'
    );
    expect(href).toContain('/admin/dashboard/music?');
    expect(href).toContain('search=worship');
    expect(href).toContain('category=worship');
    expect(href).toContain('id=507f1f77bcf86cd799439099');
  });
});
