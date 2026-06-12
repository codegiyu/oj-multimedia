import type { IMarketplaceVendor } from '@/lib/constants/endpoints';

/** Prefer featured stores, then fill with other active stores up to `limit`. */
export function mergeFeaturedAndFallbackVendors(
  featured: IMarketplaceVendor[],
  all: IMarketplaceVendor[],
  limit: number
): IMarketplaceVendor[] {
  const seen = new Set<string>();
  const merged: IMarketplaceVendor[] = [];

  for (const vendor of featured) {
    if (merged.length >= limit || seen.has(vendor._id)) continue;
    seen.add(vendor._id);
    merged.push(vendor);
  }

  for (const vendor of all) {
    if (merged.length >= limit || seen.has(vendor._id)) continue;
    seen.add(vendor._id);
    merged.push(vendor);
  }

  return merged;
}
