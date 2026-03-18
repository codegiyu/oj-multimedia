import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { MainLayout } from '@/components/layout/MainLayout';
import { MusicDetailPageClient } from '@/components/section/music/MusicDetailPageClient';
import { callServerApi } from '@/lib/services/serverApi';
import { mapPublicMusicToDetailItem } from '@/lib/utils/publicApiMappers';
import type { MusicItemWithArtist } from '@/lib/utils/music';

interface MusicDetailPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: MusicDetailPageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const id = resolvedParams.id;

  if (!id) {
    return {
      title: 'Music Not Found',
      description: 'The requested music track could not be found.',
    };
  }

  const res = await callServerApi('PUBLIC_GET_MUSIC_ITEM', { query: `/${encodeURIComponent(id)}` });
  if (res.type === 'error') {
    return {
      title: 'Music Not Found',
      description: 'The requested music track could not be found.',
    };
  }

  const data = res.data;
  const musicItem = mapPublicMusicToDetailItem(data.music);
  const artistName = musicItem.artist?.name ?? 'Artist';
  return {
    title: `${musicItem.title} by ${artistName} - Music`,
    description:
      musicItem.description ||
      `Listen to ${musicItem.title} by ${artistName}. ${musicItem.plays || ''} plays.`,
  };
}

export const dynamic = 'force-dynamic';

export default async function MusicDetailPage({ params }: MusicDetailPageProps) {
  const resolvedParams = await params;
  const id = resolvedParams.id;

  if (!id) {
    notFound();
  }

  const res = await callServerApi('PUBLIC_GET_MUSIC_ITEM', { query: `/${encodeURIComponent(id)}` });
  if (res.type === 'error') {
    notFound();
  }

  const data = res.data;
  const musicItem = mapPublicMusicToDetailItem(data.music);

  const category = musicItem.category ?? 'gospel';
  const relatedRes = await callServerApi('PUBLIC_GET_MUSIC', {
    query: `?limit=4&page=1&status=published&type=recent&category=${encodeURIComponent(category)}`,
  });
  const relatedList = relatedRes.type === 'success' ? (relatedRes.data?.music ?? []) : [];
  const relatedSongs: MusicItemWithArtist[] = relatedList
    .filter(m => String(m._id) !== id)
    .slice(0, 3)
    .map(m => mapPublicMusicToDetailItem(m));

  return (
    <MainLayout>
      <MusicDetailPageClient musicItem={musicItem} relatedSongs={relatedSongs} />
    </MainLayout>
  );
}
