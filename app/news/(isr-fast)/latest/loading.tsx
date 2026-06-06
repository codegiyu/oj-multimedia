import { PublicBrowseLoading } from '@/components/loading/PublicBrowseLoading';
import { NewsCategoriesSkeleton, NewsSubpageGridSkeleton } from '../../_sections/skeletons';

export default function LatestNewsLoading() {
  return (
    <PublicBrowseLoading
      hero={{
        title: 'Latest Stories',
        titleHighlight: 'Latest',
        description:
          'Stay current with freshly published stories — news, lifestyle, culture, and inspiration from across OJ Multimedia.',
        badgeText: 'Fresh Updates',
        badgeIcon: 'Clock',
        backUrl: '/news',
        backLabel: 'Back to News',
        stats: [{ icon: 'Clock', text: 'Newest first' }, { text: 'Updated throughout the day' }],
      }}>
      <NewsCategoriesSkeleton />
      <NewsSubpageGridSkeleton />
    </PublicBrowseLoading>
  );
}
