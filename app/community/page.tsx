import type { Metadata } from 'next';
import { Suspense } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { CommunityHero } from '@/components/section/community/CommunityHero';
import { CommunityPageClient } from '@/components/section/community/CommunityPageClient';
import { CommunityPageSkeleton } from '@/components/section/community/CommunityPageSkeleton';
import type { Testimony } from '@/components/section/community/FeaturedTestimonies';
import type { Devotional } from '@/components/section/community/TrendingDevotionals';
import type { Discussion } from '@/components/section/community/ActiveDiscussions';
import { callServerApi } from '@/lib/services/serverApi';
import type { ApiErrorResponse } from '@/lib/types/http';
import type { ICommunityCategoryCountsRes } from '@/lib/constants/endpoints';
import { mapToTestimony, mapToDevotional, mapToDiscussion } from '@/lib/utils/communityApiMappers';

export const metadata: Metadata = {
  title: 'Community - Connect & Engage',
  description:
    'Join our vibrant community - share stories, connect with others, participate in discussions, polls, and engage with content creators.',
};

export const dynamic = 'force-dynamic';

const DEFAULT_CATEGORY_COUNTS: Record<string, number> = {
  devotionals: 0,
  testimonies: 0,
  prayerRequests: 0,
  askAPastor: 0,
  polls: 0,
  resources: 0,
  artists: 0,
  promoteYourContent: 0,
};

async function fetchCommunityData(): Promise<{
  categoryCounts: Record<string, number>;
  testimonies: Testimony[];
  devotionals: Devotional[];
  discussions: Discussion[];
  initialErrorMessage: string | null;
}> {
  const res = await callServerApi('PUBLIC_GET_COMMUNITY', {});
  if (res.error) {
    return {
      categoryCounts: DEFAULT_CATEGORY_COUNTS,
      testimonies: [],
      devotionals: [],
      discussions: [],
      initialErrorMessage:
        (res.error as ApiErrorResponse)?.message ?? 'Failed to load community data',
    };
  }
  const data = res.data as ICommunityCategoryCountsRes | undefined;
  if (!data) {
    return {
      categoryCounts: DEFAULT_CATEGORY_COUNTS,
      testimonies: [],
      devotionals: [],
      discussions: [],
      initialErrorMessage: null,
    };
  }
  const categoryCounts = { ...DEFAULT_CATEGORY_COUNTS, ...data.categoryCounts };

  const rawFeatured = (data.featuredTestimonies ?? []) as unknown[];
  const testimonies: Testimony[] = rawFeatured.map(t =>
    mapToTestimony(t as Record<string, unknown>)
  );

  const rawTrending = (data.trendingDevotionals ?? []) as unknown[];
  const devotionals: Devotional[] = rawTrending.map(d =>
    mapToDevotional(d as Record<string, unknown>)
  );

  const rawDiscussions = (data.activeDiscussions ?? []) as unknown[];
  const discussions: Discussion[] = rawDiscussions.map(d =>
    mapToDiscussion(d as Record<string, unknown>)
  );
  return {
    categoryCounts,
    testimonies,
    devotionals,
    discussions,
    initialErrorMessage: null,
  };
}

export default async function CommunityPage() {
  const communityData = await fetchCommunityData();

  return (
    <MainLayout>
      <CommunityHero />
      <Suspense fallback={<CommunityPageSkeleton />}>
        <CommunityPageClient {...communityData} />
      </Suspense>
    </MainLayout>
  );
}
