import { describe, expect, it } from 'vitest';
import { mergeFeaturedAndFallbackVendors } from '@/lib/utils/marketplaceVendorsStrip';
import type { IMarketplaceVendor } from '@/lib/constants/endpoints';

function vendor(id: string, featured = false): IMarketplaceVendor {
  return {
    _id: id,
    name: id,
    slug: id,
    storeName: id,
    status: 'active',
    isVerified: false,
    isFeatured: featured,
  };
}

describe('mergeFeaturedAndFallbackVendors', () => {
  it('returns featured vendors first then fills from all list', () => {
    const featured = [vendor('a', true)];
    const all = [vendor('a', true), vendor('b'), vendor('c')];

    const merged = mergeFeaturedAndFallbackVendors(featured, all, 3);

    expect(merged.map(v => v._id)).toEqual(['a', 'b', 'c']);
  });

  it('dedupes by vendor id', () => {
    const featured = [vendor('a', true)];
    const all = [vendor('a', true), vendor('b')];

    const merged = mergeFeaturedAndFallbackVendors(featured, all, 2);

    expect(merged).toHaveLength(2);
    expect(merged.map(v => v._id)).toEqual(['a', 'b']);
  });
});
