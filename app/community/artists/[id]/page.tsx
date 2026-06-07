import type { Metadata } from 'next';
import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { MainLayout } from '@/components/layout/MainLayout';
import { ArtistDetailPageClient } from '@/components/section/community/artists/ArtistDetailPageClient';
import { callPublicServerApi } from '@/lib/services/serverApi';
import type { ArtistProfile } from '@/lib/types/artist';
import type { IPublicArtistItemRes } from '@/lib/constants/endpoints';
import { buildDetailShareMetadata } from '@/lib/utils/metadata';
import { mapToArtistProfile } from '@/lib/utils/communityApiMappers';
import { ArtistAlbumsSection } from './_sections/ArtistAlbumsSection';
import { ArtistMusicSection } from './_sections/ArtistMusicSection';
import { ArtistVideosSection } from './_sections/ArtistVideosSection';
import {
  ArtistAlbumsSectionSkeleton,
  ArtistCatalogSectionSkeleton,
  ArtistVideosSectionSkeleton,
} from './_sections/skeletons';

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

  const res = await callPublicServerApi('PUBLIC_GET_ARTIST_ITEM', {
    query: `/${encodeURIComponent(id)}`,
  });
  if (res.type === 'error') {
    return {
      title: 'Artist Not Found',
      description: 'The requested artist could not be found.',
    };
  }

  const artist = (res.data as IPublicArtistItemRes).artist;
  const title = `${artist.name} - Artist Profile`;
  const description =
    artist.bio?.substring(0, 160) ?? `Discover music and videos by ${artist.name}.`;

  return buildDetailShareMetadata({
    title,
    description,
    path: `/community/artists/${id}`,
    image: artist.coverImage ?? artist.image,
    imageAlt: artist.name,
  });
}

export default async function ArtistDetailPage({ params }: ArtistDetailPageProps) {
  const resolvedParams = await params;
  const id = resolvedParams.id;

  if (!id) {
    notFound();
  }

  const artistRes = await callPublicServerApi('PUBLIC_GET_ARTIST_ITEM', {
    query: `/${encodeURIComponent(id)}`,
  });
  if (artistRes.type === 'error' || !artistRes.data?.artist) {
    notFound();
  }

  const apiArtist = artistRes.data.artist;
  const artistId = apiArtist._id;
  const artist: ArtistProfile = mapToArtistProfile(apiArtist as unknown as Record<string, unknown>);

  return (
    <MainLayout>
      <ArtistDetailPageClient
        artist={artist}
        albumsSlot={
          <Suspense fallback={<ArtistAlbumsSectionSkeleton />}>
            <ArtistAlbumsSection artistId={artistId} />
          </Suspense>
        }
        musicSlot={
          <Suspense fallback={<ArtistCatalogSectionSkeleton />}>
            <ArtistMusicSection artistId={artistId} />
          </Suspense>
        }
        videosSlot={
          <Suspense fallback={<ArtistVideosSectionSkeleton />}>
            <ArtistVideosSection artistId={artistId} />
          </Suspense>
        }
      />
    </MainLayout>
  );
}
