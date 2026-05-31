import { MarketplaceProductsResults } from '@/components/section/marketplace/MarketplaceProductsResults';
import { SectionLoadError } from '@/components/general/SectionLoadError';
import { callPublicServerApi } from '@/lib/services/serverApi';
import { ISR_PUBLIC_FETCH } from '@/lib/constants/isr';
import {
  buildMarketplaceProductsQuery,
  type MarketplaceProductsQueryParams,
} from '../../_sections/shared';

type ProductsGridSectionProps = {
  params: MarketplaceProductsQueryParams;
  categoryLabel?: string;
};

export async function ProductsGridSection({ params, categoryLabel }: ProductsGridSectionProps) {
  const queryString = buildMarketplaceProductsQuery(params);
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
        title="Products unavailable"
        message={res.error?.message ?? 'Failed to load products'}
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
    <MarketplaceProductsResults
      products={products}
      pagination={pagination}
      categoryLabel={categoryLabel}
      activeCategorySlug={params.category}
      initialSort={params.sort ?? 'recent'}
    />
  );
}
