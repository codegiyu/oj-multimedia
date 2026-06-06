import { PublicBrowseLoading } from '@/components/loading/PublicBrowseLoading';
import { VideoCategoriesSkeleton, VideoSubpageGridSkeleton } from '../../_sections/skeletons';

export default function RecentVideosLoading() {
  return (
    <PublicBrowseLoading
      hero={{
        title: 'Recent Uploads',
        titleHighlight: 'Recent',
        description:
          'Discover the latest video uploads from creators. Fresh content just added to the platform.',
        badgeText: 'Fresh',
        badgeIcon: 'Sparkles',
        backUrl: '/videos',
        backLabel: 'Back to Videos',
        stats: [{ icon: 'Sparkles', text: 'Just added' }, { text: 'Updated daily' }],
      }}>
      <VideoCategoriesSkeleton />
      <VideoSubpageGridSkeleton />
    </PublicBrowseLoading>
  );
}
