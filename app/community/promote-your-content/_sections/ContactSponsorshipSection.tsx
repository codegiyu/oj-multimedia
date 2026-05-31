import { ContactSponsorship } from '@/components/section/community/promote/ContactSponsorship';
import { SectionLoadError } from '@/components/general/SectionLoadError';
import { callPublicServerApi } from '@/lib/services/serverApi';
import {
  CONTACT_METHODS_FALLBACK,
  PARTNERSHIP_BENEFITS_FALLBACK,
  ADDITIONAL_CONTACT_FALLBACK,
} from '@/lib/constants/promotionFallbacks';
import type { ContactMethod } from '@/lib/types/promotion';

export async function ContactSponsorshipSection() {
  const res = await callPublicServerApi('PUBLIC_GET_PROMOTION_CONTACT', {});

  if (res.type === 'error') {
    return (
      <SectionLoadError
        title="Contact information unavailable"
        message={res.error?.message ?? 'Failed to load contact information'}
      />
    );
  }

  const contactMethods: ContactMethod[] = res.data?.contactMethods?.length
    ? res.data.contactMethods
    : CONTACT_METHODS_FALLBACK;
  const partnershipBenefits: string[] = res.data?.partnershipBenefits?.length
    ? res.data.partnershipBenefits
    : PARTNERSHIP_BENEFITS_FALLBACK;
  const additionalContact = res.data?.additionalContact ?? ADDITIONAL_CONTACT_FALLBACK;

  return (
    <ContactSponsorship
      contactMethods={contactMethods}
      partnershipBenefits={partnershipBenefits}
      additionalContact={additionalContact}
    />
  );
}
