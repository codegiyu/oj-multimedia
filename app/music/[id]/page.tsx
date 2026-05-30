import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { MainLayout } from '@/components/layout/MainLayout';
import { MusicDetailPageClient } from '@/components/section/music/MusicDetailPageClient';
import { callPublicServerApi } from '@/lib/services/serverApi';
import {
  assertCompletePublicMusic,
  filterPublicMusicList,
  mapPublicMusicToDetailItem,
} from '@/lib/utils/publicApiMappers';
import type { MusicItemWithArtist } from '@/lib/utils/music';
import { buildDetailShareMetadata } from '@/lib/utils/metadata';
import { generateMusicDetailStaticParams } from '@/lib/services/isrPrebuildParams';

export const generateStaticParams = generateMusicDetailStaticParams;

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

  const res = await callPublicServerApi('PUBLIC_GET_MUSIC_ITEM', {
    query: `/${encodeURIComponent(id)}`,
  });
  if (res.type === 'error') {
    return {
      title: 'Music Not Found',
      description: 'The requested music track could not be found.',
    };
  }

  const data = res.data;
  const musicItem = mapPublicMusicToDetailItem(data.music);
  const artistName = musicItem.artist?.name ?? 'Artist';
  const title = `${musicItem.title} by ${artistName} - Music`;
  const description =
    musicItem.description ||
    `Listen to ${musicItem.title} by ${artistName}. ${musicItem.plays || ''} plays.`;

  return buildDetailShareMetadata({
    title,
    description,
    path: `/music/${id}`,
    image: musicItem.image || musicItem.cover,
    imageAlt: musicItem.title,
    type: 'music.song',
  });
}

export default async function MusicDetailPage({ params }: MusicDetailPageProps) {
  const resolvedParams = await params;
  const id = resolvedParams.id;

  if (!id) {
    notFound();
  }

  const res = await callPublicServerApi('PUBLIC_GET_MUSIC_ITEM', {
    query: `/${encodeURIComponent(id)}`,
  });
  if (res.type === 'error') {
    notFound();
  }

  const data = res.data;
  if (!assertCompletePublicMusic(data.music)) {
    notFound();
  }

  const musicItem = mapPublicMusicToDetailItem(data.music);

  const category = musicItem.category ?? 'gospel';
  const relatedRes = await callPublicServerApi('PUBLIC_GET_MUSIC', {
    query: `?limit=4&page=1&status=published&type=recent&category=${encodeURIComponent(category)}`,
  });
  const relatedList = filterPublicMusicList(
    relatedRes.type === 'success' ? (relatedRes.data?.music ?? []) : []
  );
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
