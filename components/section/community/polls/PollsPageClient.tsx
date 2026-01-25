'use client';

import { ActivePolls } from './ActivePolls';
import { RecentPolls } from './RecentPolls';
import { CreatePoll } from './CreatePoll';

export interface PollOption {
  id: number;
  text: string;
  votes: number;
  percentage: number;
}

export interface Poll {
  id: number;
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
}

export const PollsPageClient = ({ activePolls, recentPolls }: PollsData) => {
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
