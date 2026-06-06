import { PublicBrowseLoading } from '@/components/loading/PublicBrowseLoading';
import { VideoCategoriesSkeleton, VideoSubpageGridSkeleton } from '../../_sections/skeletons';

export default function FeaturedVideosLoading() {
  return (
    <PublicBrowseLoading
      hero={{
        title: 'Featured Videos',
        titleHighlight: 'Featured',
        description:
          'Discover featured videos - editor picks and popular uploads. Hand-selected content that stands out.',
        badgeText: "Editor's Choice",
        badgeIcon: 'Star',
        backUrl: '/videos',
        backLabel: 'Back to Videos',
        stats: [{ icon: 'Star', text: 'Editor picks' }, { text: 'Top quality content' }],
      }}>
      <VideoCategoriesSkeleton />
      <VideoSubpageGridSkeleton />
    </PublicBrowseLoading>
  );
}
