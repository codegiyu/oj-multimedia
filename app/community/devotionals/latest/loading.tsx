import { PublicBrowseLoading } from '@/components/loading/PublicBrowseLoading';
import {
  DevotionalsBrowseSkeleton,
  DevotionalsCategoryFilterSkeleton,
} from '@/components/section/community/devotionals/DevotionalsPageSkeleton';

export default function LatestDevotionalsLoading() {
  return (
    <PublicBrowseLoading
      hero={{
        title: 'Latest Devotionals',
        titleHighlight: 'Latest',
        description:
          'Stay up to date with the most recent daily devotionals. Fresh inspiration delivered daily.',
        badgeText: 'Daily Updates',
        badgeIcon: 'BookOpen',
        backUrl: '/community/devotionals',
        backLabel: 'Back to Devotionals',
        stats: [{ icon: 'BookOpen', text: 'Updated daily' }, { text: 'Fresh content' }],
      }}>
      <div className="container mx-auto px-4 pb-16">
        <DevotionalsCategoryFilterSkeleton />
        <DevotionalsBrowseSkeleton />
      </div>
    </PublicBrowseLoading>
  );
}
