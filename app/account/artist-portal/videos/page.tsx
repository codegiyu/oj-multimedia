import { MainLayout } from '@/components/layout/MainLayout';
import { ArtistPortalVideosPageClient } from '@/components/section/account/artist-portal/ArtistPortalVideosPageClient';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Artist Portal - Videos',
  description: 'Manage your video content.',
};

export default function ArtistPortalVideosPage() {
  return (
    <MainLayout hideHeader hideFooter>
      <ArtistPortalVideosPageClient />
    </MainLayout>
  );
}
