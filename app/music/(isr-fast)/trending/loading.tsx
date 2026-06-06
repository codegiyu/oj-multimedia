import { PublicBrowseLoading } from '@/components/loading/PublicBrowseLoading';
import {
  MusicCategoriesSkeleton,
  MusicTrendingGridSectionSkeleton,
} from '@/components/section/music/skeletons';

export default function TrendingSongsLoading() {
  return (
    <PublicBrowseLoading
      hero={{
        title: 'Trending Songs',
        titleHighlight: 'Trending',
        description:
          "Discover what's hot right now - the most popular songs everyone is listening to. Stay ahead of the music scene.",
        badgeText: "What's Hot",
        badgeIcon: 'Flame',
        backUrl: '/music',
        backLabel: 'Back to Music',
        stats: [{ icon: 'Flame', text: 'Most popular' }, { text: 'Updated in real-time' }],
      }}>
      <MusicCategoriesSkeleton />
      <MusicTrendingGridSectionSkeleton />
    </PublicBrowseLoading>
  );
}
