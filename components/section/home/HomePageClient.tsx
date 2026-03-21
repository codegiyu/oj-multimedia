'use client';

import { Suspense } from 'react';
import {
  CommunitySection,
  MarketplaceSection,
  NewsSection,
  TopChartsSection,
  TrendingMusicSection,
  TrendingVideosSection,
  type TrendingMusicItem,
  type TrendingVideoItem,
  type ChartItem,
  type RisingArtist,
  type NewsArticle,
  type MarketplaceProduct,
  type CommunityPost,
  type PollOption,
} from '.';
import { UploadCTA } from '../shared';

const TrendingMusicRailSkeleton = () => (
  <div className="container mx-auto px-4 py-8">
    <div className="h-40 rounded-2xl bg-muted animate-pulse" />
  </div>
);

const TrendingVideosRailSkeleton = () => (
  <div className="container mx-auto px-4 py-8">
    <div className="h-48 rounded-2xl bg-muted animate-pulse" />
  </div>
);

interface HomePageClientProps {
  trendingMusic: TrendingMusicItem[];
  trendingVideos: TrendingVideoItem[];
  chartData: ChartItem[];
  risingArtists: RisingArtist[];
  newsArticles: NewsArticle[];
  marketplaceProducts: MarketplaceProduct[];
  communityPosts: CommunityPost[];
  pollOptions: PollOption[];
  pollTotalVotes: number;
  initialErrorMessage: string | null;
}

export const HomePageClient = ({
  trendingMusic,
  trendingVideos,
  chartData,
  risingArtists,
  newsArticles,
  marketplaceProducts,
  communityPosts,
  pollOptions,
  pollTotalVotes,
  initialErrorMessage,
}: HomePageClientProps) => {
  return (
    <>
      {initialErrorMessage ? (
        <div className="container mx-auto px-4 pt-4">
          <div className="mb-4 rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
            {initialErrorMessage}
          </div>
        </div>
      ) : null}

      <Suspense fallback={<TrendingMusicRailSkeleton />}>
        <TrendingMusicSection music={trendingMusic} />
      </Suspense>
      <Suspense fallback={<TrendingVideosRailSkeleton />}>
        <TrendingVideosSection videos={trendingVideos} />
      </Suspense>
      <TopChartsSection chartData={chartData} risingArtists={risingArtists} />
      <NewsSection articles={newsArticles} />
      <MarketplaceSection products={marketplaceProducts} />
      <CommunitySection
        posts={communityPosts}
        pollOptions={pollOptions}
        pollTotalVotes={pollTotalVotes}
      />
      <UploadCTA />
    </>
  );
};
