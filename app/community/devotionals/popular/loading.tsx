import { PublicBrowseLoading } from '@/components/loading/PublicBrowseLoading';
import {
  DevotionalsBrowseSkeleton,
  DevotionalsCategoryFilterSkeleton,
} from '@/components/section/community/devotionals/DevotionalsPageSkeleton';

export default function PopularDevotionalsLoading() {
  return (
    <PublicBrowseLoading
      hero={{
        title: 'Popular Devotionals',
        titleHighlight: 'Popular',
        description:
          'Discover the most popular and widely read devotionals in our community. These are the devotionals that have touched the most hearts.',
        badgeText: 'Most Read',
        badgeIcon: 'TrendingUp',
        backUrl: '/community/devotionals',
        backLabel: 'Back to Devotionals',
        stats: [{ icon: 'TrendingUp', text: 'Most popular' }, { text: 'Community favorites' }],
      }}>
      <div className="container mx-auto px-4 pb-16">
        <DevotionalsCategoryFilterSkeleton />
        <DevotionalsBrowseSkeleton />
      </div>
    </PublicBrowseLoading>
  );
}
