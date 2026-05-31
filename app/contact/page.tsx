import { Suspense } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { ContactHero } from '@/components/section/public/contact/ContactHero';
import { ContactFormSection } from '@/components/section/public/contact/ContactFormSection';
import { ContactSidebarShell } from '@/components/section/public/contact/ContactSidebarShell';
import { MapSection } from '@/components/section/public/contact/MapSection';
import {
  ContactInfoDetailsSkeleton,
  SocialsLinksSkeleton,
} from '@/components/section/public/contact/ContactSectionSkeletons';
import { ContactInfoDetailsSection } from './_sections/ContactInfoDetailsSection';
import { SocialsSection } from './_sections/SocialsSection';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact Us',
  description:
    "Have a question, prayer request, or want to partner with us? Reach out and let's connect.",
};

export default function ContactPage() {
  return (
    <MainLayout>
      <ContactHero />
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-5 gap-8">
            <div className="lg:col-span-3">
              <ContactFormSection />
            </div>
            <div className="lg:col-span-2">
              <ContactSidebarShell>
                <Suspense fallback={<ContactInfoDetailsSkeleton />}>
                  <ContactInfoDetailsSection />
                </Suspense>
                <Suspense fallback={<SocialsLinksSkeleton />}>
                  <SocialsSection />
                </Suspense>
              </ContactSidebarShell>
            </div>
          </div>
        </div>
      </section>
      <MapSection />
    </MainLayout>
  );
}
