'use client';

import { useRouter } from 'next/navigation';
import { motion } from 'motion/react';
import { Flame, Video } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SectionContainer } from '@/components/general/SectionContainer';
import { DataLoadError } from '@/components/general/DataLoadError';
import { VideoCategories } from './VideoCategories';
import type { CategoryNavItem } from '@/lib/utils/contentCategoryNav';
import { VideoUploadCTA } from './VideoUploadCTA';
import { SectionEmptyState } from '@/components/general/SectionEmptyState';
import { ContentBrowseList } from '@/components/general/ContentBrowseList';
import { VideoCard } from '@/components/cards/VideoCard';
import type { TrendingVideo } from './TrendingVideos';
import { MEDIA_BROWSE_GRID_CLASS } from '@/lib/constants/mediaCardLayout';
import type { Pagination } from '@/lib/types/pagination';

interface TrendingVideosPageClientProps {
  categoryOptions?: CategoryNavItem[];
  trendingVideos: TrendingVideo[];
  pagination?: Pagination | null;
  initialErrorMessage?: string | null;
  showCategoryNav?: boolean;
}

export const TrendingVideosPageClient = ({
  categoryOptions = [],
  trendingVideos,
  pagination = null,
  initialErrorMessage = null,
  showCategoryNav = true,
}: TrendingVideosPageClientProps) => {
  const router = useRouter();

  if (initialErrorMessage && trendingVideos.length === 0) {
    return (
      <SectionContainer>
        <DataLoadError
          title="Unable to load trending videos"
          message={initialErrorMessage}
          onRetry={() => router.refresh()}
          icon={<Video className="w-8 h-8 text-destructive" />}
        />
      </SectionContainer>
    );
  }

  return (
    <>
      {showCategoryNav ? <VideoCategories categoryOptions={categoryOptions} /> : null}
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
      {trendingVideos.length === 0 ? (
        <SectionContainer>
          <SectionEmptyState
            title="No Trending Videos"
            description="We couldn't find any trending videos in this category. Try selecting a different category or check back later for new content."
            icon={Flame}
            showDefaultActions
          />
        </SectionContainer>
      ) : (
        <ContentBrowseList pagination={pagination} gridClassName={MEDIA_BROWSE_GRID_CLASS}>
          {trendingVideos.map((video, index) => (
            <motion.div
              key={video._id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.05 }}>
              <VideoCard
                _id={video._id}
                title={video.title}
                creator={video.creator}
                thumbnail={video.thumbnail}
                views={video.views}
                duration={video.duration}
                category="Video"
              />
            </motion.div>
          ))}
        </ContentBrowseList>
      )}
      <VideoUploadCTA />
    </>
  );
};
