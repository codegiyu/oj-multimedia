import { PublicBrowseLoading } from '@/components/loading/PublicBrowseLoading';
import { TestimoniesBrowseSkeleton } from '@/components/section/community/testimonies/TestimoniesPageSkeleton';

export default function LatestTestimoniesLoading() {
  return (
    <PublicBrowseLoading
      hero={{
        title: 'Latest Testimonies',
        titleHighlight: 'Latest',
        description:
          'Read the most recent testimonies shared by our community members. Fresh stories of hope and transformation.',
        badgeText: 'Recent Stories',
        badgeIcon: 'Clock',
        backUrl: '/community/testimonies',
        backLabel: 'Back to Testimonies',
        stats: [{ icon: 'Clock', text: 'Updated regularly' }, { text: 'Fresh content' }],
      }}>
      <TestimoniesBrowseSkeleton />
    </PublicBrowseLoading>
  );
}
