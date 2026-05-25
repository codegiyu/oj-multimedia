import { ADMIN_LIST_FILTER_ALL } from '@/lib/admin/listFilters';

/** Stable serialization for `useAdminListUrlRefresh` dependency arrays. */
export function serializeAdminListUrlKey(state: Record<string, unknown>): string {
  const keys = Object.keys(state).sort();
  const normalized: Record<string, unknown> = {};

  for (const key of keys) {
    const value = state[key];
    if (value === undefined || value === null) continue;
    if (typeof value === 'string' && value === '') continue;
    if (value === ADMIN_LIST_FILTER_ALL) continue;
    normalized[key] = value;
  }

  return JSON.stringify(normalized);
}

export function appendAdminListRecordId(
  params: URLSearchParams,
  recordId: string | null | undefined
): URLSearchParams {
  const next = new URLSearchParams(params.toString());

  if (recordId && recordId.trim()) {
    next.set('id', recordId.trim());
  } else {
    next.delete('id');
  }

  return next;
}

export function buildAdminDashboardHref(
  pathname: string,
  listParams: URLSearchParams,
  recordId?: string | null
): string {
  const query = appendAdminListRecordId(listParams, recordId);
  const qs = query.toString();
  return qs ? `${pathname}?${qs}` : pathname;
}
