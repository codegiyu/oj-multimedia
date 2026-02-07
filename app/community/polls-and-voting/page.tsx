import type { Metadata } from 'next';
import { Suspense } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { PollsHero } from '@/components/section/community/polls/PollsHero';
import { PollsPageClient, type Poll } from '@/components/section/community/polls/PollsPageClient';
import { PollsPageSkeleton } from '@/components/section/community/polls/PollsPageSkeleton';
import { POLLS_ITEMS } from '@/lib/constants/community/polls';

export const metadata: Metadata = {
  title: 'Polls & Voting - Share Your Opinion',
  description:
    'Participate in community polls, share your opinion, and see what others think. Vote on topics that matter to you and engage with the community.',
};

// Force dynamic rendering to ensure searchParams changes trigger re-renders
export const dynamic = 'force-dynamic';

// Generate polls data from central constants
async function generatePollsData(): Promise<{ activePolls: Poll[]; recentPolls: Poll[] }> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1500));

  // Transform poll items to Poll format
  const allPolls: Poll[] = POLLS_ITEMS.map(item => ({
    _id: item._id,
    question: item.question,
    description: item.description,
    options: item.options,
    totalVotes: item.totalVotes,
    status: item.status,
    timeAgo: item.timeAgo,
    endDate: item.endDate,
  }));

  return {
    activePolls: allPolls.filter(poll => poll.status === 'active'),
    recentPolls: allPolls.filter(poll => poll.status === 'closed').slice(0, 3),
  };
}

export default async function PollsAndVotingPage() {
  const pollsData = await generatePollsData();

  return (
    <MainLayout>
      <PollsHero />
      <Suspense fallback={<PollsPageSkeleton />}>
        <PollsPageClient {...pollsData} />
      </Suspense>
    </MainLayout>
  );
}
