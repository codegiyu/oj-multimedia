import type { Metadata } from 'next';
import { Suspense } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { SubPageHero } from '@/components/general/SubPageHero';
import { TestimoniesPageSkeleton } from '@/components/section/community/testimonies/TestimoniesPageSkeleton';
import { FeaturedTestimonies } from '@/components/section/community/testimonies/FeaturedTestimonies';
import { TESTIMONIES_ITEMS } from '@/lib/constants/community/testimonies';
import type { Testimony } from '@/components/section/community/testimonies/TestimoniesPageClient';

export const metadata: Metadata = {
  title: 'Featured Testimonies - Inspiring Stories',
  description:
    'Read featured testimonies of transformation, healing, and breakthrough from our community.',
};

export const dynamic = 'force-dynamic';

async function generateFeaturedTestimoniesData() {
  await new Promise(resolve => setTimeout(resolve, 1500));

  const featuredTestimonies: Testimony[] = TESTIMONIES_ITEMS.filter(item => item.isFeatured).map(
    item => ({
      _id: item._id,
      author: item.author,
      avatar: item.avatar,
      content: item.content,
      likes: item.likes,
      comments: item.comments,
      timeAgo: item.timeAgo,
      category: item.category,
    })
  );

  return {
    featuredTestimonies,
  };
}

export default async function FeaturedTestimoniesPage() {
  const data = await generateFeaturedTestimoniesData();

  return (
    <MainLayout>
      <SubPageHero
        title="Featured Testimonies"
        titleHighlight="Featured"
        description="Read featured testimonies of transformation, healing, and breakthrough from our community. These stories inspire and encourage."
        badgeText="Inspiring Stories"
        badgeIcon="Sparkles"
        backUrl="/community/testimonies"
        backLabel="Back to Testimonies"
        stats={[{ icon: 'Sparkles', text: 'Handpicked stories' }, { text: 'Inspiring content' }]}
      />
      <Suspense fallback={<TestimoniesPageSkeleton />}>
        <div className="container mx-auto px-4 pb-16">
          <FeaturedTestimonies testimonies={data.featuredTestimonies} />
        </div>
      </Suspense>
    </MainLayout>
  );
}
