import { PublicBrowseLoading } from '@/components/loading/PublicBrowseLoading';
import { PrayerRequestsBrowseSkeleton } from '@/components/section/community/prayer-requests/PrayerRequestsPageSkeleton';

export default function AnsweredPrayersLoading() {
  return (
    <PublicBrowseLoading
      hero={{
        title: 'Answered Prayers',
        titleHighlight: 'Answered',
        description:
          "Read testimonies of answered prayers. See how God has moved in response to our community's prayers.",
        badgeText: 'Praise Reports',
        badgeIcon: 'CheckCircle',
        backUrl: '/community/prayer-requests',
        backLabel: 'Back to Prayer Requests',
        stats: [{ icon: 'CheckCircle', text: 'Prayers answered' }, { text: 'God is faithful' }],
      }}>
      <PrayerRequestsBrowseSkeleton />
    </PublicBrowseLoading>
  );
}
