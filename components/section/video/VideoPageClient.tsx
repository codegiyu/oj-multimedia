'use client';

import { VideoCategories } from './VideoCategories';
import { TrendingVideos, type TrendingVideo } from './TrendingVideos';
import { FeaturedVideos, type FeaturedVideo } from './FeaturedVideos';
import { RecentVideoUploads, type RecentVideoUpload } from './RecentVideoUploads';
import { ShortFormVideos, type ShortFormVideo } from './ShortFormVideos';
import { CreatorSpotlight, type FeaturedCreator } from './CreatorSpotlight';
import { VideoUploadCTA } from './VideoUploadCTA';

interface VideoPageClientProps {
  trendingVideos: TrendingVideo[];
  featuredVideos: FeaturedVideo[];
  recentUploads: RecentVideoUpload[];
  shortFormVideos: ShortFormVideo[];
  featuredCreators: FeaturedCreator[];
}

export const VideoPageClient = ({
  trendingVideos,
  featuredVideos,
  recentUploads,
  shortFormVideos,
  featuredCreators,
}: VideoPageClientProps) => {
  return (
    <>
      <VideoCategories />
      <TrendingVideos videos={trendingVideos} />
      <FeaturedVideos videos={featuredVideos} />
      <RecentVideoUploads uploads={recentUploads} />
      <ShortFormVideos videos={shortFormVideos} />
      <CreatorSpotlight creators={featuredCreators} />
      <VideoUploadCTA />
    </>
  );
};
