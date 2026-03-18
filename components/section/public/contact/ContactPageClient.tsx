'use client';

import { ContactFormSection } from './ContactFormSection';
import { ContactInfoSection } from './ContactInfoSection';
import { MapSection } from './MapSection';
import type { ContactInfo, Social } from '@/lib/types/site-settings';

export interface ContactPageClientProps {
  contactInfo?: ContactInfo | null;
  socials?: Social[] | null;
  contactError?: string | null;
}

export const ContactPageClient = ({
  contactInfo = null,
  socials = null,
  contactError = null,
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
                errorMessage={contactError}
              />
            </div>
          </div>
        </div>
      </section>
      <MapSection contactInfo={contactInfo ?? undefined} />
    </>
  );
};
