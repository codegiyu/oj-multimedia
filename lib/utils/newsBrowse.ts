import { BROWSE_LIST_PAGE_SIZE } from '@/lib/constants/browseList';
import { buildBrowseListQuery } from '@/lib/utils/browsePage';

export const NEWS_TRENDING_BROWSE_GRID_CLASS = 'grid gap-6 md:grid-cols-2 lg:grid-cols-3';
export const NEWS_FEATURED_BROWSE_GRID_CLASS = 'grid md:grid-cols-2 lg:grid-cols-3 gap-6';
export const NEWS_BREAKING_BROWSE_GRID_CLASS = 'grid gap-4';
export const NEWS_VIDEO_BROWSE_GRID_CLASS =
  'grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6';

export function buildNewsBrowseQuery(
  category: string,
  page: number,
  opts: { limit?: number; type?: string } = {}
): `?${string}` {
  const extra: Record<string, string | undefined> = {};

  if (category && category !== 'all') {
    extra.category = category;
  }

  if (opts.type) {
    extra.type = opts.type;
  }

  return buildBrowseListQuery({
    page,
    limit: opts.limit ?? BROWSE_LIST_PAGE_SIZE,
    extra,
  }) as `?${string}`;
}
