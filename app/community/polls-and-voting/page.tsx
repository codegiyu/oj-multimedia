import type { Metadata } from 'next';
import { Suspense } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { PollsHero } from '@/components/section/community/polls/PollsHero';
import { PollsPageClient, type Poll } from '@/components/section/community/polls/PollsPageClient';
import { PollsPageSkeleton } from '@/components/section/community/polls/PollsPageSkeleton';
import { callPublicServerApi } from '@/lib/services/serverApi';
import { ISR_PUBLIC_FETCH } from '@/lib/constants/isr';
import { mapToPoll } from '@/lib/utils/communityApiMappers';

export const metadata: Metadata = {
  title: 'Polls & Voting - Share Your Opinion',
  description:
    'Participate in community polls, share your opinion, and see what others think. Vote on topics that matter to you and engage with the community.',
};

async function fetchPollsData(): Promise<{
  activePolls: Poll[];
  recentPolls: Poll[];
  initialErrorMessage: string | null;
}> {
  const [activeRes, closedRes] = await Promise.all([
    callPublicServerApi(
      'PUBLIC_GET_POLLS',
      {
        query: '?limit=20&page=1&status=active' as `?${string}`,
      },
      ISR_PUBLIC_FETCH.fast
    ),
    callPublicServerApi(
      'PUBLIC_GET_POLLS',
      {
        query: '?limit=3&page=1&status=closed' as `?${string}`,
      },
      ISR_PUBLIC_FETCH.fast
    ),
  ]);
  const errorMessage =
    activeRes.type === 'error' ? (activeRes.error?.message ?? 'Failed to load polls') : null;
  const activePolls = (activeRes.type === 'success' ? (activeRes.data?.polls ?? []) : []).map(i =>
    mapToPoll(i as unknown as Record<string, unknown>)
  ) as Poll[];
  const recentPolls = (closedRes.type === 'success' ? (closedRes.data?.polls ?? []) : []).map(i =>
    mapToPoll(i as unknown as Record<string, unknown>)
  ) as Poll[];
  return {
    activePolls,
    recentPolls,
    initialErrorMessage: errorMessage,
  };
}

export default async function PollsAndVotingPage() {
  const pollsData = await fetchPollsData();

  return (
    <MainLayout>
      <PollsHero />
      <Suspense fallback={<PollsPageSkeleton />}>
        <PollsPageClient {...pollsData} />
      </Suspense>
    </MainLayout>
  );
}
