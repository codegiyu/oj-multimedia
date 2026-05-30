import type { Metadata } from 'next';
import { Suspense } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { SubPageHero } from '@/components/general/SubPageHero';
import { AlbumsListPageClient } from '@/components/section/music/AlbumsListPageClient';
import { MusicAlbumsPageSkeleton } from '@/components/section/music/MusicPageSkeleton';
import { callPublicServerApi } from '@/lib/services/serverApi';
import { filterPublicAlbumList, mapPublicAlbumToCard } from '@/lib/utils/publicApiMappers';
import type { IPublicAlbumsListRes } from '@/lib/constants/endpoints';

export const metadata: Metadata = {
  title: 'Albums - Full Releases',
  description: 'Browse published albums and discover complete collections from gospel artists.',
};

async function fetchAlbums() {
  const res = await callPublicServerApi('PUBLIC_GET_ALBUMS', {
    query: '?limit=48&page=1',
  });

  if (res.type === 'error') {
    return {
      albums: [],
      initialErrorMessage: res.error?.message ?? 'Failed to load albums',
    };
  }

  const list = filterPublicAlbumList((res.data as IPublicAlbumsListRes)?.albums ?? []);
  return {
    albums: list.map(mapPublicAlbumToCard),
    initialErrorMessage: null as string | null,
  };
}

export default function AlbumsListPage() {
  return (
    <MainLayout>
      <SubPageHero
        title="Albums"
        titleHighlight="Albums"
        description="Explore full album releases from artists on OJ Multimedia."
        badgeText="Collections"
        badgeIcon="DiscAlbum"
        backUrl="/music"
        backLabel="Back to Music"
        stats={[{ text: 'Curated releases' }, { text: 'Updated regularly' }]}
      />
      <Suspense fallback={<MusicAlbumsPageSkeleton />}>
        <AlbumsListServer />
      </Suspense>
    </MainLayout>
  );
}

async function AlbumsListServer() {
  const data = await fetchAlbums();
  return <AlbumsListPageClient {...data} />;
}
