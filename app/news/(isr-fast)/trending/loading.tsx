import { PublicBrowseLoading } from '@/components/loading/PublicBrowseLoading';
import { NewsCategoriesSkeleton, NewsSubpageGridSkeleton } from '../../_sections/skeletons';

export default function TrendingNewsLoading() {
  return (
    <PublicBrowseLoading
      hero={{
        title: 'Trending Stories',
        titleHighlight: 'Trending',
        description:
          "Discover what's hot right now - the most popular stories, topics, and discussions everyone is talking about. Stay ahead of the conversation.",
        badgeText: "What's Hot",
        badgeIcon: 'TrendingUp',
        backUrl: '/news',
        backLabel: 'Back to News',
        stats: [{ icon: 'Flame', text: 'Most popular' }, { text: 'Updated in real-time' }],
      }}>
      <NewsCategoriesSkeleton />
      <NewsSubpageGridSkeleton />
    </PublicBrowseLoading>
  );
}
