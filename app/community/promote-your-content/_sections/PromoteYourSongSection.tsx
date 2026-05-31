import { PromoteYourSong } from '@/components/section/community/promote/PromoteYourSong';
import { SectionLoadError } from '@/components/general/SectionLoadError';
import { callPublicServerApi } from '@/lib/services/serverApi';
import { PRICING_OPTIONS_FALLBACK } from '@/lib/constants/promotionFallbacks';
import type { PromotionPricingOption } from '@/lib/types/promotion';

export async function PromoteYourSongSection() {
  const res = await callPublicServerApi('PUBLIC_GET_PROMOTION_PRICING_OPTIONS', {});

  if (res.type === 'error') {
    return (
      <SectionLoadError
        title="Pricing options unavailable"
        message={res.error?.message ?? 'Failed to load pricing options'}
      />
    );
  }

  const pricingOptions: PromotionPricingOption[] = res.data?.pricingOptions?.length
    ? res.data.pricingOptions
    : PRICING_OPTIONS_FALLBACK;

  return <PromoteYourSong pricingOptions={pricingOptions} />;
}
