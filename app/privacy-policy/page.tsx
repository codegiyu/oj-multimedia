import type { Metadata } from 'next';
import { MainLayout } from '@/components/layout/MainLayout';
import { PrivacyHero } from '@/components/section/public/privacy/PrivacyHero';
import { PrivacyPolicyClient } from '@/components/section/public/privacy/PrivacyPolicyClient';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description:
    'Learn how OHEJUIRA collects, uses, stores, and protects your information when you use our platform.',
};

export default function PrivacyPolicyPage() {
  return (
    <MainLayout>
      <PrivacyHero />
      <PrivacyPolicyClient />
    </MainLayout>
  );
}
