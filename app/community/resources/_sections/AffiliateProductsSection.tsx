import { AffiliateProducts } from '@/components/section/community/resources/AffiliateProducts';
import { SectionLoadError } from '@/components/general/SectionLoadError';
import { callPublicServerApi } from '@/lib/services/serverApi';
import { ISR_PUBLIC_FETCH } from '@/lib/constants/isr';
import { mapToAffiliateProduct } from '@/lib/utils/communityApiMappers';
import { filterCompleteResources } from '@/lib/utils/contentCompleteness';
import type { AffiliateProduct } from '@/components/section/community/resources/ResourcesPageClient';
import { RESOURCES_BASE_QUERY } from './shared';

export async function AffiliateProductsSection() {
  const res = await callPublicServerApi(
    'PUBLIC_GET_RESOURCES',
    {
      query: `${RESOURCES_BASE_QUERY}&type=affiliate` as `?${string}`,
    },
    ISR_PUBLIC_FETCH.slow
  );

  if (res.type === 'error') {
    return (
      <SectionLoadError
        title="Affiliate products unavailable"
        message={res.error?.message ?? 'Failed to load affiliate products'}
      />
    );
  }

  const list = (res.data?.resources ?? []) as unknown as Record<string, unknown>[];
  const affiliateProducts = filterCompleteResources(list).map(i =>
    mapToAffiliateProduct(i as Record<string, unknown>)
  ) as AffiliateProduct[];

  return <AffiliateProducts products={affiliateProducts} />;
}
