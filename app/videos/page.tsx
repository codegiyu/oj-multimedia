import type { Metadata } from 'next';
import { Suspense } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { VideoHero } from '@/components/section/video/VideoHero';
import { VideoPageClient } from '@/components/section/video/VideoPageClient';
import { VideoPageSkeleton } from '@/components/section/video/VideoPageSkeleton';
import type { TrendingVideo } from '@/components/section/video/TrendingVideos';
import type { FeaturedVideo } from '@/components/section/video/FeaturedVideos';
import type { RecentVideoUpload } from '@/components/section/video/RecentVideoUploads';
import type { ShortFormVideo } from '@/components/section/video/ShortFormVideos';
import type { FeaturedCreator } from '@/components/section/video/CreatorSpotlight';
import { ARTIST_PROFILES } from '@/lib/constants/community/artists';
import { callServerApi } from '@/lib/services/serverApi';
import { filterByCategory } from '@/lib/utils/videos';
import {
  mapPublicVideoToTrendingVideo,
  mapPublicVideoToFeaturedVideo,
  mapPublicVideoToRecentUpload,
  mapPublicVideoToShortForm,
} from '@/lib/utils/publicApiMappers';

export const metadata: Metadata = {
  title: 'Videos - Trending & Creative Content',
  description:
    'Discover trending videos, watch creative content, explore music videos, short clips, talks, and inspirational videos from talented creators. Publishing is curated—contact us to submit videos for review.',
};

export const dynamic = 'force-dynamic';

async function fetchVideoSections(category: string) {
  const categoryParam =
    category && category !== 'all' ? `&category=${encodeURIComponent(category)}` : '';
  const baseQuery = `?limit=12&page=1&status=published${categoryParam}` as const;

  const [trendingRes, featuredRes, recentRes, shortRes] = await Promise.all([
    callServerApi('PUBLIC_GET_VIDEOS', { query: `${baseQuery}&type=trending` }),
    callServerApi('PUBLIC_GET_VIDEOS', { query: `${baseQuery}&type=featured` }),
    callServerApi('PUBLIC_GET_VIDEOS', { query: `${baseQuery}&type=recent` }),
    callServerApi('PUBLIC_GET_VIDEOS', { query: `${baseQuery}&type=short-form` }),
  ]);

  let errorMessage: string | null = null;
  if (trendingRes.type === 'error')
    errorMessage = trendingRes.error?.message ?? 'Failed to load videos';
  else if (featuredRes.type === 'error')
    errorMessage = featuredRes.error?.message ?? 'Failed to load featured';
  else if (recentRes.type === 'error')
    errorMessage = recentRes.error?.message ?? 'Failed to load recent';
  else if (shortRes.type === 'error')
    errorMessage = shortRes.error?.message ?? 'Failed to load short form';

  const rawTrending = trendingRes.type === 'success' ? (trendingRes.data?.videos ?? []) : [];
  const rawFeatured = featuredRes.type === 'success' ? (featuredRes.data?.videos ?? []) : [];
  const rawRecent = recentRes.type === 'success' ? (recentRes.data?.videos ?? []) : [];
  const rawShort = shortRes.type === 'success' ? (shortRes.data?.videos ?? []) : [];

  const trendingVideos: TrendingVideo[] = filterByCategory(rawTrending, category)
    .map(mapPublicVideoToTrendingVideo)
    .slice(0, 8);
  const featuredVideos: FeaturedVideo[] = filterByCategory(rawFeatured, category)
    .map(mapPublicVideoToFeaturedVideo)
    .slice(0, 4);
  const recentUploads: RecentVideoUpload[] = filterByCategory(rawRecent, category)
    .map(mapPublicVideoToRecentUpload)
    .slice(0, 6);
  const shortFormVideos: ShortFormVideo[] = filterByCategory(rawShort, category)
    .map(mapPublicVideoToShortForm)
    .slice(0, 8);

  const featuredCreators: FeaturedCreator[] = ARTIST_PROFILES.filter(p => p.isFeatured)
    .slice(0, 6)
    .map(p => ({
      _id: p._id,
      name: p.name,
      category: p.genre ?? 'Creator',
      avatar: p.image ?? '',
      followers: p.followers ?? '0',
      videos: p.videos ?? 0,
      views: '0',
      verified: p.verified ?? false,
      latestVideo: undefined,
    }));

  return {
    trendingVideos,
    featuredVideos,
    recentUploads,
    shortFormVideos,
    featuredCreators,
    initialErrorMessage: errorMessage,
  };
}

interface VideosPageProps {
  searchParams: Promise<{ category?: string }>;
}

export default async function VideosPage({ searchParams }: VideosPageProps) {
  const params = await searchParams;
  const category = params.category ?? 'all';

  return (
    <MainLayout>
      <VideoHero />
      <Suspense fallback={<VideoPageSkeleton />}>
        <VideosPageServer category={category} />
      </Suspense>
    </MainLayout>
  );
}

async function VideosPageServer({ category }: { category: string }) {
  const data = await fetchVideoSections(category);
  return <VideoPageClient {...data} />;
}
