import { RecentPrayerRequestsSection } from '@/components/section/community/RecentPrayerRequestsSection';
import { SectionLoadError } from '@/components/general/SectionLoadError';
import { callPublicServerApi } from '@/lib/services/serverApi';
import { mapToPrayerRequest } from '@/lib/utils/communityApiMappers';

export async function RecentPrayerRequestsHubSection() {
  const res = await callPublicServerApi('PUBLIC_GET_COMMUNITY', {});

  if (res.type === 'error') {
    return (
      <SectionLoadError
        title="Prayer requests unavailable"
        message={res.error?.message ?? 'Failed to load recent prayer requests'}
      />
    );
  }

  const rawPrayerRequests = (res.data?.recentPrayerRequests ?? []) as unknown[];
  const prayerRequests = rawPrayerRequests.map(p =>
    mapToPrayerRequest(p as Record<string, unknown>)
  );

  return <RecentPrayerRequestsSection requests={prayerRequests} />;
}
