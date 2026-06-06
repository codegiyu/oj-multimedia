import { PublicBrowseLoading } from '@/components/loading/PublicBrowseLoading';
import {
  MusicCategoriesSkeleton,
  TopChartsSectionSkeleton,
} from '@/components/section/music/skeletons';

export default function TopChartsLoading() {
  return (
    <PublicBrowseLoading
      hero={{
        title: 'Top Charts',
        titleHighlight: 'Top',
        description:
          'View the top music charts across all genres. See what songs are ranking highest this week, month, or all-time.',
        badgeText: 'Charts',
        badgeIcon: 'Trophy',
        backUrl: '/music',
        backLabel: 'Back to Music',
        stats: [{ icon: 'Trophy', text: 'Top rankings' }, { text: 'Weekly updates' }],
      }}>
      <MusicCategoriesSkeleton />
      <TopChartsSectionSkeleton showFooterButton={false} />
    </PublicBrowseLoading>
  );
}
