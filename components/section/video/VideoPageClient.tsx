'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { SectionContainer } from '@/components/general/SectionContainer';
import { DataLoadError } from '@/components/general/DataLoadError';
import { VideoCategories } from './VideoCategories';
import { TrendingVideos, type TrendingVideo } from './TrendingVideos';
import { FeaturedVideos, type FeaturedVideo } from './FeaturedVideos';
import { RecentVideoUploads, type RecentVideoUpload } from './RecentVideoUploads';
import { ShortFormVideos, type ShortFormVideo } from './ShortFormVideos';
import { CreatorSpotlight, type FeaturedCreator } from './CreatorSpotlight';
import { VideoUploadCTA } from './VideoUploadCTA';
import { Video } from 'lucide-react';
import type { CategoryNavItem } from '@/lib/utils/contentCategoryNav';

interface VideoPageClientProps {
  trendingVideos: TrendingVideo[];
  featuredVideos: FeaturedVideo[];
  recentUploads: RecentVideoUpload[];
  shortFormVideos: ShortFormVideo[];
  featuredCreators: FeaturedCreator[];
  categoryOptions: CategoryNavItem[];
  initialErrorMessage?: string | null;
}

export const VideoPageClient = ({
  trendingVideos,
  featuredVideos,
  recentUploads,
  shortFormVideos,
  featuredCreators,
  categoryOptions,
  initialErrorMessage = null,
}: VideoPageClientProps) => {
  const router = useRouter();
  const hasAnyContent =
    trendingVideos.length > 0 ||
    featuredVideos.length > 0 ||
    recentUploads.length > 0 ||
    shortFormVideos.length > 0 ||
    featuredCreators.length > 0;

  if (initialErrorMessage && !hasAnyContent) {
    return (
      <SectionContainer>
        <DataLoadError
          title="Unable to load videos"
          message={initialErrorMessage}
          onRetry={() => router.refresh()}
          icon={<Video className="w-8 h-8 text-destructive" />}
        />
      </SectionContainer>
    );
  }

  return (
    <>
      <VideoCategories categoryOptions={categoryOptions} />
      {initialErrorMessage && (
        <div className="container mx-auto px-4 mb-4">
          <div className="rounded-md border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive flex items-center justify-between gap-4">
            <span>{initialErrorMessage}</span>
            <Button variant="outline" size="sm" onClick={() => router.refresh()}>
              Retry
            </Button>
          </div>
        </div>
      )}
      <TrendingVideos videos={trendingVideos} />
      <FeaturedVideos videos={featuredVideos} />
      <RecentVideoUploads uploads={recentUploads} />
      <ShortFormVideos videos={shortFormVideos} />
      <CreatorSpotlight creators={featuredCreators} />
      <VideoUploadCTA />
    </>
  );
};
