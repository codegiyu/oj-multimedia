import { BROWSE_LIST_PAGE_SIZE } from '@/lib/constants/browseList';
import { buildBrowseListQuery } from '@/lib/utils/browsePage';

export type ArtistBrowseScope = 'rising' | 'featured' | 'spotlight' | 'directory';

export function buildArtistsBrowseQuery(
  page: number,
  opts: { limit?: number; scope?: ArtistBrowseScope } = {}
): `?${string}` {
  const extra: Record<string, string | undefined> = {};

  if (opts.scope === 'rising') extra.rising = 'true';
  if (opts.scope === 'featured') extra.featured = 'true';
  if (opts.scope === 'spotlight') extra.spotlight = 'true';

  return buildBrowseListQuery({
    page,
    limit: opts.limit ?? BROWSE_LIST_PAGE_SIZE,
    extra,
  }) as `?${string}`;
}
