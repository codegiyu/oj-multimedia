import type { Metadata } from 'next';
import { MainLayout } from '@/components/layout/MainLayout';
import { PromoteYourContentClient } from '@/components/section/community/promote/PromoteYourContentClient';
import { callPublicServerApi } from '@/lib/services/serverApi';
import {
  FEATURED_OPTIONS_FALLBACK,
  PRICING_OPTIONS_FALLBACK,
  CONTACT_METHODS_FALLBACK,
  PARTNERSHIP_BENEFITS_FALLBACK,
  ADDITIONAL_CONTACT_FALLBACK,
} from '@/lib/constants/promotionFallbacks';
import type { FeaturedOption, PromotionPricingOption, ContactMethod } from '@/lib/types/promotion';

export const metadata: Metadata = {
  title: 'Promote Your Content - Reach Your Audience',
  description:
    'Promote your songs and ministry, get featured, and explore sponsorship opportunities. Content publishing is curated by our team—contact us to submit material for review.',
};


async function fetchPromotionData() {
  const [featuredRes, pricingRes, contactRes] = await Promise.all([
    callPublicServerApi('PUBLIC_GET_FEATURED_OPTIONS', {}),
    callPublicServerApi('PUBLIC_GET_PROMOTION_PRICING_OPTIONS', {}),
    callPublicServerApi('PUBLIC_GET_PROMOTION_CONTACT', {}),
  ]);

  const featuredOptions: FeaturedOption[] =
    featuredRes.type === 'success' && featuredRes.data?.featuredOptions?.length
      ? featuredRes.data.featuredOptions
      : FEATURED_OPTIONS_FALLBACK;

  const pricingOptions: PromotionPricingOption[] =
    pricingRes.type === 'success' && pricingRes.data?.pricingOptions?.length
      ? pricingRes.data.pricingOptions
      : PRICING_OPTIONS_FALLBACK;

  const contactMethods: ContactMethod[] =
    contactRes.type === 'success' && contactRes.data?.contactMethods?.length
      ? contactRes.data.contactMethods
      : CONTACT_METHODS_FALLBACK;

  const partnershipBenefits: string[] =
    contactRes.type === 'success' && contactRes.data?.partnershipBenefits?.length
      ? contactRes.data.partnershipBenefits
      : PARTNERSHIP_BENEFITS_FALLBACK;

  const additionalContact: string | undefined =
    contactRes.type === 'success' && contactRes.data?.additionalContact
      ? contactRes.data.additionalContact
      : ADDITIONAL_CONTACT_FALLBACK;

  return {
    featuredOptions,
    pricingOptions,
    contactMethods,
    partnershipBenefits,
    additionalContact,
  };
}

export default async function PromoteYourContentPage() {
  const promotionData = await fetchPromotionData();

  return (
    <MainLayout>
      <PromoteYourContentClient {...promotionData} />
    </MainLayout>
  );
}
