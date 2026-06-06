import { PublicBrowseLoading } from '@/components/loading/PublicBrowseLoading';
import { VideoCategoriesSkeleton, VideoSubpageGridSkeleton } from '../../_sections/skeletons';

export default function TrendingVideosLoading() {
  return (
    <PublicBrowseLoading
      hero={{
        title: 'Trending Videos',
        titleHighlight: 'Trending',
        description:
          "Discover what's hot right now - the most popular videos everyone is watching. Stay ahead of the video content scene.",
        badgeText: "What's Hot",
        badgeIcon: 'Flame',
        backUrl: '/videos',
        backLabel: 'Back to Videos',
        stats: [{ icon: 'Flame', text: 'Most popular' }, { text: 'Updated in real-time' }],
      }}>
      <VideoCategoriesSkeleton />
      <VideoSubpageGridSkeleton />
    </PublicBrowseLoading>
  );
}
