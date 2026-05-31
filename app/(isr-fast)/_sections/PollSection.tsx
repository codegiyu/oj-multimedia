import { CommunityPollPanel } from '@/components/section/home/CommunityPollPanel';
import { SectionLoadError } from '@/components/general/SectionLoadError';
import type { IPublicPollsListRes } from '@/lib/constants/endpoints';
import type { PollOption } from '@/components/section/home';
import { callPublicServerApi } from '@/lib/services/serverApi';
import { HOME_ISR } from './shared';

export async function PollSection() {
  const res = await callPublicServerApi(
    'PUBLIC_GET_POLLS',
    { query: '?status=active&page=1&limit=1' },
    HOME_ISR
  );

  if (res.type === 'error') {
    return (
      <SectionLoadError
        title="Poll unavailable"
        message={res.error?.message ?? 'Failed to load active poll'}
      />
    );
  }

  const pollsData = (res.data as IPublicPollsListRes | undefined)?.polls ?? [];
  const activePoll = pollsData[0];

  const pollOptions: PollOption[] =
    activePoll?.options?.map(option => ({
      _id: option._id,
      option: option.text,
      votes: option.percentage,
    })) ?? [];

  const pollTotalVotes = activePoll?.totalVotes ?? 0;
  const pollQuestion = activePoll?.question;
  const pollHref = activePoll
    ? `/community/polls-and-voting/${activePoll._id}`
    : '/community/polls-and-voting';

  return (
    <CommunityPollPanel
      pollOptions={pollOptions}
      pollTotalVotes={pollTotalVotes}
      pollQuestion={pollQuestion}
      pollHref={pollHref}
    />
  );
}
