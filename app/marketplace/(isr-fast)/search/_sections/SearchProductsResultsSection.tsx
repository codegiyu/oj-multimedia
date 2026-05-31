import { MarketplaceSearchResults } from '@/components/section/marketplace/MarketplaceSearchResults';
import { SectionLoadError } from '@/components/general/SectionLoadError';
import { callPublicServerApi } from '@/lib/services/serverApi';
import { ISR_PUBLIC_FETCH } from '@/lib/constants/isr';
import {
  buildMarketplaceSearchQuery,
  type MarketplaceSearchQueryParams,
} from '../../../_sections/shared';

type SearchProductsResultsSectionProps = {
  params: MarketplaceSearchQueryParams;
};

export async function SearchProductsResultsSection({ params }: SearchProductsResultsSectionProps) {
  const queryString = buildMarketplaceSearchQuery(params);
  const res = await callPublicServerApi(
    'MARKETPLACE_GET_PRODUCTS',
    {
      query: `?${queryString}` as `?${string}`,
    },
    ISR_PUBLIC_FETCH.fast
  );

  if (res.type === 'error') {
    return (
      <SectionLoadError
        title="Search results unavailable"
        message={res.error?.message ?? 'Failed to search products'}
      />
    );
  }

  const products = res.data?.products ?? [];
  const pagination = res.data?.pagination ?? {
    page: 1,
    limit: 24,
    total: 0,
    totalPages: 0,
  };

  return (
    <MarketplaceSearchResults
      products={products}
      pagination={pagination}
      hasQuery={Boolean(params.q?.trim() || params.category || params.vendor)}
    />
  );
}
