import type { Metadata } from 'next';
import { Suspense } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { CommunityHero } from '@/components/section/community/CommunityHero';
import { CommunityPageClient } from '@/components/section/community/CommunityPageClient';
import { CommunityPageSkeleton } from '@/components/section/community/CommunityPageSkeleton';
import type { Testimony } from '@/components/section/community/FeaturedTestimonies';
import type { Devotional } from '@/components/section/community/TrendingDevotionals';
import type { Discussion } from '@/components/section/community/ActiveDiscussions';

export const metadata: Metadata = {
  title: 'Community - Connect & Engage',
  description:
    'Join our vibrant community - share stories, connect with others, participate in discussions, polls, and engage with content creators.',
};

// Generate community data (in a real app, this would come from an API or database)
async function generateCommunityData() {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1500));

  // Only fetch category counts from the server
  const categoryCounts: Record<string, number> = {
    devotionals: 245,
    sermons: 128,
    testimonies: 567,
    prayerRequests: 89,
    askAPastor: 156,
    polls: 23,
    resources: 142,
    promoteYourContent: 67,
  };

  const testimonies: Testimony[] = [
    {
      id: 1,
      author: 'Michelle K.',
      avatar: '/images/artist-2.jpg',
      content:
        'This platform changed my life. I found a community that truly supports and uplifts each other. Sharing my story here helped me heal.',
      likes: 342,
      comments: 56,
      timeAgo: '2 hours ago',
    },
    {
      id: 2,
      author: 'David O.',
      avatar: '/images/artist-1.jpg',
      content:
        'After years of feeling lost, I found purpose through the devotionals and community discussions. Forever grateful for this space.',
      likes: 518,
      comments: 89,
      timeAgo: '5 hours ago',
    },
    {
      id: 3,
      author: 'Grace A.',
      avatar: '/images/artist-3.jpg',
      content:
        'The prayer community here is incredible. When I posted my request, I received so much love and support. God answered!',
      likes: 276,
      comments: 42,
      timeAgo: '1 day ago',
    },
  ];

  const devotionals: Devotional[] = [
    {
      id: 1,
      title: 'Finding Peace in Chaos',
      excerpt:
        "In the midst of life's storms, discover how to anchor yourself in calm and clarity...",
      author: 'Pastor James',
      readTime: '5 min read',
      views: 2340,
      category: 'Peace & Rest',
    },
    {
      id: 2,
      title: 'The Power of Gratitude',
      excerpt: 'Transform your perspective by embracing thankfulness in every season of life...',
      author: 'Rev. Sarah',
      readTime: '4 min read',
      views: 1890,
      category: 'Growth',
    },
    {
      id: 3,
      title: 'Walking in Purpose',
      excerpt:
        'Uncover your unique calling and learn to walk confidently in your God-given purpose...',
      author: 'Dr. Michael',
      readTime: '6 min read',
      views: 3120,
      category: 'Purpose',
    },
    {
      id: 4,
      title: 'Overcoming Fear',
      excerpt: 'Break free from the chains of fear and step into boldness and confidence...',
      author: 'Pastor Grace',
      readTime: '5 min read',
      views: 2780,
      category: 'Faith',
    },
  ];

  const discussions: Discussion[] = [
    {
      id: 1,
      title: 'How do you stay motivated during tough times?',
      author: 'Alex M.',
      replies: 47,
      participants: 23,
      lastActive: '5 min ago',
      trending: true,
    },
    {
      id: 2,
      title: "What's your favorite worship song right now?",
      author: 'Jessica T.',
      replies: 89,
      participants: 42,
      lastActive: '12 min ago',
      trending: true,
    },
    {
      id: 3,
      title: 'Tips for building better daily habits',
      author: 'Marcus D.',
      replies: 34,
      participants: 18,
      lastActive: '1 hour ago',
      trending: false,
    },
    {
      id: 4,
      title: 'Share your favorite inspirational quotes!',
      author: 'Rachel K.',
      replies: 156,
      participants: 67,
      lastActive: '2 hours ago',
      trending: true,
    },
    {
      id: 5,
      title: 'How has music helped your journey?',
      author: 'Daniel O.',
      replies: 28,
      participants: 15,
      lastActive: '3 hours ago',
      trending: false,
    },
  ];

  return {
    categoryCounts,
    testimonies,
    devotionals,
    discussions,
  };
}

export default async function CommunityPage() {
  const communityData = await generateCommunityData();

  return (
    <MainLayout>
      <CommunityHero />
      <Suspense fallback={<CommunityPageSkeleton />}>
        <CommunityPageClient {...communityData} />
      </Suspense>
    </MainLayout>
  );
}
