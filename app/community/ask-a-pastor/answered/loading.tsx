import { PublicBrowseLoading } from '@/components/loading/PublicBrowseLoading';
import { AskAPastorBrowseSkeleton } from '@/components/section/community/ask-a-pastor/AskAPastorPageSkeleton';

export default function AnsweredQuestionsLoading() {
  return (
    <PublicBrowseLoading
      hero={{
        title: 'Answered Questions',
        titleHighlight: 'Answered',
        description:
          'Browse questions that have been answered by our pastors. Get biblical guidance on faith, life, and spiritual matters.',
        badgeText: 'Biblical Answers',
        badgeIcon: 'HelpCircle',
        backUrl: '/community/ask-a-pastor',
        backLabel: 'Back to Ask a Pastor',
        stats: [{ icon: 'HelpCircle', text: 'Pastor answered' }, { text: 'Biblical guidance' }],
      }}>
      <AskAPastorBrowseSkeleton />
    </PublicBrowseLoading>
  );
}
