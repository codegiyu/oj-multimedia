import { AllPollsPageClient } from '@/components/section/community/polls/AllPollsPageClient';
import { getAllBrowseConfig } from '@/lib/constants/allBrowseConfig';
import { callPublicServerApi } from '@/lib/services/serverApi';
import {
  buildAllBrowseListQuery,
  parseAllBrowseQueryParams,
  type AllBrowseSearchParams,
} from '@/lib/utils/allBrowseQuery';
import { mapToPoll } from '@/lib/utils/communityApiMappers';
import type { Poll } from '@/components/section/community/polls/PollsPageClient';

type AllPollsSectionProps = {
  searchParams: AllBrowseSearchParams;
};

export async function AllPollsSection({ searchParams }: AllPollsSectionProps) {
  const config = getAllBrowseConfig('poll');
  const queryParams = parseAllBrowseQueryParams(searchParams);
  const status = searchParams.status?.trim() || 'all';
  const query = buildAllBrowseListQuery(config, {
    ...queryParams,
    status: status !== 'all' ? status : 'all',
  });

  const res = await callPublicServerApi('PUBLIC_GET_POLLS', { query });

  if (res.type === 'error') {
    return (
      <AllPollsPageClient
        config={config}
        polls={[]}
        pagination={null}
        initialErrorMessage={res.error?.message ?? 'Failed to load polls'}
      />
    );
  }

  const polls = ((res.data?.polls ?? []) as unknown[]).map(item =>
    mapToPoll(item as Record<string, unknown>)
  ) as Poll[];

  return (
    <AllPollsPageClient config={config} polls={polls} pagination={res.data?.pagination ?? null} />
  );
}
