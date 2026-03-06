import { MainLayout } from '@/components/layout/MainLayout';
import { ArtistPortalPageClient } from '@/components/section/account/artist-portal/ArtistPortalPageClient';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Artist Portal',
  description: 'Manage your artist profile and content.',
};

export default function ArtistPortalPage() {
  return (
    <MainLayout hideHeader hideFooter>
      <ArtistPortalPageClient />
    </MainLayout>
  );
}
