import { Suspense } from 'react';
import {
  ArtistPortalPageClient,
  type ArtistRecentUpload,
} from '@/components/section/account/artist-portal/ArtistPortalPageClient';
import { Skeleton } from '@/components/ui/skeleton';
import type { Metadata } from 'next';
import { callServerApi } from '@/lib/services/serverApi';
import type {
  ArtistMusicListItem,
  ArtistVideoListItem,
  IArtistDashboardStatsRes,
  IArtistMeRes,
} from '@/lib/constants/endpoints';

export const metadata: Metadata = {
  title: 'Artist Portal',
  description: 'Manage your artist profile and content.',
};

function buildArtistRecentUploads(
  music: ArtistMusicListItem[],
  videos: ArtistVideoListItem[]
): ArtistRecentUpload[] {
  const rows: ArtistRecentUpload[] = [
    ...music.map(m => ({
      kind: 'music' as const,
      _id: m._id,
      title: m.title,
      createdAt: m.createdAt,
      status: m.status,
      views: m.views,
      plays: m.plays,
    })),
    ...videos.map(v => ({
      kind: 'video' as const,
      _id: v._id,
      title: v.title,
      createdAt: v.createdAt,
      status: v.status,
      views: v.views,
    })),
  ];
  return rows
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 6);
}

function ArtistDashboardSkeleton() {
  return (
    <div className="space-y-4 py-4">
      <Skeleton className="h-10 w-64 rounded-md" />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Skeleton className="h-28 w-full rounded-xl" />
        <Skeleton className="h-28 w-full rounded-xl" />
        <Skeleton className="h-28 w-full rounded-xl" />
        <Skeleton className="h-28 w-full rounded-xl" />
      </div>
      <Skeleton className="h-64 w-full rounded-xl" />
    </div>
  );
}

export default function ArtistPortalPage() {
  return (
    <Suspense fallback={<ArtistDashboardSkeleton />}>
      <ArtistPortalPageClientServer />
    </Suspense>
  );
}

async function ArtistPortalPageClientServer() {
  const meRes = await callServerApi('ARTIST_GET_ME', {});

  if (meRes.type === 'error') {
    const responseCode = meRes.error?.responseCode;

    if (responseCode === 403 || responseCode === 404) {
      return null;
    }

    return (
      <ArtistPortalPageClient
        stats={null}
        errorMessage={meRes.message || 'Unable to load artist profile.'}
        recentUploads={[]}
        artist={null}
      />
    );
  }

  const artist: IArtistMeRes['artist'] = meRes.data.artist;
  const [statsRes, musicRes, videosRes] = await Promise.all([
    callServerApi('ARTIST_GET_DASHBOARD_STATS', {}),
    callServerApi('ARTIST_GET_MUSIC', { query: '?page=1&limit=8' }),
    callServerApi('ARTIST_GET_VIDEOS', { query: '?page=1&limit=8' }),
  ]);

  const stats: IArtistDashboardStatsRes | null = statsRes.type === 'success' ? statsRes.data : null;

  const music = musicRes.type === 'success' ? musicRes.data.music : [];
  const videos = videosRes.type === 'success' ? videosRes.data.videos : [];
  const recentUploads = buildArtistRecentUploads(music, videos);

  return (
    <ArtistPortalPageClient
      stats={stats}
      errorMessage={
        statsRes.type === 'error' ? statsRes.message || 'Unable to load dashboard stats.' : null
      }
      recentUploads={recentUploads}
      artist={artist}
    />
  );
}
