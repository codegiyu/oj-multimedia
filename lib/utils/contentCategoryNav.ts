import { ALL_CATEGORY_ID } from '@/lib/constants/contentTaxonomy';
import type { IContentCategoryItem } from '@/lib/constants/endpoints';
import { callPublicServerApi } from '@/lib/services/serverApi';

export type CategoryNavItem = { id: string; label: string };

type ContentCategoryScope = IContentCategoryItem['scope'];

export async function fetchPublicCategoryNav(
  scope: ContentCategoryScope,
  allLabel: string,
  fallback: CategoryNavItem[]
): Promise<CategoryNavItem[]> {
  const params = new URLSearchParams();
  params.set('page', '1');
  params.set('limit', '500');
  params.set('sort', 'displayOrder');
  params.set('scope', scope);
  params.set('isActive', 'true');

  const res = await callPublicServerApi('PUBLIC_GET_CONTENT_CATEGORIES', {
    query: `?${params.toString()}` as `?${string}`,
  });

  if (res.type !== 'success') {
    return fallback;
  }

  const rows = (res.data.categories ?? [])
    .filter(category => category.isActive !== false)
    .map(category => ({ id: category.slug, label: category.name }));

  if (rows.length === 0) {
    return fallback;
  }

  return [{ id: ALL_CATEGORY_ID, label: allLabel }, ...rows];
}
