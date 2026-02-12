import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { MainLayout } from '@/components/layout/MainLayout';
import { ArtistDetailPageClient } from '@/components/section/community/artists/ArtistDetailPageClient';
import {
  getArtistById,
  getMusicByArtistId,
  getVideosByArtistId,
} from '@/lib/utils/community/artists';

interface ArtistDetailPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: ArtistDetailPageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const id = resolvedParams.id;

  if (!id) {
    return {
      title: 'Artist Not Found',
      description: 'The requested artist could not be found.',
    };
  }

  const artist = getArtistById(id);

  if (!artist) {
    return {
      title: 'Artist Not Found',
      description: 'The requested artist could not be found.',
    };
  }

  return {
    title: `${artist.name} - Artist Profile`,
    description: artist.bio?.substring(0, 160) ?? `Discover music and videos by ${artist.name}.`,
  };
}

export default async function ArtistDetailPage({ params }: ArtistDetailPageProps) {
  const resolvedParams = await params;
  const id = resolvedParams.id;

  if (!id) {
    notFound();
  }

  const artist = getArtistById(id);

  if (!artist) {
    notFound();
  }

  const musicItems = getMusicByArtistId(id, 12);
  const videoItems = getVideosByArtistId(id, 12);

  return (
    <MainLayout>
      <ArtistDetailPageClient artist={artist} musicItems={musicItems} videoItems={videoItems} />
    </MainLayout>
  );
}
