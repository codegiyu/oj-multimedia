import type { Metadata } from 'next';
import { Suspense } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { PollsHero } from '@/components/section/community/polls/PollsHero';
import { PollsPageClient, type Poll } from '@/components/section/community/polls/PollsPageClient';
import { PollsPageSkeleton } from '@/components/section/community/polls/PollsPageSkeleton';
import { callServerApi } from '@/lib/services/serverApi';
import type { ApiErrorResponse } from '@/lib/types/http';
import type { IPublicPollsListRes } from '@/lib/constants/endpoints';
import { mapToPoll } from '@/lib/utils/communityApiMappers';

export const metadata: Metadata = {
  title: 'Polls & Voting - Share Your Opinion',
  description:
    'Participate in community polls, share your opinion, and see what others think. Vote on topics that matter to you and engage with the community.',
};

export const dynamic = 'force-dynamic';

async function fetchPollsData(): Promise<{
  activePolls: Poll[];
  recentPolls: Poll[];
  initialErrorMessage: string | null;
}> {
  const [activeRes, closedRes] = await Promise.all([
    callServerApi('PUBLIC_GET_POLLS', { query: '?limit=20&page=1&status=active' as `?${string}` }),
    callServerApi('PUBLIC_GET_POLLS', { query: '?limit=3&page=1&status=closed' as `?${string}` }),
  ]);
  const errorMessage = activeRes.error
    ? ((activeRes.error as ApiErrorResponse)?.message ?? 'Failed to load polls')
    : null;
  const activeData = activeRes.data as IPublicPollsListRes | undefined;
  const closedData = closedRes.data as IPublicPollsListRes | undefined;
  const activePolls = (activeData?.polls ?? []).map(i =>
    mapToPoll(i as unknown as Record<string, unknown>)
  ) as Poll[];
  const recentPolls = (closedData?.polls ?? []).map(i =>
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
