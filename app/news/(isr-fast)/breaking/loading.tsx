import { PublicBrowseLoading } from '@/components/loading/PublicBrowseLoading';
import { NewsCategoriesSkeleton, NewsSubpageGridSkeleton } from '../../_sections/skeletons';

export default function BreakingNewsLoading() {
  return (
    <PublicBrowseLoading
      hero={{
        title: 'Breaking News',
        titleHighlight: 'Breaking',
        description:
          'Urgent and high-priority stories from the past week — ministry announcements, major events, and time-sensitive updates.',
        badgeText: 'Urgent',
        badgeIcon: 'Flame',
        backUrl: '/news',
        backLabel: 'Back to News',
        stats: [{ icon: 'Flame', text: 'Priority 4–5' }, { text: 'Updated weekly' }],
      }}>
      <NewsCategoriesSkeleton />
      <NewsSubpageGridSkeleton />
    </PublicBrowseLoading>
  );
}
