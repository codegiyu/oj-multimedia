import { MainLayout } from '@/components/layout/MainLayout';
import { ContactHero } from '@/components/section/public/contact/ContactHero';
import { ContactPageSkeleton } from '@/components/section/public/contact';

export default function ContactLoading() {
  return (
    <MainLayout>
      <ContactHero />
      <ContactPageSkeleton />
    </MainLayout>
  );
}
