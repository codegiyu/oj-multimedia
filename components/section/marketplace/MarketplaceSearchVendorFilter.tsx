'use client';

import { useRouter } from 'next/navigation';
import { useQueryState, parseAsString } from 'nuqs';
import type { IMarketplaceVendor } from '@/lib/constants/endpoints';

const FILTER_ALL = '__all__';

function filterValueFromSelect(raw: string) {
  return raw === FILTER_ALL ? '' : raw;
}

type MarketplaceSearchVendorFilterProps = {
  vendors: IMarketplaceVendor[];
};

export function MarketplaceSearchVendorFilter({ vendors }: MarketplaceSearchVendorFilterProps) {
  const router = useRouter();
  const [vendor, setVendor] = useQueryState('vendor', parseAsString.withDefault(''));

  const handleVendorChange = (value: string) => {
    const next = filterValueFromSelect(value);
    void setVendor(next || null).then(() => router.refresh());
  };

  return (
    <>
      <label htmlFor="mp-vendor" className="text-sm text-muted-foreground">
        Vendor:
      </label>
      <select
        id="mp-vendor"
        value={vendor || FILTER_ALL}
        onChange={e => handleVendorChange(e.target.value)}
        className="rounded-md border border-input bg-background px-3 py-2 text-sm">
        <option key={`vendor-${FILTER_ALL}`} value={FILTER_ALL}>
          All vendors
        </option>
        {vendors.map(v => (
          <option key={v._id} value={v.slug}>
            {v.storeName}
          </option>
        ))}
      </select>
    </>
  );
}
