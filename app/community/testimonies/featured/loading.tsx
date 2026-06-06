import { PublicBrowseLoading } from '@/components/loading/PublicBrowseLoading';
import { TestimoniesBrowseSkeleton } from '@/components/section/community/testimonies/TestimoniesPageSkeleton';

export default function FeaturedTestimoniesLoading() {
  return (
    <PublicBrowseLoading
      hero={{
        title: 'Featured Testimonies',
        titleHighlight: 'Featured',
        description:
          'Read featured testimonies of transformation, healing, and breakthrough from our community. These stories inspire and encourage.',
        badgeText: 'Inspiring Stories',
        badgeIcon: 'Sparkles',
        backUrl: '/community/testimonies',
        backLabel: 'Back to Testimonies',
        stats: [{ icon: 'Sparkles', text: 'Handpicked stories' }, { text: 'Inspiring content' }],
      }}>
      <div className="container mx-auto px-4 pb-16">
        <TestimoniesBrowseSkeleton />
      </div>
    </PublicBrowseLoading>
  );
}
