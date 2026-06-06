import { PublicBrowseLoading } from '@/components/loading/PublicBrowseLoading';
import { PrayerRequestsBrowseSkeleton } from '@/components/section/community/prayer-requests/PrayerRequestsPageSkeleton';

export default function ActivePrayerRequestsLoading() {
  return (
    <PublicBrowseLoading
      hero={{
        title: 'Active Prayer Requests',
        titleHighlight: 'Active',
        description:
          'Browse active prayer requests from our community. Join us in praying for these needs and see how God is moving.',
        badgeText: 'Join in Prayer',
        badgeIcon: 'HandHeart',
        backUrl: '/community/prayer-requests',
        backLabel: 'Back to Prayer Requests',
        stats: [{ icon: 'HandHeart', text: 'Active requests' }, { text: 'Community prayers' }],
      }}>
      <PrayerRequestsBrowseSkeleton />
    </PublicBrowseLoading>
  );
}
