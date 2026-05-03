import type { Metadata } from 'next';
import { Suspense } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { SubPageHero } from '@/components/general/SubPageHero';
import { TestimoniesPageSkeleton } from '@/components/section/community/testimonies/TestimoniesPageSkeleton';
import { AllTestimonies } from '@/components/section/community/testimonies/AllTestimonies';
import { TESTIMONIES_ITEMS } from '@/lib/constants/community/testimonies';
import type { Testimony } from '@/components/section/community/testimonies/TestimoniesPageClient';

export const metadata: Metadata = {
  title: 'Latest Testimonies - Recent Stories',
  description: 'Read the most recent testimonies shared by our community members.',
};

async function generateLatestTestimoniesData() {
  await new Promise(resolve => setTimeout(resolve, 1500));

  const latestTestimonies: Testimony[] = TESTIMONIES_ITEMS.filter(item => item.isLatest)
    .sort((a, b) => {
      const timeA = a.timeAgo || '';
      const timeB = b.timeAgo || '';
      return timeA.localeCompare(timeB);
    })
    .map(item => ({
      _id: item._id,
      author: item.author,
      avatar: item.avatar,
      content: item.content,
      likes: item.likes,
      comments: item.comments,
      timeAgo: item.timeAgo,
      category: item.category,
    }));

  return {
    latestTestimonies,
  };
}

export default async function LatestTestimoniesPage() {
  const data = await generateLatestTestimoniesData();

  return (
    <MainLayout>
      <SubPageHero
        title="Latest Testimonies"
        titleHighlight="Latest"
        description="Read the most recent testimonies shared by our community members. Fresh stories of hope and transformation."
        badgeText="Recent Stories"
        badgeIcon="Clock"
        backUrl="/community/testimonies"
        backLabel="Back to Testimonies"
        stats={[{ icon: 'Clock', text: 'Updated regularly' }, { text: 'Fresh content' }]}
      />
      <Suspense fallback={<TestimoniesPageSkeleton />}>
        <div className="container mx-auto px-4 pb-16">
          <AllTestimonies testimonies={data.latestTestimonies} />
        </div>
      </Suspense>
    </MainLayout>
  );
}
