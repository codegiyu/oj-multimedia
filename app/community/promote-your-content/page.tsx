import type { Metadata } from 'next';
import { PromoteYourContentClient } from '@/components/section/promote/new/PromoteYourContentClient';

export const metadata: Metadata = {
  title: 'Promote Your Content - Reach Your Audience',
  description:
    'Promote your songs, upload sermons, get featured, and explore sponsorship opportunities. Grow your reach with our platform.',
};

export default function PromoteYourContentPage() {
  return <PromoteYourContentClient />;
}
