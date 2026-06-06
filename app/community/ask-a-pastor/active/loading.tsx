import { PublicBrowseLoading } from '@/components/loading/PublicBrowseLoading';
import { AskAPastorBrowseSkeleton } from '@/components/section/community/ask-a-pastor/AskAPastorPageSkeleton';

export default function ActiveQuestionsLoading() {
  return (
    <PublicBrowseLoading
      hero={{
        title: 'Active Questions',
        titleHighlight: 'Active',
        description:
          'Browse questions that are currently awaiting answers from our pastors. Submit your own question or pray for those seeking guidance.',
        badgeText: 'Awaiting Answers',
        badgeIcon: 'HelpCircle',
        backUrl: '/community/ask-a-pastor',
        backLabel: 'Back to Ask a Pastor',
        stats: [{ icon: 'HelpCircle', text: 'Seeking guidance' }, { text: 'Pastor answered' }],
      }}>
      <AskAPastorBrowseSkeleton />
    </PublicBrowseLoading>
  );
}
