import type { Metadata } from 'next';
import { PromotePageClient } from '@/components/section/promote/PromotePageClient';

export const metadata: Metadata = {
  title: 'Promote Your Music & Sermons',
  description:
    'Submit your music or sermon for promotion, get featured, and contact for sponsorship.',
};

export default function PromotePage() {
  return <PromotePageClient />;
}
