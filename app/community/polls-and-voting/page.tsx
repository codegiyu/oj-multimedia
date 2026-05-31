import type { Metadata } from 'next';
import { Suspense } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { PollsHero } from '@/components/section/community/polls/PollsHero';
import { ActivePollsSection } from './_sections/ActivePollsSection';
import { ClosedPollsSection } from './_sections/ClosedPollsSection';
import { ActivePollsSectionSkeleton, ClosedPollsSectionSkeleton } from './_sections/skeletons';

export const metadata: Metadata = {
  title: 'Polls & Voting - Share Your Opinion',
  description:
    'Participate in community polls, share your opinion, and see what others think. Vote on topics that matter to you and engage with the community.',
};

export default function PollsAndVotingPage() {
  return (
    <MainLayout>
      <PollsHero />
      <div className="container mx-auto px-4 pb-16">
        <Suspense fallback={<ActivePollsSectionSkeleton />}>
          <ActivePollsSection />
        </Suspense>
        <Suspense fallback={<ClosedPollsSectionSkeleton />}>
          <ClosedPollsSection />
        </Suspense>
      </div>
    </MainLayout>
  );
}
