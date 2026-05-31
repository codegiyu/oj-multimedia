import { RecentPolls } from '@/components/section/community/polls/RecentPolls';
import { CreatePoll } from '@/components/section/community/polls/CreatePoll';
import { SectionLoadError } from '@/components/general/SectionLoadError';
import { callPublicServerApi } from '@/lib/services/serverApi';
import { ISR_PUBLIC_FETCH } from '@/lib/constants/isr';
import { mapToPoll } from '@/lib/utils/communityApiMappers';
import type { Poll } from '@/components/section/community/polls/PollsPageClient';

export async function ClosedPollsSection() {
  const res = await callPublicServerApi(
    'PUBLIC_GET_POLLS',
    {
      query: '?limit=3&page=1&status=closed' as `?${string}`,
    },
    ISR_PUBLIC_FETCH.fast
  );

  if (res.type === 'error') {
    return (
      <SectionLoadError
        title="Recent polls unavailable"
        message={res.error?.message ?? 'Failed to load recent polls'}
      />
    );
  }

  const recentPolls = ((res.data?.polls ?? []) as unknown[]).map(i =>
    mapToPoll(i as Record<string, unknown>)
  ) as Poll[];

  return (
    <>
      <RecentPolls polls={recentPolls} />
      <CreatePoll />
    </>
  );
}
