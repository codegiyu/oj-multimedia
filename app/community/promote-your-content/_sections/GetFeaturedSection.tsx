import { GetFeatured } from '@/components/section/community/promote/GetFeatured';
import { SectionLoadError } from '@/components/general/SectionLoadError';
import { callPublicServerApi } from '@/lib/services/serverApi';
import { FEATURED_OPTIONS_FALLBACK } from '@/lib/constants/promotionFallbacks';
import type { FeaturedOption } from '@/lib/types/promotion';

export async function GetFeaturedSection() {
  const res = await callPublicServerApi('PUBLIC_GET_FEATURED_OPTIONS', {});

  if (res.type === 'error') {
    return (
      <SectionLoadError
        title="Featured options unavailable"
        message={res.error?.message ?? 'Failed to load featured options'}
      />
    );
  }

  const featuredOptions: FeaturedOption[] = res.data?.featuredOptions?.length
    ? res.data.featuredOptions
    : FEATURED_OPTIONS_FALLBACK;

  return <GetFeatured featuredOptions={featuredOptions} />;
}
