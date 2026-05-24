import { Suspense } from 'react';
import type { Metadata } from 'next';
import { Skeleton } from '@/components/ui/skeleton';
import { ArtistPortalAlbumsPageClient } from '@/components/section/account/artist-portal/ArtistPortalAlbumsPageClient';
import { callServerApi, callPublicServerApi } from '@/lib/services/serverApi';
import { filterPublicAlbumList, mapPublicAlbumToCard } from '@/lib/utils/publicApiMappers';
import type { IPublicAlbumsListRes } from '@/lib/constants/endpoints';
import type { ApiErrorResponse } from '@/lib/types/http';

export const metadata: Metadata = {
  title: 'Artist Portal - Albums',
  description: 'View your albums and request changes via WhatsApp.',
};

function AlbumsPageSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-8 w-48 rounded-md" />
      <Skeleton className="h-10 w-40 rounded-md" />
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <Skeleton className="aspect-square rounded-2xl" />
        <Skeleton className="aspect-square rounded-2xl" />
      </div>
    </div>
  );
}

export default function ArtistPortalAlbumsPage() {
  return (
    <Suspense fallback={<AlbumsPageSkeleton />}>
      <ArtistPortalAlbumsPageServer />
    </Suspense>
  );
}

async function ArtistPortalAlbumsPageServer() {
  const meRes = await callServerApi('ARTIST_GET_ME', {});

  if (meRes.type === 'error' || !meRes.data?.artist) {
    const responseCode = (meRes.error as ApiErrorResponse | undefined)?.responseCode;

    if (responseCode === 403 || responseCode === 404) {
      return null;
    }

    return (
      <ArtistPortalAlbumsPageClient
        albums={[]}
        artistName="Artist"
        artistId=""
        initialErrorMessage={meRes.message ?? 'Unable to load your artist profile.'}
      />
    );
  }

  const artist = meRes.data.artist;
  const artistId = String(artist._id);
  const artistName = artist.name ?? 'Artist';

  const albumsRes = await callPublicServerApi('PUBLIC_GET_ALBUMS', {
    query: `?artist=${encodeURIComponent(artistId)}&limit=100&status=published`,
  });

  const albums =
    albumsRes.type === 'success'
      ? filterPublicAlbumList((albumsRes.data as IPublicAlbumsListRes)?.albums ?? []).map(
          mapPublicAlbumToCard
        )
      : [];

  const loadError =
    albumsRes.type === 'error' ? (albumsRes.message ?? 'Unable to load albums.') : null;

  return (
    <ArtistPortalAlbumsPageClient
      albums={albums}
      artistName={artistName}
      artistId={artistId}
      initialErrorMessage={loadError}
    />
  );
}
