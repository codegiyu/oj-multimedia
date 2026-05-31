import { SectionLoadError } from '@/components/general/SectionLoadError';
import { AccountCommunityPollsPanel } from '@/components/section/account/community/AccountCommunityPollsPanel';
import { callServerApi } from '@/lib/services/serverApi';
import type { PollListItem } from '@/lib/types/community';
import { mapToPoll } from '@/lib/utils/communityApiMappers';

export async function AccountCommunityPollsSection() {
  const res = await callServerApi('USER_ME_COMMUNITY_POLLS', {
    query: '?limit=50' as `?${string}`,
  });

  if (res.type === 'error') {
    return (
      <SectionLoadError
        title="Polls unavailable"
        message={res.message || 'Unable to load your polls.'}
      />
    );
  }

  const polls: PollListItem[] = (res.data.polls ?? []).map(p =>
    mapToPoll(p as unknown as Record<string, unknown>)
  );

  return <AccountCommunityPollsPanel polls={polls} />;
}
