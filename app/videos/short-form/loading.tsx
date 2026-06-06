import { PublicBrowseLoading } from '@/components/loading/PublicBrowseLoading';
import { VideoCategoriesSkeleton, ShortFormVideosSectionSkeleton } from '../_sections/skeletons';

export default function ShortFormVideosLoading() {
  return (
    <PublicBrowseLoading
      hero={{
        title: 'Short Form Videos',
        titleHighlight: 'Short Form',
        description:
          'Discover short form videos - quick, engaging content perfect for quick viewing. Bite-sized entertainment and inspiration.',
        badgeText: 'Quick Clips',
        badgeIcon: 'Zap',
        backUrl: '/videos',
        backLabel: 'Back to Videos',
        stats: [{ icon: 'Zap', text: 'Quick content' }, { text: 'Under 2 minutes' }],
      }}>
      <VideoCategoriesSkeleton />
      <ShortFormVideosSectionSkeleton />
    </PublicBrowseLoading>
  );
}
