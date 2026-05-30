import type { Metadata } from 'next';
import { MainLayout } from '@/components/layout/MainLayout';
import { TermsHero } from '@/components/section/public/terms/TermsHero';
import { TermsConditionsClient } from '@/components/section/public/terms/TermsConditionsClient';

export const metadata: Metadata = {
  title: 'Terms & Conditions',
  description:
    'Read the Terms & Conditions for using OHEJUIRA platform. Understand your rights and responsibilities when using our services.',
};

export default function TermsPage() {
  return (
    <MainLayout>
      <TermsHero />
      <TermsConditionsClient />
    </MainLayout>
  );
}
