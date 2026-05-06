import { ALL_CATEGORY_ID } from '@/lib/constants/contentTaxonomy';
import type { IContentCategoryItem } from '@/lib/constants/endpoints';
import { callPublicServerApi } from '@/lib/services/serverApi';

type ContentCategoryScope = IContentCategoryItem['scope'];

export async function getPublicCategorySlugsByScope(
  scope: ContentCategoryScope
): Promise<string[]> {
  const params = new URLSearchParams();
  params.set('page', '1');
  params.set('limit', '500');
  params.set('sort', 'displayOrder');
  params.set('scope', scope);
  params.set('isActive', 'true');

  const res = await callPublicServerApi('PUBLIC_GET_CONTENT_CATEGORIES', {
    query: `?${params.toString()}` as `?${string}`,
  });

  if (res.type !== 'success') return [];
  return (res.data.categories ?? [])
    .filter(category => category.isActive !== false)
    .map(category => category.slug);
}

export async function normalizePublicCategoryByScope(
  scope: ContentCategoryScope,
  value: string | undefined
): Promise<string> {
  if (!value || value === ALL_CATEGORY_ID) return ALL_CATEGORY_ID;
  const validSlugs = await getPublicCategorySlugsByScope(scope);
  return validSlugs.includes(value) ? value : ALL_CATEGORY_ID;
}
