import { SectionLoadError } from '@/components/general/SectionLoadError';
import { PastorPortalStatsPanel } from '@/components/section/account/pastor-portal/PastorPortalStatsPanel';
import { getPastorDashboardStats } from '@/lib/services/pastorPortalData';
import type { IPastorDashboardStatsRes } from '@/lib/constants/endpoints';

export async function PastorPortalStatsSection() {
  const statsRes = await getPastorDashboardStats();

  if (statsRes.type === 'error') {
    return (
      <SectionLoadError
        title="Stats unavailable"
        message={statsRes.message || 'Unable to load dashboard stats.'}
      />
    );
  }

  return <PastorPortalStatsPanel stats={statsRes.data as IPastorDashboardStatsRes} />;
}
