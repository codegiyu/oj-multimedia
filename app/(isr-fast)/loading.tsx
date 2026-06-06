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
import { TopChartsSectionShell } from './_sections/TopChartsSectionShell';

export default function HomeLoading() {
  return (
    <MainLayout>
      <HomeMobileJumpNav />
      <HeroSection />
      <HomeAdvertStripSkeleton />
      <SimpleMusicRailSkeleton />
      <SimpleMusicRailSkeleton />
      <TrendingMusicSectionSkeleton />
      <TrendingVideosSectionSkeleton />
      <SimpleVideoRailSkeleton />
      <DevotionalsRailSkeleton />
      <TopChartsSectionShell
        charts={<ChartsColumnSkeleton />}
        artists={<RisingArtistsColumnSkeleton />}
      />
      <NewsSectionSkeleton />
      <MarketplaceSectionSkeleton />
      <CommunitySectionFrame
        highlights={<CommunityHighlightsSkeleton />}
        poll={<PollSectionSkeleton />}
      />
      <HomeAdvertStripSkeleton />
      <UploadCTA />
    </MainLayout>
  );
}
