import { PublicBrowseLoading } from '@/components/loading/PublicBrowseLoading';
import { NewsCategoriesSkeleton, VideoNewsSectionSkeleton } from '../_sections/skeletons';

export default function NewsVideosLoading() {
  return (
    <PublicBrowseLoading
      hero={{
        title: 'Video Stories',
        titleHighlight: 'Video',
        description:
          'Watch engaging video stories covering behind-the-scenes content, inspiration, lifestyle, documentaries, and more. Visual stories that bring content to life.',
        badgeText: 'Watch & Learn',
        badgeIcon: 'Play',
        backUrl: '/news',
        backLabel: 'Back to News',
        stats: [{ icon: 'Play', text: 'Video content' }, { text: 'Multiple categories' }],
      }}>
      <NewsCategoriesSkeleton />
      <VideoNewsSectionSkeleton />
    </PublicBrowseLoading>
  );
}
