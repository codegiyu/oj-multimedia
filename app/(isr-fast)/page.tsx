import { Suspense } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { HeroSection } from '@/components/section/home';
import { HomeMobileJumpNav } from '@/components/section/home/HomeMobileJumpNav';
import { CommunitySectionFrame } from '@/components/section/home/CommunitySectionFrame';
import { UploadCTA } from '@/components/section/shared';
import {
  TrendingMusicSectionSkeleton,
  TrendingVideosSectionSkeleton,
  DevotionalsRailSkeleton,
  ChartsColumnSkeleton,
  RisingArtistsColumnSkeleton,
  NewsSectionSkeleton,
  MarketplaceSectionSkeleton,
  CommunityHighlightsSkeleton,
  PollSectionSkeleton,
} from '@/components/section/home/HomePageSkeleton';
import {
  HomeAdvertStripSkeleton,
  SimpleMusicRailSkeleton,
  SimpleVideoRailSkeleton,
} from '@/components/skeletons';
import { ISR_PUBLIC_FETCH } from '@/lib/constants/isr';
import {
  PUBLIC_URL_KEYS,
  LEGACY_HOME_MUSIC_GENRE_KEY,
  LEGACY_HOME_VIDEO_CATEGORY_KEY,
} from '@/lib/constants/publicUrlKeys';
import { normalizePublicCategoryByScope } from '@/lib/utils/contentCategoriesServer';
import { HomeAdvertsAfterHeroSection } from './_sections/HomeAdvertsAfterHeroSection';
import { HomeAdvertsBeforeCtaSection } from './_sections/HomeAdvertsBeforeCtaSection';
import { LatestMusicSection } from './_sections/LatestMusicSection';
import { LatestSermonsSection } from './_sections/LatestSermonsSection';
import { LatestMoviesSection } from './_sections/LatestMoviesSection';
import { TrendingMusicSectionServer } from './_sections/TrendingMusicSectionServer';
import { TrendingVideosSectionServer } from './_sections/TrendingVideosSectionServer';
import { DevotionalsRailSection } from './_sections/DevotionalsRailSection';
import { TopChartsSectionShell } from './_sections/TopChartsSectionShell';
import { ChartsSection } from './_sections/ChartsSection';
import { RisingArtistsSection } from './_sections/RisingArtistsSection';
import { HomeNewsSection } from './_sections/HomeNewsSection';
import { MarketplaceSectionServer } from './_sections/MarketplaceSectionServer';
import { CommunityHighlightsSection } from './_sections/CommunityHighlightsSection';
import { PollSection } from './_sections/PollSection';
import {
  resolveHomeMusicCategoryParam,
  resolveHomeVideoCategoryParam,
  type HomeSearchParamsInput,
} from './_sections/homeSearchParams';

export const metadata = {
  title: 'Home - Discover Music, Charts & Latest Content',
  description:
    'Explore our dynamic homepage featuring music categories, top charts, recent uploads, download metrics, trending content, and discover new music and audio content. Stay engaged with our lively, ever-updating platform.',
};

type HomeSearchParams = Promise<HomeSearchParamsInput>;

interface HomeProps {
  searchParams: HomeSearchParams;
}

export default async function Home({ searchParams }: HomeProps) {
  const params = await searchParams;

  const [musicCategorySlug, videoCategorySlug] = await Promise.all([
    normalizePublicCategoryByScope(
      'music',
      resolveHomeMusicCategoryParam(
        params[PUBLIC_URL_KEYS.MUSIC_CATEGORY],
        params[LEGACY_HOME_MUSIC_GENRE_KEY]
      ),
      ISR_PUBLIC_FETCH.fast
    ),
    normalizePublicCategoryByScope(
      'video',
      resolveHomeVideoCategoryParam(
        params[PUBLIC_URL_KEYS.VIDEO_CATEGORY],
        params[LEGACY_HOME_VIDEO_CATEGORY_KEY]
      ),
      ISR_PUBLIC_FETCH.fast
    ),
  ]);

  const marketplaceCategory = params[PUBLIC_URL_KEYS.MARKETPLACE_CATEGORY];

  return (
    <MainLayout>
      <HomeMobileJumpNav />
      <HeroSection />

      <Suspense fallback={<HomeAdvertStripSkeleton />}>
        <HomeAdvertsAfterHeroSection />
      </Suspense>

      <Suspense fallback={<SimpleMusicRailSkeleton />}>
        <LatestMusicSection />
      </Suspense>

      <Suspense fallback={<SimpleMusicRailSkeleton />}>
        <LatestSermonsSection />
      </Suspense>

      <Suspense fallback={<TrendingMusicSectionSkeleton />}>
        <TrendingMusicSectionServer musicCategorySlug={musicCategorySlug} />
      </Suspense>

      <Suspense fallback={<TrendingVideosSectionSkeleton />}>
        <TrendingVideosSectionServer videoCategorySlug={videoCategorySlug} />
      </Suspense>

      <Suspense fallback={<SimpleVideoRailSkeleton />}>
        <LatestMoviesSection />
      </Suspense>

      <Suspense fallback={<DevotionalsRailSkeleton />}>
        <DevotionalsRailSection />
      </Suspense>

      <TopChartsSectionShell
        charts={
          <Suspense fallback={<ChartsColumnSkeleton />}>
            <ChartsSection />
          </Suspense>
        }
        artists={
          <Suspense fallback={<RisingArtistsColumnSkeleton />}>
            <RisingArtistsSection />
          </Suspense>
        }
      />

      <Suspense fallback={<NewsSectionSkeleton />}>
        <HomeNewsSection />
      </Suspense>

      <Suspense fallback={<MarketplaceSectionSkeleton />}>
        <MarketplaceSectionServer marketplaceCategory={marketplaceCategory} />
      </Suspense>

      <CommunitySectionFrame
        highlights={
          <Suspense fallback={<CommunityHighlightsSkeleton />}>
            <CommunityHighlightsSection />
          </Suspense>
        }
        poll={
          <Suspense fallback={<PollSectionSkeleton />}>
            <PollSection />
          </Suspense>
        }
      />

      <Suspense fallback={<HomeAdvertStripSkeleton />}>
        <HomeAdvertsBeforeCtaSection />
      </Suspense>

      <UploadCTA />
    </MainLayout>
  );
}
