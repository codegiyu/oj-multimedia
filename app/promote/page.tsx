import type { Metadata } from 'next';
import { PromotePageClient } from '@/components/section/promote/PromotePageClient';

export const metadata: Metadata = {
  title: 'Pricing - Promote Your Music & Sermons',
  description:
    'View OHEJUIRA pricing for music uploads, sermon uploads, promotions, and vendor marketplace. Some prices can be negotiated. Contact us for more information.',
};

export default function PromotePage() {
  return <PromotePageClient />;
}
