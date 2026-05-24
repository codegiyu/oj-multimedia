/** Shared URL → API query helpers for account / vendor / artist-portal lists. */

export const ACCOUNT_FILTER_ALL = 'all';

export interface AccountListBaseParams {
  page: number;
  pageSize: number;
  search: string;
}

export interface AccountOrdersListParams extends AccountListBaseParams {
  status: string;
}

export interface AccountVendorProductsListParams extends AccountListBaseParams {
  status: string;
  category: string;
}

export interface AccountArtistContentListParams extends AccountListBaseParams {
  status: string;
}

function setPagination(params: URLSearchParams, page: number, pageSize: number): void {
  params.set('page', String(page));
  params.set('limit', String(pageSize));
}

function appendSearch(params: URLSearchParams, search: string): void {
  const value = search.trim();
  if (value) params.set('search', value);
}

function appendStatus(params: URLSearchParams, status: string): void {
  if (status && status !== ACCOUNT_FILTER_ALL) params.set('status', status);
}

function appendCategory(params: URLSearchParams, category: string): void {
  if (category && category !== ACCOUNT_FILTER_ALL) params.set('category', category);
}

export function buildAccountOrdersQuery(p: AccountOrdersListParams): URLSearchParams {
  const query = new URLSearchParams();
  setPagination(query, p.page, p.pageSize);
  appendSearch(query, p.search);
  appendStatus(query, p.status);
  return query;
}

export function buildAccountVendorProductsQuery(
  p: AccountVendorProductsListParams
): URLSearchParams {
  const query = new URLSearchParams();
  setPagination(query, p.page, p.pageSize);
  appendSearch(query, p.search);
  appendStatus(query, p.status);
  appendCategory(query, p.category);
  return query;
}

export function buildAccountArtistContentQuery(p: AccountArtistContentListParams): URLSearchParams {
  const query = new URLSearchParams();
  setPagination(query, p.page, p.pageSize);
  appendSearch(query, p.search);
  appendStatus(query, p.status);
  return query;
}

/** True when the user has no active filters (onboarding-style empty state). */
export function isAccountListUnfiltered(
  search: string,
  status: string,
  category?: string
): boolean {
  const hasSearch = Boolean(search.trim());
  const hasStatus = Boolean(status && status !== ACCOUNT_FILTER_ALL);
  const hasCategory = Boolean(category && category !== ACCOUNT_FILTER_ALL);
  return !hasSearch && !hasStatus && !hasCategory;
}
