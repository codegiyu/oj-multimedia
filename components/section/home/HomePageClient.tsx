'use client';

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
}: HomePageClientProps) => {
  return (
    <>
      <TrendingMusicSection music={trendingMusic} />
      <TrendingVideosSection videos={trendingVideos} />
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
