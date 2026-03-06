import { MainLayout } from '@/components/layout/MainLayout';
import { ArtistPortalUploadPageClient } from '@/components/section/account/artist-portal/ArtistPortalUploadPageClient';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Artist Portal - Upload',
  description: 'Upload new music and video content.',
};

export default function ArtistPortalUploadPage() {
  return (
    <MainLayout hideHeader hideFooter>
      <ArtistPortalUploadPageClient />
    </MainLayout>
  );
}
