import type { SearchResultType } from '@/lib/constants/endpoints';

/**
 * Public search API may return composite ids with a short type prefix (e.g. `m` + id).
 * Strip only when that prefix pattern matches; slugs and plain ObjectIds are unchanged
 * except when they intentionally use this prefix scheme.
 */
const SEARCH_ID_TYPE_PREFIX = /^(pr|m|n|v|d|t|q|p|r|a)/;

export function searchResultIdForRoute(_id: string): string {
  return _id.replace(SEARCH_ID_TYPE_PREFIX, '');
}

export function getSearchResultDetailHref(type: SearchResultType, _id: string): string | null {
  const idPart = searchResultIdForRoute(_id);
  if (!idPart) return null;

  const enc = encodeURIComponent(idPart);

  switch (type) {
    case 'music':
      return `/music/${enc}`;
    case 'album':
      return `/music/albums/${enc}`;
    case 'news':
      return `/news/story/${enc}`;
    case 'video':
      return `/videos/${enc}`;
    case 'devotional':
      return `/community/devotionals/${enc}`;
    case 'testimony':
      return `/community/testimonies/${enc}`;
    case 'prayer-request':
      return `/community/prayer-requests/${enc}`;
    case 'question':
      return `/community/ask-a-pastor/${enc}`;
    case 'poll':
      return `/community/polls-and-voting/${enc}`;
    case 'resource':
      return '/community/resources';
    case 'artist':
      return `/community/artists/${enc}`;
    default:
      return null;
  }
}
