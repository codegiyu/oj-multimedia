import { MainLayout } from '@/components/layout/MainLayout';
import { PollsHero } from '@/components/section/community/polls/PollsHero';
import { ActivePollsSectionSkeleton, ClosedPollsSectionSkeleton } from './_sections/skeletons';

export default function PollsAndVotingLoading() {
  return (
    <MainLayout>
      <PollsHero />
      <div className="container mx-auto px-4 pb-16">
        <ActivePollsSectionSkeleton />
        <ClosedPollsSectionSkeleton />
      </div>
    </MainLayout>
  );
}
