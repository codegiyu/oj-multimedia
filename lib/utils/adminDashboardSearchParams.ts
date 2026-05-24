import { ADMIN_DASHBOARD_LIST_PAGE_SIZE } from '@/lib/constants/pagination';

export const ADMIN_FILTER_ALL = 'all';

export function firstSearchParam(value: string | string[] | undefined): string | undefined {
  if (value === undefined) return undefined;
  return Array.isArray(value) ? value[0] : value;
}

/** Resolves list page size from URL (`pagesize`, `pageSize`, or `limit`). */
export function firstListPageSizeParam(
  raw: Record<string, string | string[] | undefined>
): string | undefined {
  return (
    firstSearchParam(raw.pagesize) ?? firstSearchParam(raw.pageSize) ?? firstSearchParam(raw.limit)
  );
}

export function parsePositiveInt(value: string | undefined, fallback: number): number {
  const fb =
    Number.isFinite(fallback) && fallback > 0
      ? Math.floor(fallback)
      : ADMIN_DASHBOARD_LIST_PAGE_SIZE;
  const n = parseInt(String(value ?? '').trim(), 10);
  return Number.isFinite(n) && n > 0 ? n : fb;
}

export interface AdminStandardListParams {
  page: number;
  pageSize: number;
  search: string;
  status: string;
}

export function parseAdminStandardListParams(
  raw: Record<string, string | string[] | undefined>
): AdminStandardListParams {
  return {
    page: parsePositiveInt(firstSearchParam(raw.page), 1),
    pageSize: parsePositiveInt(firstListPageSizeParam(raw), ADMIN_DASHBOARD_LIST_PAGE_SIZE),
    search: firstSearchParam(raw.search) ?? '',
    status: firstSearchParam(raw.status) ?? ADMIN_FILTER_ALL,
  };
}

/** Standard list params plus optional category, artist, and vendor filters. */
export interface AdminContentListParams extends AdminStandardListParams {
  category: string;
  artist: string;
  vendor: string;
}

export function parseAdminContentListParams(
  raw: Record<string, string | string[] | undefined>
): AdminContentListParams {
  const base = parseAdminStandardListParams(raw);
  return {
    ...base,
    category: firstSearchParam(raw.category) ?? ADMIN_FILTER_ALL,
    artist: firstSearchParam(raw.artist) ?? ADMIN_FILTER_ALL,
    vendor: firstSearchParam(raw.vendor) ?? ADMIN_FILTER_ALL,
  };
}

export interface AdminMusicListParams extends AdminContentListParams {
  sort: string;
}

export function parseAdminMusicListParams(
  raw: Record<string, string | string[] | undefined>
): AdminMusicListParams {
  return {
    ...parseAdminContentListParams(raw),
    sort: parseAdminMusicSort(raw),
  };
}

export function parseAdminMusicSort(raw: Record<string, string | string[] | undefined>): string {
  return firstSearchParam(raw.sort) ?? 'newest';
}

export function parseTabParam(
  raw: Record<string, string | string[] | undefined>,
  key: string,
  fallback: string
): string {
  return firstSearchParam(raw[key]) ?? fallback;
}

export interface AdminCategoriesListParams extends AdminStandardListParams {
  scope: string;
}

export function parseAdminCategoriesListParams(
  raw: Record<string, string | string[] | undefined>
): AdminCategoriesListParams {
  const base = parseAdminStandardListParams(raw);
  return {
    ...base,
    scope: firstSearchParam(raw.scope) ?? ADMIN_FILTER_ALL,
  };
}

export interface AdminHomeAdvertsListParams {
  page: number;
  pageSize: number;
  slot: string;
}

export function parseAdminHomeAdvertsListParams(
  raw: Record<string, string | string[] | undefined>
): AdminHomeAdvertsListParams {
  return {
    page: parsePositiveInt(firstSearchParam(raw.page), 1),
    pageSize: parsePositiveInt(firstListPageSizeParam(raw), ADMIN_DASHBOARD_LIST_PAGE_SIZE),
    slot: firstSearchParam(raw.slot) ?? ADMIN_FILTER_ALL,
  };
}

export interface AdminDocumentsListParams {
  page: number;
  pageSize: number;
  status: string;
  search: string;
  entityType: string;
  intent: string;
}

export function parseAdminDocumentsListParams(
  raw: Record<string, string | string[] | undefined>
): AdminDocumentsListParams {
  return {
    page: parsePositiveInt(firstSearchParam(raw.page), 1),
    pageSize: parsePositiveInt(firstListPageSizeParam(raw), ADMIN_DASHBOARD_LIST_PAGE_SIZE),
    status: firstSearchParam(raw.status) ?? ADMIN_FILTER_ALL,
    search: firstSearchParam(raw.search) ?? '',
    entityType: firstSearchParam(raw.entityType) ?? ADMIN_FILTER_ALL,
    intent: firstSearchParam(raw.intent) ?? ADMIN_FILTER_ALL,
  };
}

export interface AdminEmailLogsListParams {
  page: number;
  pageSize: number;
  filterStatus: string;
  search: string;
  type: string;
  tab: string;
  startDate: string;
  endDate: string;
}

export function parseAdminEmailLogsListParams(
  raw: Record<string, string | string[] | undefined>
): AdminEmailLogsListParams {
  return {
    page: parsePositiveInt(firstSearchParam(raw.page), 1),
    pageSize: parsePositiveInt(firstListPageSizeParam(raw), ADMIN_DASHBOARD_LIST_PAGE_SIZE),
    filterStatus: firstSearchParam(raw.status) ?? ADMIN_FILTER_ALL,
    search: firstSearchParam(raw.search) ?? '',
    type: firstSearchParam(raw.type) ?? ADMIN_FILTER_ALL,
    tab: firstSearchParam(raw.tab) ?? ADMIN_FILTER_ALL,
    startDate: firstSearchParam(raw.startDate) ?? '',
    endDate: firstSearchParam(raw.endDate) ?? '',
  };
}
