import { PublicBrowseLoading } from '@/components/loading/PublicBrowseLoading';
import { VideoCategoriesSkeleton, VideoSubpageGridSkeleton } from '../../_sections/skeletons';

export default function LongFormVideosLoading() {
  return (
    <PublicBrowseLoading
      hero={{
        title: 'Long-form Videos',
        titleHighlight: 'Long-form',
        description: 'Films, documentaries, and extended video content from our creators.',
        badgeText: 'Extended',
        badgeIcon: 'Play',
        backUrl: '/videos',
        backLabel: 'Back to Videos',
        stats: [{ icon: 'Play', text: 'Films & long video' }, { text: 'Curated collection' }],
      }}>
      <VideoCategoriesSkeleton />
      <VideoSubpageGridSkeleton />
    </PublicBrowseLoading>
  );
}
