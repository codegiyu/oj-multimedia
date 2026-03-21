'use client';

import { HeroSection } from './HeroSection';
import { PromoteYourSong } from './PromoteYourSong';
import { GetFeatured } from './GetFeatured';
import { ContactSponsorship } from './ContactSponsorship';
import type { FeaturedOption, PromotionPricingOption, ContactMethod } from '@/lib/types/promotion';

export interface PromoteYourContentClientProps {
  featuredOptions: FeaturedOption[];
  pricingOptions: PromotionPricingOption[];
  contactMethods: ContactMethod[];
  partnershipBenefits: string[];
  additionalContact?: string;
}

export const PromoteYourContentClient = ({
  featuredOptions,
  pricingOptions,
  contactMethods,
  partnershipBenefits,
  additionalContact,
}: PromoteYourContentClientProps) => {
  return (
    <>
      <HeroSection />
      <div className="container mx-auto px-4 pb-16">
        <PromoteYourSong pricingOptions={pricingOptions} />
        <GetFeatured featuredOptions={featuredOptions} />
        <ContactSponsorship
          contactMethods={contactMethods}
          partnershipBenefits={partnershipBenefits}
          additionalContact={additionalContact}
        />
      </div>
    </>
  );
};
