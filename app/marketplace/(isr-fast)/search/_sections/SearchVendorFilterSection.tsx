import { MarketplaceSearchVendorFilter } from '@/components/section/marketplace/MarketplaceSearchVendorFilter';
import { SectionLoadError } from '@/components/general/SectionLoadError';
import { callPublicServerApi } from '@/lib/services/serverApi';
import { ISR_PUBLIC_FETCH } from '@/lib/constants/isr';

export async function SearchVendorFilterSection() {
  const res = await callPublicServerApi(
    'MARKETPLACE_GET_VENDORS',
    { query: `?limit=100` as `?${string}` },
    ISR_PUBLIC_FETCH.fast
  );

  if (res.type === 'error') {
    return (
      <SectionLoadError
        title="Vendors unavailable"
        message={res.error?.message ?? 'Failed to load vendors'}
      />
    );
  }

  return <MarketplaceSearchVendorFilter vendors={res.data?.vendors ?? []} />;
}
