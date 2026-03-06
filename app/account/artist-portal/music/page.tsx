import { MainLayout } from '@/components/layout/MainLayout';
import { ArtistPortalMusicPageClient } from '@/components/section/account/artist-portal/ArtistPortalMusicPageClient';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Artist Portal - Music',
  description: 'Manage your music releases and tracks.',
};

export default function ArtistPortalMusicPage() {
  return (
    <MainLayout hideHeader hideFooter>
      <ArtistPortalMusicPageClient />
    </MainLayout>
  );
}
