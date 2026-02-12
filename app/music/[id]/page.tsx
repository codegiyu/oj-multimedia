import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { MainLayout } from '@/components/layout/MainLayout';
import { MusicDetailPageClient } from '@/components/section/music/MusicDetailPageClient';
import { getMusicItemById, getRelatedMusicItems } from '@/lib/utils/music';

interface MusicDetailPageProps {
  params: Promise<{ id: string }>;
}

// Generate metadata for the music detail page
export async function generateMetadata({ params }: MusicDetailPageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const id = resolvedParams.id;

  if (!id) {
    return {
      title: 'Music Not Found',
      description: 'The requested music track could not be found.',
    };
  }

  const musicItem = getMusicItemById(id);

  if (!musicItem) {
    return {
      title: 'Music Not Found',
      description: 'The requested music track could not be found.',
    };
  }

  const artistName = musicItem.artist.name;
  return {
    title: `${musicItem.title} by ${artistName} - Music`,
    description:
      musicItem.description ||
      `Listen to ${musicItem.title} by ${artistName}. ${musicItem.plays || ''} plays.`,
  };
}

export default async function MusicDetailPage({ params }: MusicDetailPageProps) {
  const resolvedParams = await params;
  const id = resolvedParams.id;

  // Validate ID
  if (!id) {
    notFound();
  }

  // Get music item
  const musicItem = getMusicItemById(id);

  // Return 404 if not found
  if (!musicItem) {
    notFound();
  }

  // Get related songs
  const relatedSongs = getRelatedMusicItems(id, musicItem.category, 3);

  return (
    <MainLayout>
      <MusicDetailPageClient musicItem={musicItem} relatedSongs={relatedSongs} />
    </MainLayout>
  );
}
