'use client';

import { Suspense } from 'react';
import {
  CommunitySection,
  MarketplaceSection,
  NewsSection,
  TopChartsSection,
  TrendingMusicSection,
  TrendingVideosSection,
  HomeAdvertStrip,
  SimpleMusicRail,
  SimpleVideoRail,
  DevotionalsRail,
  type TrendingMusicItem,
  type TrendingVideoItem,
  type ChartItem,
  type RisingArtist,
  type NewsArticle,
  type MarketplaceProduct,
  type PollOption,
  type HomeDevotionalCard,
} from '.';
import type { CommunityHighlightItem } from '@/lib/utils/mergeCommunityHighlights';
import { UploadCTA } from '../shared';
import { SimpleMusicRailSkeleton, SimpleVideoRailSkeleton } from '@/components/skeletons';
import type { IHomeAdvertItem } from '@/lib/constants/endpoints';

interface HomePageClientProps {
  advertsAfterHero: IHomeAdvertItem[];
  advertsBeforeCta: IHomeAdvertItem[];
  latestMusic: TrendingMusicItem[];
  latestSermons: TrendingMusicItem[];
  latestMovies: TrendingVideoItem[];
  latestDevotionals: HomeDevotionalCard[];
  featuredNews: NewsArticle[];
  trendingNews: NewsArticle[];
  trendingMusic: TrendingMusicItem[];
  trendingVideos: TrendingVideoItem[];
  chartData: ChartItem[];
  risingArtists: RisingArtist[];
  newsArticles: NewsArticle[];
  marketplaceProducts: MarketplaceProduct[];
  communityHighlights: CommunityHighlightItem[];
  pollOptions: PollOption[];
  pollTotalVotes: number;
  pollQuestion?: string;
  pollHref?: string;
  initialErrorMessage: string | null;
}

export const HomePageClient = ({
  advertsAfterHero,
  advertsBeforeCta,
  latestMusic,
  latestSermons,
  latestMovies,
  latestDevotionals,
  featuredNews,
  trendingNews,
  trendingMusic,
  trendingVideos,
  chartData,
  risingArtists,
  newsArticles,
  marketplaceProducts,
  communityHighlights,
  pollOptions,
  pollTotalVotes,
  pollQuestion,
  pollHref,
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

      <HomeAdvertStrip adverts={advertsAfterHero} />
      <Suspense fallback={<SimpleMusicRailSkeleton />}>
        <SimpleMusicRail
          heading="Latest music"
          subtext="New releases (excluding sermons)"
          viewAllLink="/music"
          music={latestMusic}
        />
      </Suspense>
      <Suspense fallback={<SimpleMusicRailSkeleton />}>
        <SimpleMusicRail
          heading="Latest sermons"
          subtext="Teaching and messages"
          viewAllLink="/music"
          music={latestSermons}
        />
      </Suspense>
      <Suspense fallback={<SimpleMusicRailSkeleton />}>
        <TrendingMusicSection music={trendingMusic} />
      </Suspense>
      <Suspense fallback={<SimpleVideoRailSkeleton />}>
        <TrendingVideosSection videos={trendingVideos} />
      </Suspense>
      <Suspense fallback={<SimpleVideoRailSkeleton />}>
        <SimpleVideoRail
          heading="Latest movies"
          subtext="Films and long-form video"
          viewAllLink="/videos"
          videos={latestMovies}
        />
      </Suspense>
      <DevotionalsRail items={latestDevotionals} />
      <TopChartsSection chartData={chartData} risingArtists={risingArtists} />
      {featuredNews.length > 0 && (
        <NewsSection
          articles={featuredNews}
          heading="Featured news"
          subtext="Editorial picks"
          viewAllLink="/news/featured"
          sectionId="news-featured"
        />
      )}
      {trendingNews.length > 0 && (
        <NewsSection
          articles={trendingNews}
          heading="Trending news"
          subtext="What readers engage with most"
          viewAllLink="/news/trending"
          sectionId="news-trending"
        />
      )}
      <NewsSection articles={newsArticles} />
      <MarketplaceSection products={marketplaceProducts} />
      <CommunitySection
        highlights={communityHighlights}
        pollOptions={pollOptions}
        pollTotalVotes={pollTotalVotes}
        pollQuestion={pollQuestion}
        pollHref={pollHref}
      />
      <HomeAdvertStrip adverts={advertsBeforeCta} />
      <UploadCTA />
    </>
  );
};
