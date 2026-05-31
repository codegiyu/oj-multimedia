import type { PublicServerApiConfig } from '@/lib/services/serverApi';
import { BROWSE_LIST_PAGE_SIZE } from '@/lib/constants/browseList';
import { buildBrowseListQuery } from '@/lib/utils/browsePage';

export type VideoSectionProps = {
  category: string;
  limit?: number;
  page?: number;
  fetchOptions?: PublicServerApiConfig;
};

export function buildVideoBaseQuery(category: string, limit = 12): `?${string}` {
  return buildVideoBrowseQuery(category, 1, { limit }) as `?${string}`;
}

export function buildVideoBrowseQuery(
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
