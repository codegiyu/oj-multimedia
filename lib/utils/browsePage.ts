import { BROWSE_LIST_PAGE_SIZE } from '@/lib/constants/browseList';

/** Parse 1-based page from URL search param; invalid values fall back to 1. */
export function parseBrowsePageParam(pageParam: string | undefined | null): number {
  const n = parseInt(String(pageParam ?? '1'), 10);

  return Number.isFinite(n) && n >= 1 ? n : 1;
}

export function buildBrowseListQuery(params: {
  page: number;
  limit?: number;
  extra?: Record<string, string | undefined>;
}): string {
  const limit = params.limit ?? BROWSE_LIST_PAGE_SIZE;
  const search = new URLSearchParams();
  search.set('limit', String(limit));
  search.set('page', String(params.page));
  search.set('status', 'published');

  if (params.extra) {
    for (const [key, value] of Object.entries(params.extra)) {
      if (value != null && value !== '' && value !== 'all') {
        search.set(key, value);
      }
    }
  }

  return `?${search.toString()}`;
}
