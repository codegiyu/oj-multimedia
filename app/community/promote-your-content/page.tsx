import type { Metadata } from 'next';
import { MainLayout } from '@/components/layout/MainLayout';
import { PromoteYourContentClient } from '@/components/section/community/promote/PromoteYourContentClient';

export const metadata: Metadata = {
  title: 'Promote Your Content - Reach Your Audience',
  description:
    'Promote your songs, upload sermons, get featured, and explore sponsorship opportunities. Grow your reach with our platform.',
};

export default function PromoteYourContentPage() {
  return (
    <MainLayout>
      <PromoteYourContentClient />
    </MainLayout>
  );
}
