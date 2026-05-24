import { callApi } from '@/lib/services/callApi';
import type { SelectOption } from '@/lib/types/general';
import type { ArtistListItem } from '@/lib/types/community';
import type { IMarketplaceVendor } from '@/lib/constants/endpoints';

const LIST_LIMIT = '50';

/** Admin artist picker options (`value` = artist `_id`). */
export async function loadAdminArtistSelectOptions(search = ''): Promise<SelectOption[]> {
  const params = new URLSearchParams();
  params.set('page', '1');
  params.set('limit', LIST_LIMIT);
  if (search.trim()) params.set('search', search.trim());

  const res = await callApi('ADMIN_ARTISTS_LIST', {
    query: `?${params.toString()}` as `?${string}`,
  });
  if (res.type === 'error') return [];

  const artists = (res.data.artists ?? []) as ArtistListItem[];
  return artists.map(a => ({ text: a.name, value: a._id }));
}

/** Admin vendor picker options (`value` = vendor `_id`). */
export async function loadAdminVendorSelectOptions(search = ''): Promise<SelectOption[]> {
  const params = new URLSearchParams();
  params.set('page', '1');
  params.set('limit', LIST_LIMIT);
  if (search.trim()) params.set('search', search.trim());

  const res = await callApi('ADMIN_VENDORS_LIST', {
    query: `?${params.toString()}` as `?${string}`,
  });
  if (res.type === 'error') return [];

  const vendors = (res.data.vendors ?? []) as IMarketplaceVendor[];
  return vendors.map(v => ({
    text: v.storeName || v.name,
    value: v._id,
  }));
}

/** Marketplace product category options (`value` = category `_id`). */
export async function loadMarketplaceCategorySelectOptions(): Promise<SelectOption[]> {
  const res = await callApi('MARKETPLACE_GET_CATEGORIES', { query: '?page=1&limit=50' });
  if (res.type === 'error') return [];

  const categories = res.data.categories ?? [];
  return categories.map(c => ({
    text: c.name,
    value: c._id,
  }));
}
