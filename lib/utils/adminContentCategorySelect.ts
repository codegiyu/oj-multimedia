import type { IContentCategoryItem } from '@/lib/constants/endpoints';
import type { SelectOption } from '@/lib/types/general';
import { getAdminCategorySelectOptions } from '@/lib/hooks/useContentCategoryOptions';

export type AdminContentCategoryScope = IContentCategoryItem['scope'];

const noneOption: SelectOption = { text: 'None', value: '' };

/**
 * Loads admin content categories for a scope (music, video, news, devotional)
 * and returns select options (slug = value), with an empty "None" first row.
 */
export async function loadAdminContentCategorySelectOptions(
  scope: AdminContentCategoryScope
): Promise<SelectOption[]> {
  const rows = await getAdminCategorySelectOptions(scope);
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
