import type { Metadata } from 'next';
import { PrivacyPolicyClient } from '@/components/section/privacy/PrivacyPolicyClient';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description:
    'Learn how OHEJUIRA collects, uses, stores, and protects your information when you use our platform.',
};

export default function PrivacyPolicyPage() {
  return <PrivacyPolicyClient />;
}
