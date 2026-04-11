import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { MainLayout } from '@/components/layout/MainLayout';
import { ArtistDetailPageClient } from '@/components/section/community/artists/ArtistDetailPageClient';
import { callServerApi } from '@/lib/services/serverApi';
import { mapPublicMusicToDetailItem } from '@/lib/utils/publicApiMappers';
import { mapPublicVideoToDetailItem } from '@/lib/utils/publicApiMappers';
import type { MusicItemWithArtist } from '@/lib/utils/music';
import type { VideoItemWithCreator } from '@/lib/utils/videos';
import type { ArtistProfile } from '@/lib/types/artist';
import type {
  IPublicMusicListRes,
  IPublicVideosListRes,
  IPublicArtistItemRes,
} from '@/lib/constants/endpoints';

interface ArtistDetailPageProps {
  params: Promise<{ id: string }>;
}

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: ArtistDetailPageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const id = resolvedParams.id;

  if (!id) {
    return {
      title: 'Artist Not Found',
      description: 'The requested artist could not be found.',
    };
  }

  const res = await callServerApi('PUBLIC_GET_ARTIST_ITEM', {
    query: `/${encodeURIComponent(id)}`,
  });
  if (res.type === 'error') {
    return {
      title: 'Artist Not Found',
      description: 'The requested artist could not be found.',
    };
  }

  const artist = (res.data as IPublicArtistItemRes).artist;
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

  const artistRes = await callServerApi('PUBLIC_GET_ARTIST_ITEM', {
    query: `/${encodeURIComponent(id)}`,
  });
  if (artistRes.type === 'error' || !artistRes.data?.artist) {
    notFound();
  }

  const apiArtist = artistRes.data.artist;
  const artistId = apiArtist._id;

  const artist: ArtistProfile = {
    _id: apiArtist._id,
    name: apiArtist.name,
    genre: apiArtist.genre,
    image: apiArtist.image ?? '',
    coverImage: apiArtist.coverImage,
    bio: apiArtist.bio,
    verified: apiArtist.verified,
    socials: apiArtist.socials,
  };

  const [musicRes, videoRes] = await Promise.all([
    callServerApi('PUBLIC_GET_MUSIC', {
      query: `?artist=${encodeURIComponent(artistId)}&status=published&page=1&limit=12`,
    }),
    callServerApi('PUBLIC_GET_VIDEOS', {
      query: `?artist=${encodeURIComponent(artistId)}&status=published&page=1&limit=12`,
    }),
  ]);

  const musicList =
    musicRes.type === 'success' ? ((musicRes.data as IPublicMusicListRes)?.music ?? []) : [];
  const videoList =
    videoRes.type === 'success' ? ((videoRes.data as IPublicVideosListRes)?.videos ?? []) : [];

  const musicItems: MusicItemWithArtist[] = musicList.map(m => mapPublicMusicToDetailItem(m));
  const videoItems: VideoItemWithCreator[] = videoList.map(
    v => mapPublicVideoToDetailItem(v) as VideoItemWithCreator
  );

  return (
    <MainLayout>
      <ArtistDetailPageClient artist={artist} musicItems={musicItems} videoItems={videoItems} />
    </MainLayout>
  );
}
