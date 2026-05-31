import { RESOURCE_TYPES, type ResourceType } from '@/lib/types/community';
import { buildBrowseListQuery } from '@/lib/utils/browsePage';
import {
  mapToAffiliateProduct,
  mapToBeat,
  mapToEbook,
  mapToTemplate,
  mapToWallpaper,
} from '@/lib/utils/communityApiMappers';

export type ResourceBrowseFilter = 'all' | ResourceType;

export const RESOURCE_TYPE_FILTER_LABELS: Record<ResourceType, string> = {
  ebook: 'E-books',
  template: 'Templates',
  beat: 'Beats',
  wallpaper: 'Wallpapers',
  affiliate: 'Affiliate',
};

export function parseResourceTypeFilter(param?: string | null): ResourceBrowseFilter {
  if (!param || param === 'all') {
    return 'all';
  }

  if ((RESOURCE_TYPES as readonly string[]).includes(param)) {
    return param as ResourceType;
  }

  return 'all';
}

export function buildResourceBrowseQuery(page: number, type: ResourceBrowseFilter): `?${string}` {
  return buildBrowseListQuery({
    page,
    extra: type !== 'all' ? { type } : undefined,
  }) as `?${string}`;
}

export type ResourceBrowseItem =
  | { kind: 'ebook'; data: ReturnType<typeof mapToEbook> }
  | { kind: 'template'; data: ReturnType<typeof mapToTemplate> }
  | { kind: 'beat'; data: ReturnType<typeof mapToBeat> }
  | { kind: 'wallpaper'; data: ReturnType<typeof mapToWallpaper> }
  | { kind: 'affiliate'; data: ReturnType<typeof mapToAffiliateProduct> };

export function mapPublicResourceBrowseItem(item: Record<string, unknown>): ResourceBrowseItem {
  const type = String(item.type ?? 'ebook');

  switch (type) {
    case 'template':
      return { kind: 'template', data: mapToTemplate(item) };
    case 'beat':
      return { kind: 'beat', data: mapToBeat(item) };
    case 'wallpaper':
      return { kind: 'wallpaper', data: mapToWallpaper(item) };
    case 'affiliate':
      return { kind: 'affiliate', data: mapToAffiliateProduct(item) };
    default:
      return { kind: 'ebook', data: mapToEbook(item) };
  }
}
