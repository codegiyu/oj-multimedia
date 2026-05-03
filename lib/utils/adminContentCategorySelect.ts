import { callApi } from '@/lib/services/callApi';
import type { IContentCategoryItem } from '@/lib/constants/endpoints';
import type { SelectOption } from '@/lib/types/general';

export type AdminContentCategoryScope = IContentCategoryItem['scope'];

const noneOption: SelectOption = { text: 'None', value: '' };

/**
 * Loads admin content categories for a scope (music, video, news, devotional)
 * and returns select options (slug = value), with an empty "None" first row.
 */
export async function loadAdminContentCategorySelectOptions(
  scope: AdminContentCategoryScope
): Promise<SelectOption[]> {
  const params = new URLSearchParams();
  params.set('page', '1');
  params.set('limit', '500');
  params.set('sort', 'displayOrder');
  params.set('scope', scope);
  const res = await callApi('ADMIN_CONTENT_CATEGORIES_LIST', {
    query: `?${params.toString()}` as `?${string}`,
  });
  if (res.type !== 'success') {
    return [noneOption];
  }
  const cats = res.data.categories ?? [];
  const rows: SelectOption[] = cats.map(c => ({
    text: c.isActive === false ? `${c.name} (inactive)` : c.name,
    value: c.slug,
  }));
  return [noneOption, ...rows];
}

/** If the current stored slug is not in the catalog, prepend it so the select stays valid. */
export function ensureSelectContainsSlug(
  options: SelectOption[],
  slug: string | undefined | null
): SelectOption[] {
  const s = slug?.trim();
  if (!s || options.some(o => o.value === s)) return options;
  return [{ text: `${s} (legacy)`, value: s }, ...options];
}
