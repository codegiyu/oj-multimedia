import { MarketplaceSearchCategoryFilter } from '@/components/section/marketplace/MarketplaceSearchCategoryFilter';
import { SectionLoadError } from '@/components/general/SectionLoadError';
import { callPublicServerApi } from '@/lib/services/serverApi';
import { ISR_PUBLIC_FETCH } from '@/lib/constants/isr';

export async function SearchCategoryFilterSection() {
  const res = await callPublicServerApi('MARKETPLACE_GET_CATEGORIES', {}, ISR_PUBLIC_FETCH.fast);

  if (res.type === 'error') {
    return (
      <SectionLoadError
        title="Categories unavailable"
        message={res.error?.message ?? 'Failed to load categories'}
      />
    );
  }

  return <MarketplaceSearchCategoryFilter categories={res.data?.categories ?? []} />;
}
