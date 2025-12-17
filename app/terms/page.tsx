import type { Metadata } from 'next';
import { TermsConditionsClient } from '@/components/section/terms/TermsConditionsClient';

export const metadata: Metadata = {
  title: 'Terms & Conditions',
  description:
    'Read the Terms & Conditions for using OHEJUIRA platform. Understand your rights and responsibilities when using our services.',
};

export default function TermsPage() {
  return <TermsConditionsClient />;
}
