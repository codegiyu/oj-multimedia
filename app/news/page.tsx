import type { Metadata } from 'next';
import { Suspense } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { NewsHero } from '@/components/section/news/NewsHero';
import { NewsPageClient } from '@/components/section/news/NewsPageClient';
import { NewsPageSkeleton } from '@/components/section/news/NewsPageSkeleton';
import type { FeaturedStory } from '@/components/section/news/FeaturedStories';
import type { NewsItem } from '@/components/section/news/NewsFeed';
import type { TrendingStory } from '@/components/section/news/TrendingSidebar';
import type { VideoNewsItem } from '@/components/section/news/VideoNews';

export const metadata: Metadata = {
  title: 'News & Lifestyle Updates',
  description:
    'Stay updated with the latest news, announcements, inspirational stories, lifestyle content, and trending topics. Explore recent updates and popular stories.',
};

// Generate news data (in a real app, this would come from an API or database)
async function generateNewsData() {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  const featuredStories: FeaturedStory[] = [
    {
      id: 1,
      title: 'How Gen Z Is Redefining Success: Beyond the 9-to-5',
      excerpt:
        'Young professionals are building careers on their own terms, prioritizing purpose over paychecks.',
      category: 'Lifestyle',
      image: '/images/video-thumb-1.jpg',
      readTime: '5 min read',
      views: '12.5K',
      comments: 89,
      featured: true,
    },
    {
      id: 2,
      title: 'Top 10 Scholarships You Should Apply For in 2025',
      excerpt: "Don't miss these opportunities to fund your education and dreams.",
      category: 'Scholarships',
      image: '/images/video-thumb-2.jpg',
      readTime: '3 min read',
      views: '8.2K',
      comments: 45,
    },
    {
      id: 3,
      title: 'The Rise of Afrobeats: A Global Movement',
      excerpt: 'From Lagos to LA, African music is taking over the world stage.',
      category: 'Music & Culture',
      image: '/images/video-thumb-3.jpg',
      readTime: '4 min read',
      views: '15.1K',
      comments: 112,
    },
  ];

  const newsItems: NewsItem[] = [
    {
      id: 1,
      title: '5 Morning Habits That Will Transform Your Day',
      excerpt:
        'Start your mornings right with these simple but powerful routines that successful people swear by.',
      category: 'Lifestyle',
      image: '/images/album-1.jpg',
      readTime: '4 min',
      views: '5.2K',
      comments: 34,
      likes: 128,
    },
    {
      id: 2,
      title: 'New Music Friday: The Hottest Drops This Week',
      excerpt: 'From Afrobeats to R&B, here are the tracks you need on your playlist right now.',
      category: 'Entertainment',
      image: '/images/album-2.jpg',
      readTime: '3 min',
      views: '9.8K',
      comments: 67,
      likes: 245,
    },
    {
      id: 3,
      title: 'Remote Jobs: Companies Hiring Worldwide in 2025',
      excerpt:
        'Looking for flexible work? These companies are actively hiring remote talent from anywhere.',
      category: 'Jobs & Careers',
      image: '/images/album-3.jpg',
      readTime: '6 min',
      views: '11.3K',
      comments: 89,
      likes: 312,
    },
    {
      id: 4,
      title: 'Finding Purpose: Stories of Young Changemakers',
      excerpt:
        'Meet the young leaders making a difference in their communities through innovation and compassion.',
      category: 'Inspiration',
      image: '/images/artist-1.jpg',
      readTime: '7 min',
      views: '7.1K',
      comments: 56,
      likes: 189,
    },
    {
      id: 5,
      title: "Movie Review: The Year's Most Talked About Film",
      excerpt:
        'We break down what makes this movie a must-watch and why critics are calling it a masterpiece.',
      category: 'Movies & Reviews',
      image: '/images/artist-2.jpg',
      readTime: '5 min',
      views: '14.2K',
      comments: 134,
      likes: 421,
    },
    {
      id: 6,
      title: 'Tech Scholarships Open for African Students',
      excerpt:
        'Major tech companies are offering fully-funded programs for aspiring developers and designers.',
      category: 'Scholarships',
      image: '/images/artist-3.jpg',
      readTime: '4 min',
      views: '18.7K',
      comments: 201,
      likes: 567,
    },
  ];

  const trendingStories: TrendingStory[] = [
    {
      id: 1,
      title: 'Why Everyone Is Talking About This New App',
      category: 'Tech',
      readTime: '3 min',
      rank: 1,
    },
    {
      id: 2,
      title: '10 Side Hustles That Actually Work in 2025',
      category: 'Careers',
      readTime: '5 min',
      rank: 2,
    },
    {
      id: 3,
      title: 'The Mental Health Conversation We Need to Have',
      category: 'Wellness',
      readTime: '6 min',
      rank: 3,
    },
    {
      id: 4,
      title: 'African Creators Breaking Barriers on YouTube',
      category: 'Entertainment',
      readTime: '4 min',
      rank: 4,
    },
    {
      id: 5,
      title: 'Full Scholarships for Graduate Studies Abroad',
      category: 'Education',
      readTime: '4 min',
      rank: 5,
    },
  ];

  const videoNews: VideoNewsItem[] = [
    {
      id: 1,
      title: 'Inside the Studio: Artist Reveals Creative Process',
      category: 'Behind the Scenes',
      duration: '8:45',
      image: '/images/video-thumb-1.jpg',
      views: '24K',
    },
    {
      id: 2,
      title: 'Young Entrepreneurs Share Their Journey',
      category: 'Inspiration',
      duration: '12:30',
      image: '/images/video-thumb-2.jpg',
      views: '18K',
    },
    {
      id: 3,
      title: 'Campus Life: What Students Are Really Thinking',
      category: 'Lifestyle',
      duration: '6:15',
      image: '/images/video-thumb-3.jpg',
      views: '31K',
    },
    {
      id: 4,
      title: 'Music Documentary: The Sounds of Africa',
      category: 'Documentary',
      duration: '15:00',
      image: '/images/hero-bg.jpg',
      views: '42K',
    },
  ];

  return {
    featuredStories,
    newsItems,
    trendingStories,
    videoNews,
  };
}

export default async function NewsPage() {
  const newsData = await generateNewsData();

  return (
    <MainLayout>
      <NewsHero />
      <Suspense fallback={<NewsPageSkeleton />}>
        <NewsPageClient {...newsData} />
      </Suspense>
    </MainLayout>
  );
}
