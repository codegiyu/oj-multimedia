import { PublicBrowseLoading } from '@/components/loading/PublicBrowseLoading';
import { DevotionalsBrowseSkeleton } from '@/components/section/community/devotionals/DevotionalsPageSkeleton';

export default function BibleStudyLoading() {
  return (
    <PublicBrowseLoading
      hero={{
        title: 'Bible Study Series',
        titleHighlight: 'Bible Study',
        description:
          "Explore comprehensive Bible study series designed to deepen your understanding of God's Word. Join thousands of participants in these transformative studies.",
        badgeText: 'In-Depth Studies',
        badgeIcon: 'BookOpen',
        backUrl: '/community/devotionals',
        backLabel: 'Back to Devotionals',
        stats: [{ icon: 'BookOpen', text: 'Deep learning' }, { text: 'Community studies' }],
      }}>
      <div className="container mx-auto px-4 pb-16">
        <DevotionalsBrowseSkeleton />
      </div>
    </PublicBrowseLoading>
  );
}
