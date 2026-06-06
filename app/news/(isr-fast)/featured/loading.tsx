import { PublicBrowseLoading } from '@/components/loading/PublicBrowseLoading';
import { NewsCategoriesSkeleton, NewsSubpageGridSkeleton } from '../../_sections/skeletons';

export default function FeaturedNewsLoading() {
  return (
    <PublicBrowseLoading
      hero={{
        title: 'Featured Stories',
        titleHighlight: 'Featured',
        description:
          'Explore our handpicked collection of featured stories covering lifestyle, inspiration, culture, and trending topics. Curated content worth your time.',
        badgeText: 'Curated Collection',
        badgeIcon: 'Sparkles',
        backUrl: '/news',
        backLabel: 'Back to News',
        stats: [{ icon: 'Sparkles', text: 'Handpicked stories' }, { text: 'Updated regularly' }],
      }}>
      <NewsCategoriesSkeleton />
      <NewsSubpageGridSkeleton />
    </PublicBrowseLoading>
  );
}
