import { Suspense } from 'react';
import { AccountCommunityPageShell } from '@/components/section/account/community/AccountCommunityPageShell';
import { AccountCommunityQuestionsSection } from './_sections/AccountCommunityQuestionsSection';
import { AccountCommunityTestimoniesSection } from './_sections/AccountCommunityTestimoniesSection';
import { AccountCommunityPrayerSection } from './_sections/AccountCommunityPrayerSection';
import { AccountCommunityPollsSection } from './_sections/AccountCommunityPollsSection';
import { AccountCommunityTabSkeleton } from './_sections/skeletons';

export default function AccountCommunityPage() {
  return (
    <AccountCommunityPageShell
      questionsPanel={
        <Suspense fallback={<AccountCommunityTabSkeleton />}>
          <AccountCommunityQuestionsSection />
        </Suspense>
      }
      testimoniesPanel={
        <Suspense fallback={<AccountCommunityTabSkeleton />}>
          <AccountCommunityTestimoniesSection />
        </Suspense>
      }
      prayerPanel={
        <Suspense fallback={<AccountCommunityTabSkeleton />}>
          <AccountCommunityPrayerSection />
        </Suspense>
      }
      pollsPanel={
        <Suspense fallback={<AccountCommunityTabSkeleton />}>
          <AccountCommunityPollsSection />
        </Suspense>
      }
    />
  );
}
