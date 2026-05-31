'use client';

import { useRouter } from 'next/navigation';
import { ActivePolls } from './ActivePolls';
import { RecentPolls } from './RecentPolls';
import { CreatePoll } from './CreatePoll';
import { SectionContainer } from '@/components/general/SectionContainer';
import { DataLoadError } from '@/components/general/DataLoadError';
import { SectionEmptyState } from '@/components/general/SectionEmptyState';
import { BarChart3 } from 'lucide-react';

export interface PollOption {
  _id: string;
  text: string;
  votes: number;
  percentage: number;
}

export interface Poll {
  _id: string;
  question: string;
  description?: string;
  options: PollOption[];
  totalVotes: number;
  status: 'active' | 'closed';
  timeAgo: string;
  endDate?: string;
}

export interface PollsData {
  activePolls: Poll[];
  recentPolls: Poll[];
  initialErrorMessage?: string | null;
}

export const PollsPageClient = ({
  activePolls,
  recentPolls,
  initialErrorMessage = null,
}: PollsData) => {
  const router = useRouter();
  const hasAnyContent = activePolls.length > 0 || recentPolls.length > 0;

  if (initialErrorMessage && !hasAnyContent) {
    return (
      <SectionContainer>
        <DataLoadError
          title="Unable to load polls"
          message={initialErrorMessage}
          onRetry={() => router.refresh()}
          icon={<BarChart3 className="w-8 h-8 text-destructive" />}
        />
      </SectionContainer>
    );
  }

  if (!hasAnyContent) {
    return (
      <>
        <SectionContainer>
          <SectionEmptyState
            title="No polls yet"
            description="Be the first to create a poll and see what the community thinks."
            icon={BarChart3}
            actionLabel="Create a poll"
            actionHref="#create-poll"
          />
        </SectionContainer>
        <div id="create-poll">
          <CreatePoll />
        </div>
      </>
    );
  }

  return (
    <>
      <div className="container mx-auto px-4 pb-16">
        <ActivePolls polls={activePolls} />
        <RecentPolls polls={recentPolls} />
      </div>
      <CreatePoll />
    </>
  );
};
