import { ADMIN_DASHBOARD_LIST_PAGE_SIZE } from '@/lib/constants/pagination';

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
    status: firstSearchParam(raw.status) ?? 'all',
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

export interface AdminCategoriesListParams {
  page: number;
  pageSize: number;
  search: string;
  scope: string;
}

export function parseAdminCategoriesListParams(
  raw: Record<string, string | string[] | undefined>
): AdminCategoriesListParams {
  const base = parseAdminStandardListParams(raw);
  return {
    ...base,
    scope: firstSearchParam(raw.scope) ?? 'all',
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
    slot: firstSearchParam(raw.slot) ?? 'all',
  };
}

export interface AdminDocumentsListParams {
  page: number;
  pageSize: number;
  status: string;
}

export function parseAdminDocumentsListParams(
  raw: Record<string, string | string[] | undefined>
): AdminDocumentsListParams {
  return {
    page: parsePositiveInt(firstSearchParam(raw.page), 1),
    pageSize: parsePositiveInt(firstListPageSizeParam(raw), ADMIN_DASHBOARD_LIST_PAGE_SIZE),
    status: firstSearchParam(raw.status) ?? 'all',
  };
}

export interface AdminEmailLogsListParams {
  page: number;
  pageSize: number;
  filterStatus: string;
}

export function parseAdminEmailLogsListParams(
  raw: Record<string, string | string[] | undefined>
): AdminEmailLogsListParams {
  return {
    page: parsePositiveInt(firstSearchParam(raw.page), 1),
    pageSize: parsePositiveInt(firstListPageSizeParam(raw), ADMIN_DASHBOARD_LIST_PAGE_SIZE),
    filterStatus: firstSearchParam(raw.status) ?? 'all',
  };
}
