import type { Metadata } from 'next';
import { Suspense } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { TestimoniesHero } from '@/components/section/community/testimonies/TestimoniesHero';
import {
  TestimoniesPageClient,
  type Testimony,
} from '@/components/section/community/testimonies/TestimoniesPageClient';
import { TestimoniesPageSkeleton } from '@/components/section/community/testimonies/TestimoniesPageSkeleton';
import { TESTIMONIES_ITEMS } from '@/lib/constants/community/testimonies';

export const metadata: Metadata = {
  title: 'Testimonies - Stories of Faith & Transformation',
  description:
    "Read powerful testimonies from our community. Stories of healing, breakthrough, transformation, and God's faithfulness in the lives of believers.",
};

// Force dynamic rendering to ensure searchParams changes trigger re-renders
export const dynamic = 'force-dynamic';

// Generate testimonies data from central constants
async function generateTestimoniesData(): Promise<{
  testimonies: Testimony[];
  featured: Testimony[];
}> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1500));

  // Transform all testimonies
  const allTestimonies: Testimony[] = TESTIMONIES_ITEMS.map(item => ({
    id: item.id,
    author: item.author,
    avatar: item.avatar,
    content: item.content,
    likes: item.likes,
    comments: item.comments,
    timeAgo: item.timeAgo,
    category: item.category,
  }));

  return {
    testimonies: allTestimonies,
    featured: allTestimonies.filter(item => item.id <= 3),
  };
}

export default async function TestimoniesPage() {
  const testimoniesData = await generateTestimoniesData();

  return (
    <MainLayout>
      <TestimoniesHero />
      <Suspense fallback={<TestimoniesPageSkeleton />}>
        <TestimoniesPageClient {...testimoniesData} />
      </Suspense>
    </MainLayout>
  );
}
