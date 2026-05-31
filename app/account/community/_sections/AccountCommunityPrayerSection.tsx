import { SectionLoadError } from '@/components/general/SectionLoadError';
import { AccountCommunityPrayerPanel } from '@/components/section/account/community/AccountCommunityPrayerPanel';
import { callServerApi } from '@/lib/services/serverApi';
import type { PrayerRequestDetail } from '@/lib/types/community';

export async function AccountCommunityPrayerSection() {
  const res = await callServerApi('USER_ME_COMMUNITY_PRAYER_REQUESTS', {
    query: '?limit=50' as `?${string}`,
  });

  if (res.type === 'error') {
    return (
      <SectionLoadError
        title="Prayer requests unavailable"
        message={res.message || 'Unable to load your prayer requests.'}
      />
    );
  }

  const prayerRequests = (res.data.prayerRequests as PrayerRequestDetail[]) ?? [];

  return <AccountCommunityPrayerPanel prayerRequests={prayerRequests} />;
}
