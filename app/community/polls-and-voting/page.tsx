import type { Metadata } from 'next';
import { Suspense } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { PollsHero } from '@/components/section/community/polls/PollsHero';
import { PollsPageClient, type Poll } from '@/components/section/community/polls/PollsPageClient';
import { PollsPageSkeleton } from '@/components/section/community/polls/PollsPageSkeleton';

export const metadata: Metadata = {
  title: 'Polls & Voting - Share Your Opinion',
  description:
    'Participate in community polls, share your opinion, and see what others think. Vote on topics that matter to you and engage with the community.',
};

// Generate polls data (in a real app, this would come from an API or database)
async function generatePollsData(): Promise<{ activePolls: Poll[]; recentPolls: Poll[] }> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1500));

  const allPolls: Poll[] = [
    {
      id: 1,
      question: 'What is your favorite worship style?',
      description: 'Help us understand the worship preferences of our community',
      options: [
        { id: 1, text: 'Contemporary', votes: 245, percentage: 45 },
        { id: 2, text: 'Traditional Hymns', votes: 156, percentage: 29 },
        { id: 3, text: 'Gospel', votes: 98, percentage: 18 },
        { id: 4, text: 'Blended', votes: 42, percentage: 8 },
      ],
      totalVotes: 541,
      status: 'active',
      timeAgo: '2 hours ago',
      endDate: '2024-12-31',
    },
    {
      id: 2,
      question: 'How often do you read your Bible?',
      description: 'Understanding Bible reading habits in our community',
      options: [
        { id: 1, text: 'Daily', votes: 312, percentage: 52 },
        { id: 2, text: 'Several times a week', votes: 189, percentage: 31 },
        { id: 3, text: 'Once a week', votes: 67, percentage: 11 },
        { id: 4, text: 'Rarely', votes: 28, percentage: 5 },
      ],
      totalVotes: 596,
      status: 'active',
      timeAgo: '5 hours ago',
      endDate: '2024-12-25',
    },
    {
      id: 3,
      question: 'What topic would you like more content on?',
      description: 'Help us create content that matters to you',
      options: [
        { id: 1, text: 'Marriage & Relationships', votes: 178, percentage: 38 },
        { id: 2, text: 'Financial Stewardship', votes: 145, percentage: 31 },
        { id: 3, text: 'Prayer & Intercession', votes: 98, percentage: 21 },
        { id: 4, text: 'Leadership', votes: 45, percentage: 10 },
      ],
      totalVotes: 466,
      status: 'active',
      timeAgo: '1 day ago',
      endDate: '2024-12-30',
    },
    {
      id: 4,
      question: 'Which devotional format do you prefer?',
      description: 'Your feedback helps us improve our content',
      options: [
        { id: 1, text: 'Daily Devotionals', votes: 234, percentage: 48 },
        { id: 2, text: 'Weekly Studies', votes: 156, percentage: 32 },
        { id: 3, text: 'Bible Reading Plans', votes: 67, percentage: 14 },
        { id: 4, text: 'Video Devotionals', votes: 28, percentage: 6 },
      ],
      totalVotes: 485,
      status: 'active',
      timeAgo: '2 days ago',
      endDate: '2024-12-28',
    },
    {
      id: 5,
      question: 'How do you prefer to engage with sermons?',
      description: 'Understanding how our community consumes sermon content',
      options: [
        { id: 1, text: 'Live Streaming', votes: 198, percentage: 41 },
        { id: 2, text: 'Audio Podcasts', votes: 145, percentage: 30 },
        { id: 3, text: 'Video Recordings', votes: 98, percentage: 20 },
        { id: 4, text: 'Written Transcripts', votes: 42, percentage: 9 },
      ],
      totalVotes: 483,
      status: 'active',
      timeAgo: '3 days ago',
      endDate: '2024-12-27',
    },
    {
      id: 6,
      question: 'What motivates you to serve in ministry?',
      description: 'Share what drives your heart for service',
      options: [
        { id: 1, text: 'Love for God', votes: 267, percentage: 55 },
        { id: 2, text: 'Desire to help others', votes: 145, percentage: 30 },
        { id: 3, text: 'Personal calling', votes: 56, percentage: 12 },
        { id: 4, text: 'Community impact', votes: 17, percentage: 3 },
      ],
      totalVotes: 485,
      status: 'closed',
      timeAgo: '1 week ago',
      endDate: '2024-12-20',
    },
  ];

  return {
    activePolls: allPolls.filter(poll => poll.status === 'active'),
    recentPolls: allPolls.filter(poll => poll.status === 'closed').slice(0, 3),
  };
}

export default async function PollsAndVotingPage() {
  const pollsData = await generatePollsData();

  return (
    <MainLayout>
      <PollsHero />
      <Suspense fallback={<PollsPageSkeleton />}>
        <PollsPageClient {...pollsData} />
      </Suspense>
    </MainLayout>
  );
}
