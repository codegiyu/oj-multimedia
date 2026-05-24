import { ADMIN_DASHBOARD_LIST_PAGE_SIZE } from '@/lib/constants/pagination';
import { ADMIN_FILTER_ALL } from '@/lib/utils/adminDashboardSearchParams';
import type {
  AdminCategoriesListParams,
  AdminContentListParams,
  AdminDocumentsListParams,
  AdminEmailLogsListParams,
  AdminHomeAdvertsListParams,
  AdminStandardListParams,
} from '@/lib/utils/adminDashboardSearchParams';
import type { AdminListResourceKey } from '@/lib/admin/listFilters';

/** Ensures API `limit` is a positive integer string (backend: `^[0-9]+$`). */
export function limitQueryValue(pageSize: unknown): string {
  const n =
    typeof pageSize === 'number' && Number.isFinite(pageSize)
      ? Math.floor(pageSize)
      : parseInt(String(pageSize ?? '').trim(), 10);
  const safe = Number.isFinite(n) && n > 0 ? n : ADMIN_DASHBOARD_LIST_PAGE_SIZE;
  return String(safe);
}

export function musicSortParam(sortKey: string): string {
  if (sortKey === 'downloads') return '-downloads';
  if (sortKey === 'plays') return '-plays';
  return '-createdAt';
}

function setPagination(
  params: URLSearchParams,
  page: number,
  pageSize: number,
  sort: string
): void {
  params.set('page', String(page));
  params.set('limit', limitQueryValue(pageSize));
  params.set('sort', sort);
}

function appendStandardFilters(params: URLSearchParams, p: AdminStandardListParams): void {
  const search = p.search.trim();
  if (search) params.set('search', search);
  if (p.status && p.status !== ADMIN_FILTER_ALL) params.set('status', p.status);
}

function appendContentFilters(params: URLSearchParams, p: AdminContentListParams): void {
  appendStandardFilters(params, p);
  if (p.category && p.category !== ADMIN_FILTER_ALL) params.set('category', p.category);
  if (p.artist && p.artist !== ADMIN_FILTER_ALL) params.set('artist', p.artist);
  if (p.vendor && p.vendor !== ADMIN_FILTER_ALL) params.set('vendor', p.vendor);
  if (p.type && p.type !== ADMIN_FILTER_ALL) params.set('type', p.type);
}

export type BuildAdminListQueryOptions = {
  sort?: string;
  sortKey?: string;
};

export function buildAdminListQuery(
  resource: AdminListResourceKey,
  params:
    | AdminStandardListParams
    | AdminContentListParams
    | AdminDocumentsListParams
    | AdminEmailLogsListParams
    | AdminCategoriesListParams
    | AdminHomeAdvertsListParams,
  options: BuildAdminListQueryOptions = {}
): URLSearchParams {
  const query = new URLSearchParams();
  const sort =
    resource === 'music' && options.sortKey
      ? musicSortParam(options.sortKey)
      : (options.sort ?? '-createdAt');

  switch (resource) {
    case 'music': {
      const p = params as AdminContentListParams;
      setPagination(query, p.page, p.pageSize, sort);
      appendContentFilters(query, p);
      break;
    }
    case 'content':
    case 'marketplaceWithVendor':
    case 'marketplaceOrders':
    case 'standard': {
      const p = params as AdminContentListParams | AdminStandardListParams;
      setPagination(query, p.page, p.pageSize, sort);
      if (resource === 'standard') {
        appendStandardFilters(query, p as AdminStandardListParams);
      } else {
        appendContentFilters(query, p as AdminContentListParams);
        if (resource === 'marketplaceOrders') {
          const orders = p as AdminContentListParams;
          if (orders.startDate) query.set('startDate', orders.startDate);
          if (orders.endDate) query.set('endDate', orders.endDate);
        }
      }
      break;
    }
    case 'documents': {
      const p = params as AdminDocumentsListParams;
      setPagination(query, p.page, p.pageSize, sort);
      if (p.search.trim()) query.set('search', p.search.trim());
      if (p.status && p.status !== ADMIN_FILTER_ALL) query.set('status', p.status);
      if (p.entityType && p.entityType !== ADMIN_FILTER_ALL) query.set('entityType', p.entityType);
      if (p.intent && p.intent !== ADMIN_FILTER_ALL) query.set('intent', p.intent);
      break;
    }
    case 'emailLogs': {
      const p = params as AdminEmailLogsListParams;
      setPagination(query, p.page, p.pageSize, sort);
      if (p.filterStatus && p.filterStatus !== ADMIN_FILTER_ALL) {
        query.set('status', p.filterStatus);
      }
      if (p.search.trim()) query.set('search', p.search.trim());
      if (p.type && p.type !== ADMIN_FILTER_ALL) query.set('type', p.type);
      if (p.startDate) query.set('startDate', p.startDate);
      if (p.endDate) query.set('endDate', p.endDate);
      break;
    }
    case 'categories': {
      const p = params as AdminCategoriesListParams;
      setPagination(query, p.page, p.pageSize, sort);
      if (p.search.trim()) query.set('search', p.search.trim());
      if (p.scope && p.scope !== ADMIN_FILTER_ALL) query.set('scope', p.scope);
      if (p.isActive && p.isActive !== ADMIN_FILTER_ALL) query.set('isActive', p.isActive);
      break;
    }
    case 'homeAdverts': {
      const p = params as AdminHomeAdvertsListParams;
      setPagination(query, p.page, p.pageSize, sort);
      if (p.slot && p.slot !== ADMIN_FILTER_ALL) query.set('slot', p.slot);
      if (p.search.trim()) query.set('search', p.search.trim());
      break;
    }
    case 'contactSubmissions': {
      const p = params as AdminStandardListParams;
      setPagination(query, p.page, p.pageSize, sort);
      if (p.search.trim()) query.set('search', p.search.trim());
      break;
    }
    case 'artists':
    case 'pastors':
    case 'users': {
      const p = params as AdminStandardListParams;
      setPagination(query, p.page, p.pageSize, sort);
      if (p.search.trim()) query.set('search', p.search.trim());
      if (p.status && p.status !== ADMIN_FILTER_ALL) {
        query.set('status', p.status);
      }
      break;
    }
    default:
      break;
  }

  return query;
}
