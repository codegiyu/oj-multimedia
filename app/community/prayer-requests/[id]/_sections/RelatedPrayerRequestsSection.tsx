import { SectionLoadError } from '@/components/general/SectionLoadError';
import { RelatedPrayerRequestsGrid } from '@/components/section/community/prayer-requests/RelatedPrayerRequestsGrid';
import { callPublicServerApi } from '@/lib/services/serverApi';
import { mapToPrayerRequestDetail } from '@/lib/utils/communityApiMappers';
import { buildCommunityListQuery } from '@/lib/utils/communityListQuery';

type RelatedPrayerRequestsSectionProps = {
  id: string;
  category: string;
};

export async function RelatedPrayerRequestsSection({
  id,
  category,
}: RelatedPrayerRequestsSectionProps) {
  const res = await callPublicServerApi('PUBLIC_GET_PRAYER_REQUESTS', {
    query: buildCommunityListQuery({ status: 'active', limit: 12, category }),
  });

  if (res.type === 'error') {
    return (
      <SectionLoadError
        title="Related prayer requests unavailable"
        message={res.error?.message ?? 'Failed to load related prayer requests'}
      />
    );
  }

  const requests = ((res.data?.prayerRequests ?? []) as unknown[])
    .map(i => mapToPrayerRequestDetail(i as Record<string, unknown>))
    .filter(r => r._id !== id)
    .slice(0, 3);

  return <RelatedPrayerRequestsGrid requests={requests} />;
}
