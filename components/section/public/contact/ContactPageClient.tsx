'use client';

import { ContactFormSection } from './ContactFormSection';
import { ContactInfoSection } from './ContactInfoSection';
import { MapSection } from './MapSection';
import type { ContactInfo, Social } from '@/lib/types/site-settings';

export interface ContactPageClientProps {
  contactInfo?: ContactInfo | null;
  socials?: Social[] | null;
  contactError?: string | null;
  socialsError?: string | null;
}

export const ContactPageClient = ({
  contactInfo = null,
  socials = null,
  contactError = null,
  socialsError = null,
}: ContactPageClientProps) => {
  return (
    <>
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-5 gap-8">
            <div className="lg:col-span-3">
              <ContactFormSection />
            </div>
            <div className="lg:col-span-2">
              <ContactInfoSection
                initialContactInfo={contactInfo}
                initialSocials={socials}
                contactError={contactError}
                socialsError={socialsError}
              />
            </div>
          </div>
        </div>
      </section>
      <MapSection contactInfo={contactInfo ?? undefined} />
    </>
  );
};
