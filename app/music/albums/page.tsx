import type { Metadata } from 'next';
import { Suspense } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { SubPageHero } from '@/components/general/SubPageHero';
import { AlbumsListPageClient } from '@/components/section/music/AlbumsListPageClient';
import { MusicAlbumsPageSkeleton } from '@/components/section/music/MusicPageSkeleton';
import { callPublicServerApi } from '@/lib/services/serverApi';
import { filterPublicAlbumList, mapPublicAlbumToCard } from '@/lib/utils/publicApiMappers';
import type { IPublicAlbumsListRes } from '@/lib/constants/endpoints';
import { BROWSE_LIST_PAGE_SIZE } from '@/lib/constants/browseList';
import { parseBrowsePageParam } from '@/lib/utils/browsePage';

export const metadata: Metadata = {
  title: 'Albums - Full Releases',
  description: 'Browse published albums and discover complete collections from gospel artists.',
};

interface AlbumsListPageProps {
  searchParams: Promise<{ page?: string }>;
}

async function fetchAlbums(page: number) {
  const res = await callPublicServerApi('PUBLIC_GET_ALBUMS', {
    query: `?limit=${BROWSE_LIST_PAGE_SIZE}&page=${page}`,
  });

  if (res.type === 'error') {
    return {
      albums: [],
      pagination: null,
      initialErrorMessage: res.error?.message ?? 'Failed to load albums',
    };
  }

  const list = filterPublicAlbumList((res.data as IPublicAlbumsListRes)?.albums ?? []);

  return {
    albums: list.map(mapPublicAlbumToCard),
    pagination: res.data?.pagination ?? null,
    initialErrorMessage: null as string | null,
  };
}

export default async function AlbumsListPage({ searchParams }: AlbumsListPageProps) {
  const params = await searchParams;
  const page = parseBrowsePageParam(params.page);

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
      <Suspense fallback={<MusicAlbumsPageSkeleton />} key={String(page)}>
        <AlbumsListServer page={page} />
      </Suspense>
    </MainLayout>
  );
}

async function AlbumsListServer({ page }: { page: number }) {
  const data = await fetchAlbums(page);

  return <AlbumsListPageClient {...data} />;
}
