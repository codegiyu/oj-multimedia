'use client';

import { ContactSidebarShell } from './ContactSidebarShell';
import { ContactInfoDetails } from './ContactInfoDetails';
import { SocialsLinks } from './SocialsLinks';
import type { ContactInfo, Social } from '@/lib/types/site-settings';

export interface ContactInfoSectionProps {
  initialContactInfo?: ContactInfo | null;
  initialSocials?: Social[] | null;
  contactError?: string | null;
  socialsError?: string | null;
  /** @deprecated Use contactError */
  errorMessage?: string | null;
}

export const ContactInfoSection = ({
  initialContactInfo,
  initialSocials,
  contactError,
  socialsError,
  errorMessage,
}: ContactInfoSectionProps = {}) => {
  const resolvedContactError = contactError ?? errorMessage ?? null;

  return (
    <ContactSidebarShell>
      <ContactInfoDetails
        initialContactInfo={initialContactInfo}
        errorMessage={resolvedContactError}
      />
      <SocialsLinks initialSocials={initialSocials} errorMessage={socialsError} />
    </ContactSidebarShell>
  );
};
