import type { Metadata } from 'next';
import { Suspense } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { SermonsHero } from '@/components/section/community/sermons/SermonsHero';
import { SermonsPageClient } from '@/components/section/community/sermons/SermonsPageClient';
import { SermonsPageSkeleton } from '@/components/section/community/sermons/SermonsPageSkeleton';

export const metadata: Metadata = {
  title: 'Sermons - Audio & Video Messages',
  description:
    'Listen to audio sermons, watch video messages, explore sermons by topic, discover featured pastors, and upload your own monetizable sermon content.',
};

// Generate sermons data (in a real app, this would come from an API or database)
async function generateSermonsData() {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1500));

  const audioSermons = [
    {
      id: 1,
      title: 'Finding Peace in Troubled Times',
      pastor: 'Pastor David Chen',
      duration: '45:30',
      plays: '12.5K',
      date: 'Jan 5, 2026',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
    },
    {
      id: 2,
      title: 'The Power of Forgiveness',
      pastor: 'Rev. Sarah Williams',
      duration: '38:15',
      plays: '9.8K',
      date: 'Jan 3, 2026',
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop',
    },
    {
      id: 3,
      title: 'Walking by Faith',
      pastor: 'Bishop James Moore',
      duration: '52:00',
      plays: '15.2K',
      date: 'Jan 1, 2026',
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop',
    },
    {
      id: 4,
      title: 'Purpose-Driven Living',
      pastor: 'Pastor Grace Okonkwo',
      duration: '41:45',
      plays: '8.3K',
      date: 'Dec 29, 2025',
      image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&h=100&fit=crop',
    },
  ];

  const videoSermons = [
    {
      id: 1,
      title: 'Living with Purpose: A Journey of Faith',
      pastor: 'Pastor David Chen',
      duration: '1:02:30',
      views: '25.4K',
      thumbnail:
        'https://images.unsplash.com/photo-1478147427282-58a87a120781?w=400&h=225&fit=crop',
      isLive: false,
      isNew: true,
    },
    {
      id: 2,
      title: 'Sunday Service - The Grace of God',
      pastor: 'Rev. Sarah Williams',
      duration: '1:15:00',
      views: '18.2K',
      thumbnail:
        'https://images.unsplash.com/photo-1504052434569-70ad5836ab65?w=400&h=225&fit=crop',
      isLive: true,
      isNew: false,
    },
    {
      id: 3,
      title: 'Building Strong Foundations',
      pastor: 'Bishop James Moore',
      duration: '55:45',
      views: '31.8K',
      thumbnail:
        'https://images.unsplash.com/photo-1519834785169-98be25ec3f84?w=400&h=225&fit=crop',
      isLive: false,
      isNew: false,
    },
    {
      id: 4,
      title: 'The Power of Prayer',
      pastor: 'Pastor Grace Okonkwo',
      duration: '48:20',
      views: '22.1K',
      thumbnail:
        'https://images.unsplash.com/photo-1445445290350-18a3b86e0b5a?w=400&h=225&fit=crop',
      isLive: false,
      isNew: true,
    },
  ];

  const topics = [
    {
      id: 1,
      name: 'Faith',
      count: 156,
      description: 'Building unshakeable faith',
    },
    {
      id: 2,
      name: 'Family',
      count: 89,
      description: 'Strengthening family bonds',
    },
    {
      id: 3,
      name: 'Healing',
      count: 124,
      description: 'Physical & spiritual healing',
    },
    {
      id: 4,
      name: 'Purpose',
      count: 98,
      description: 'Discovering your calling',
    },
    {
      id: 5,
      name: 'Leadership',
      count: 67,
      description: 'Leading with integrity',
    },
    {
      id: 6,
      name: 'Protection',
      count: 78,
      description: "God's divine protection",
    },
  ];

  const pastors = [
    {
      id: 1,
      name: 'Pastor David Chen',
      title: 'Senior Pastor',
      church: 'Grace Community Church',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop',
      sermons: 156,
      followers: '45.2K',
      featured: true,
      topics: ['Faith', 'Leadership', 'Purpose'],
    },
    {
      id: 2,
      name: 'Rev. Sarah Williams',
      title: 'Teaching Pastor',
      church: 'New Life Fellowship',
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=300&fit=crop',
      sermons: 89,
      followers: '32.1K',
      featured: false,
      topics: ['Family', 'Healing', 'Women'],
    },
    {
      id: 3,
      name: 'Bishop James Moore',
      title: 'Founding Bishop',
      church: 'Kingdom Life Cathedral',
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop',
      sermons: 234,
      followers: '78.5K',
      featured: true,
      topics: ['Word Study', 'Revival', 'Faith'],
    },
    {
      id: 4,
      name: 'Pastor Grace Okonkwo',
      title: 'Associate Pastor',
      church: 'Harvest Church International',
      image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=300&h=300&fit=crop',
      sermons: 67,
      followers: '28.9K',
      featured: false,
      topics: ['Purpose', 'Youth', 'Prayer'],
    },
  ];

  const popularSermons = [
    {
      id: 1,
      title: 'The Power of Faith',
      pastor: 'Pastor David Chen',
      duration: '52:15',
      views: '125.4K',
      thumbnail:
        'https://images.unsplash.com/photo-1478147427282-58a87a120781?w=400&h=225&fit=crop',
      category: 'Faith',
      trending: true,
    },
    {
      id: 2,
      title: 'Healing for the Broken',
      pastor: 'Rev. Sarah Williams',
      duration: '48:30',
      views: '98.2K',
      thumbnail:
        'https://images.unsplash.com/photo-1504052434569-70ad5836ab65?w=400&h=225&fit=crop',
      category: 'Healing',
      trending: true,
    },
    {
      id: 3,
      title: 'Building Strong Families',
      pastor: 'Bishop James Moore',
      duration: '1:05:00',
      views: '87.5K',
      thumbnail:
        'https://images.unsplash.com/photo-1519834785169-98be25ec3f84?w=400&h=225&fit=crop',
      category: 'Family',
      trending: false,
    },
    {
      id: 4,
      title: 'Finding Your Purpose',
      pastor: 'Pastor Grace Okonkwo',
      duration: '45:20',
      views: '76.3K',
      thumbnail:
        'https://images.unsplash.com/photo-1445445290350-18a3b86e0b5a?w=400&h=225&fit=crop',
      category: 'Purpose',
      trending: false,
    },
  ];

  return {
    audioSermons,
    videoSermons,
    topics,
    pastors,
    popularSermons,
  };
}

export default async function CommunitySermonsPage() {
  const sermonsData = await generateSermonsData();

  return (
    <MainLayout>
      <SermonsHero />
      <Suspense fallback={<SermonsPageSkeleton />}>
        <SermonsPageClient {...sermonsData} />
      </Suspense>
    </MainLayout>
  );
}
