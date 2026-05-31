import { SectionLoadError } from '@/components/general/SectionLoadError';
import { ArtistPortalStatsPanel } from '@/components/section/account/artist-portal/ArtistPortalStatsPanel';
import { callServerApi } from '@/lib/services/serverApi';
import type { IArtistDashboardStatsRes } from '@/lib/constants/endpoints';

export async function ArtistPortalStatsSection() {
  const statsRes = await callServerApi('ARTIST_GET_DASHBOARD_STATS', {});

  if (statsRes.type === 'error') {
    return (
      <SectionLoadError
        title="Stats unavailable"
        message={statsRes.message || 'Unable to load dashboard stats.'}
      />
    );
  }

  const stats = statsRes.data as IArtistDashboardStatsRes;

  return <ArtistPortalStatsPanel stats={stats} />;
}
