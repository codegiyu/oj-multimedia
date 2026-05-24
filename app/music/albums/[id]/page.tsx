import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { MainLayout } from '@/components/layout/MainLayout';
import { AlbumDetailPageClient } from '@/components/section/music/AlbumDetailPageClient';
import { callPublicServerApi } from '@/lib/services/serverApi';
import { mapPublicAlbumToCard } from '@/lib/utils/publicApiMappers';
import type { IPublicAlbumItemRes } from '@/lib/constants/endpoints';

interface AlbumDetailPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: AlbumDetailPageProps): Promise<Metadata> {
  const { id } = await params;
  if (!id) {
    return { title: 'Album Not Found' };
  }

  const res = await callPublicServerApi('PUBLIC_GET_ALBUM_ITEM', {
    query: `/${encodeURIComponent(id)}`,
  });

  if (res.type === 'error' || !res.data?.album) {
    return { title: 'Album Not Found' };
  }

  const album = res.data.album;
  const artistName =
    typeof album.artist === 'string' ? album.artist : (album.artist?.name ?? 'Artist');

  return {
    title: `${album.title} by ${artistName} - Album`,
    description: album.excerpt ?? album.description ?? `Listen to ${album.title} on OJ Multimedia.`,
  };
}

export default async function AlbumDetailPage({ params }: AlbumDetailPageProps) {
  const { id } = await params;
  if (!id) notFound();

  const res = await callPublicServerApi('PUBLIC_GET_ALBUM_ITEM', {
    query: `/${encodeURIComponent(id)}`,
  });

  if (res.type === 'error' || !res.data?.album) {
    notFound();
  }

  const data = res.data as IPublicAlbumItemRes;
  const album = {
    ...mapPublicAlbumToCard(data.album),
    description: data.album.description,
  };

  return (
    <MainLayout>
      <AlbumDetailPageClient album={album} tracks={data.tracks ?? []} />
    </MainLayout>
  );
}
