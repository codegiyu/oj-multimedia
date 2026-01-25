'use client';

import { ContactFormSection } from './ContactFormSection';
import { ContactInfoSection } from './ContactInfoSection';
import { MapSection } from './MapSection';

export const ContactPageClient = () => {
  return (
    <>
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-5 gap-8">
            <div className="lg:col-span-3">
              <ContactFormSection />
            </div>
            <div className="lg:col-span-2">
              <ContactInfoSection />
            </div>
          </div>
        </div>
      </section>
      <MapSection />
    </>
  );
};
