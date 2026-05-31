import { ActivePolls } from '@/components/section/community/polls/ActivePolls';
import { SectionLoadError } from '@/components/general/SectionLoadError';
import { callPublicServerApi } from '@/lib/services/serverApi';
import { ISR_PUBLIC_FETCH } from '@/lib/constants/isr';
import { mapToPoll } from '@/lib/utils/communityApiMappers';
import type { Poll } from '@/components/section/community/polls/PollsPageClient';

export async function ActivePollsSection() {
  const res = await callPublicServerApi(
    'PUBLIC_GET_POLLS',
    {
      query: '?limit=20&page=1&status=active' as `?${string}`,
    },
    ISR_PUBLIC_FETCH.fast
  );

  if (res.type === 'error') {
    return (
      <SectionLoadError
        title="Active polls unavailable"
        message={res.error?.message ?? 'Failed to load active polls'}
      />
    );
  }

  const activePolls = ((res.data?.polls ?? []) as unknown[]).map(i =>
    mapToPoll(i as Record<string, unknown>)
  ) as Poll[];

  return <ActivePolls polls={activePolls} />;
}
