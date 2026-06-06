import { MainLayout } from '@/components/layout/MainLayout';
import { ContactHero } from '@/components/section/public/contact/ContactHero';
import { ContactFormSection } from '@/components/section/public/contact/ContactFormSection';
import { ContactSidebarShell } from '@/components/section/public/contact/ContactSidebarShell';
import { MapSection } from '@/components/section/public/contact/MapSection';
import {
  ContactInfoDetailsSkeleton,
  SocialsLinksSkeleton,
} from '@/components/section/public/contact/ContactSectionSkeletons';

export default function ContactLoading() {
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
                <ContactInfoDetailsSkeleton />
                <SocialsLinksSkeleton />
              </ContactSidebarShell>
            </div>
          </div>
        </div>
      </section>
      <MapSection />
    </MainLayout>
  );
}
