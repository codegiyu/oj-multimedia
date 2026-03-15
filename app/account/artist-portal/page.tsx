import { Suspense } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { ArtistPortalPageClient } from '@/components/section/account/artist-portal/ArtistPortalPageClient';
import type { Metadata } from 'next';
import { callServerApi } from '@/lib/services/serverApi';
import type { ApiErrorResponse } from '@/lib/types/http';
import type { IArtistDashboardStatsRes, IArtistMeRes } from '@/lib/constants/endpoints';

export const metadata: Metadata = {
  title: 'Artist Portal',
  description: 'Manage your artist profile and content.',
};

function ArtistDashboardSkeleton() {
  return (
    <div className="max-w-5xl mx-auto py-8 space-y-4">
      <div className="h-7 w-40 rounded-md bg-muted" />
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="h-24 rounded-lg bg-muted" />
        <div className="h-24 rounded-lg bg-muted" />
        <div className="h-24 rounded-lg bg-muted" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
        <div className="h-40 rounded-lg bg-muted" />
        <div className="h-40 rounded-lg bg-muted" />
        <div className="h-40 rounded-lg bg-muted" />
      </div>
    </div>
  );
}

export default function ArtistPortalPage() {
  return (
    <MainLayout hideHeader hideFooter>
      <Suspense fallback={<ArtistDashboardSkeleton />}>
        <ArtistPortalPageClientServer />
      </Suspense>
    </MainLayout>
  );
}

async function ArtistPortalPageClientServer() {
  const meRes = await callServerApi('ARTIST_GET_ME', {});

  if (meRes.error || !meRes.data) {
    const responseCode = (meRes.error as ApiErrorResponse | undefined)?.responseCode;

    if (responseCode === 403 || responseCode === 404) {
      return (
        <ArtistPortalPageClient
          artist={null}
          stats={null}
          hasArtistProfile={false}
          errorMessage={null}
        />
      );
    }

    return (
      <ArtistPortalPageClient
        artist={null}
        stats={null}
        hasArtistProfile={true}
        errorMessage={meRes.message || 'Unable to load artist profile.'}
      />
    );
  }

  const artist: IArtistMeRes['artist'] = meRes.data.artist;
  const statsRes = await callServerApi('ARTIST_GET_DASHBOARD_STATS', {});

  const stats: IArtistDashboardStatsRes | null =
    statsRes.error || !statsRes.data ? null : (statsRes.data as IArtistDashboardStatsRes);

  return (
    <ArtistPortalPageClient
      artist={artist}
      stats={stats}
      hasArtistProfile={true}
      errorMessage={
        statsRes.error || !statsRes.data
          ? statsRes.message || 'Unable to load dashboard stats.'
          : null
      }
    />
  );
}
