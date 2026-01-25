import { MainLayout } from '@/components/layout/MainLayout';
import { ContactHero } from '@/components/section/public/contact/ContactHero';
import { ContactPageClient } from '@/components/section/public/contact';
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
      <ContactPageClient />
    </MainLayout>
  );
}
