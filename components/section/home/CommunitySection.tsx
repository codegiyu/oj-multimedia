'use client';

import { CommunitySectionFrame } from './CommunitySectionFrame';
import { CommunityHighlightsPanel } from './CommunityHighlightsPanel';
import { CommunityPollPanel, type PollOption } from './CommunityPollPanel';
import type { CommunityHighlightItem } from '@/lib/utils/mergeCommunityHighlights';

export type { PollOption };

interface CommunitySectionProps {
  highlights: CommunityHighlightItem[];
  pollOptions: PollOption[];
  pollTotalVotes: number;
  pollQuestion?: string;
  pollHref?: string;
}

export const CommunitySection = ({
  highlights,
  pollOptions,
  pollTotalVotes,
  pollQuestion,
  pollHref,
}: CommunitySectionProps) => {
  return (
    <CommunitySectionFrame
      highlights={<CommunityHighlightsPanel highlights={highlights} />}
      poll={
        <CommunityPollPanel
          pollOptions={pollOptions}
          pollTotalVotes={pollTotalVotes}
          pollQuestion={pollQuestion}
          pollHref={pollHref}
        />
      }
    />
  );
};

export type { CommunityHighlightItem };
