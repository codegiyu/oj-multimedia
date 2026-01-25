import type { Metadata } from 'next';
import { Suspense } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { TestimoniesHero } from '@/components/section/community/testimonies/TestimoniesHero';
import {
  TestimoniesPageClient,
  type Testimony,
} from '@/components/section/community/testimonies/TestimoniesPageClient';
import { TestimoniesPageSkeleton } from '@/components/section/community/testimonies/TestimoniesPageSkeleton';

export const metadata: Metadata = {
  title: 'Testimonies - Stories of Faith & Transformation',
  description:
    "Read powerful testimonies from our community. Stories of healing, breakthrough, transformation, and God's faithfulness in the lives of believers.",
};

// Generate testimonies data (in a real app, this would come from an API or database)
async function generateTestimoniesData(): Promise<{
  testimonies: Testimony[];
  featured: Testimony[];
}> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1500));

  const allTestimonies: Testimony[] = [
    {
      id: 1,
      author: 'Michelle K.',
      avatar: '/images/artist-2.jpg',
      content:
        'This platform changed my life. I found a community that truly supports and uplifts each other. Sharing my story here helped me heal and find purpose. God used this community to restore my faith and bring me closer to Him.',
      likes: 342,
      comments: 56,
      timeAgo: '2 hours ago',
      category: 'Healing',
    },
    {
      id: 2,
      author: 'David O.',
      avatar: '/images/artist-1.jpg',
      content:
        'After years of feeling lost, I found purpose through the devotionals and community discussions. Forever grateful for this space where I can grow in my faith and connect with other believers.',
      likes: 518,
      comments: 89,
      timeAgo: '5 hours ago',
      category: 'Purpose',
    },
    {
      id: 3,
      author: 'Grace A.',
      avatar: '/images/artist-3.jpg',
      content:
        'The prayer community here is incredible. When I posted my request, I received so much love and support. God answered my prayers in ways I never imagined possible. This platform is truly a blessing.',
      likes: 276,
      comments: 42,
      timeAgo: '1 day ago',
      category: 'Prayer',
    },
    {
      id: 4,
      author: 'James M.',
      avatar: '/images/artist-1.jpg',
      content:
        'I was going through a difficult season in my marriage, but through the resources and encouragement I found here, God restored our relationship. We are stronger than ever, and I give all glory to God.',
      likes: 412,
      comments: 67,
      timeAgo: '2 days ago',
      category: 'Marriage',
    },
    {
      id: 5,
      author: 'Sarah T.',
      avatar: '/images/artist-2.jpg',
      content:
        'God healed me from a chronic illness that doctors said was incurable. Through prayer and faith, I experienced a miracle. I share this to encourage others that nothing is impossible with God.',
      likes: 689,
      comments: 124,
      timeAgo: '3 days ago',
      category: 'Healing',
    },
    {
      id: 6,
      author: 'Michael P.',
      avatar: '/images/artist-3.jpg',
      content:
        'I lost my job and was in financial crisis, but God provided in miraculous ways. Through this community, I found peace and learned to trust God completely. He is truly Jehovah Jireh.',
      likes: 523,
      comments: 98,
      timeAgo: '4 days ago',
      category: 'Provision',
    },
    {
      id: 7,
      author: 'Ruth K.',
      avatar: '/images/artist-2.jpg',
      content:
        'After struggling with anxiety and depression for years, God delivered me completely. The worship music and devotionals here played a huge role in my healing journey. I am free today!',
      likes: 445,
      comments: 76,
      timeAgo: '5 days ago',
      category: 'Deliverance',
    },
    {
      id: 8,
      author: 'Peter D.',
      avatar: '/images/artist-1.jpg',
      content:
        'I was far from God, living in sin, but His grace found me. Through the sermons and testimonies I heard here, I gave my life to Christ. Today I am a new creation, serving God with all my heart.',
      likes: 612,
      comments: 145,
      timeAgo: '1 week ago',
      category: 'Salvation',
    },
    {
      id: 9,
      author: 'Esther F.',
      avatar: '/images/artist-3.jpg',
      content:
        'God blessed us with a child after years of waiting. The prayers and encouragement from this community sustained us during the difficult times. Our miracle baby is now 6 months old!',
      likes: 567,
      comments: 112,
      timeAgo: '1 week ago',
      category: 'Blessing',
    },
  ];

  return {
    testimonies: allTestimonies,
    featured: allTestimonies.filter((_, index) => index < 3),
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
