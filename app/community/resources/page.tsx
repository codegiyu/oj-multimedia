import type { Metadata } from 'next';
import { Suspense } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { ResourcesHero } from '@/components/section/community/resources/ResourcesHero';
import {
  ResourcesPageClient,
  type ResourceData,
} from '@/components/section/community/resources/ResourcesPageClient';
import { ResourcesPageSkeleton } from '@/components/section/community/resources/ResourcesPageSkeleton';

export const metadata: Metadata = {
  title: 'Resources - Free Downloads & More',
  description:
    'Download free e-books, sermon templates, beats, wallpapers, and explore affiliate products. Access resources to support your faith journey.',
};

// Generate resources data (in a real app, this would come from an API or database)
async function generateResourcesData(): Promise<ResourceData> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1500));

  return {
    ebooks: [
      {
        title: 'Prayer Guide: 30 Days of Prayer',
        description: 'A comprehensive guide to deepen your prayer life',
        downloads: '1.2K',
        cover: '/placeholder.svg',
      },
      {
        title: 'Bible Study Methods',
        description: 'Learn effective methods for studying the Bible',
        downloads: '890',
        cover: '/placeholder.svg',
      },
      {
        title: 'Christian Living Principles',
        description: 'Essential principles for daily Christian living',
        downloads: '650',
        cover: '/placeholder.svg',
      },
      {
        title: 'Worship & Praise Handbook',
        description: 'Understanding worship and its importance',
        downloads: '1.5K',
        cover: '/placeholder.svg',
      },
    ],
    templates: [
      {
        title: 'Church Flyer Template',
        description: 'Professional flyer templates for church events',
        downloads: '650',
        type: 'Flyer',
      },
      {
        title: 'Event Poster Template',
        description: 'Eye-catching poster designs for special events',
        downloads: '420',
        type: 'Poster',
      },
      {
        title: 'Sermon Series Template',
        description: 'Templates for sermon series announcements',
        downloads: '380',
        type: 'Series',
      },
      {
        title: 'Bible Study Template',
        description: 'Clean templates for Bible study materials',
        downloads: '520',
        type: 'Study',
      },
    ],
    beats: [
      {
        title: 'Worship Beat Pack',
        description: '10 professional worship beats for your ministry',
        downloads: '2.1K',
        genre: 'Worship',
      },
      {
        title: 'Gospel Instrumentals',
        description: 'High-quality gospel instrumentals collection',
        downloads: '1.8K',
        genre: 'Gospel',
      },
      {
        title: 'Praise & Worship Loops',
        description: 'Ready-to-use loops for praise sessions',
        downloads: '1.5K',
        genre: 'Praise',
      },
      {
        title: 'Contemporary Christian Beats',
        description: 'Modern beats for contemporary worship',
        downloads: '1.2K',
        genre: 'Contemporary',
      },
    ],
    wallpapers: [
      {
        title: 'Inspirational Quotes',
        description: 'Beautiful wallpapers with inspirational Christian quotes',
        downloads: '3.5K',
        category: 'Quotes',
      },
      {
        title: 'Bible Verse Wallpapers',
        description: 'Scripture-based wallpapers for your devices',
        downloads: '2.9K',
        category: 'Scripture',
      },
      {
        title: 'Worship Wallpapers',
        description: 'Stunning worship-themed wallpapers',
        downloads: '2.1K',
        category: 'Worship',
      },
      {
        title: 'Prayer Wallpapers',
        description: 'Peaceful prayer-themed backgrounds',
        downloads: '1.8K',
        category: 'Prayer',
      },
    ],
    affiliateProducts: [
      {
        title: 'Christian Books Collection',
        description: 'Recommended Christian books for spiritual growth',
        category: 'Books',
        price: 'From ₦2,500',
      },
      {
        title: 'Bible Study Gadgets',
        description: 'Tablets and devices perfect for Bible study',
        category: 'Gadgets',
        price: 'From ₦15,000',
      },
      {
        title: 'Worship Equipment',
        description: 'Quality audio equipment for worship ministry',
        category: 'Equipment',
        price: 'From ₦25,000',
      },
      {
        title: 'Christian Apparel',
        description: 'Faith-inspired clothing and accessories',
        category: 'Apparel',
        price: 'From ₦3,000',
      },
    ],
  };
}

export default async function ResourcesPage() {
  const resourcesData = await generateResourcesData();

  return (
    <MainLayout>
      <ResourcesHero />
      <Suspense fallback={<ResourcesPageSkeleton />}>
        <ResourcesPageClient {...resourcesData} />
      </Suspense>
    </MainLayout>
  );
}
