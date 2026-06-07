'use client';

import { useRouter } from 'next/navigation';
import { motion } from 'motion/react';
import { Video } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SectionContainer } from '@/components/general/SectionContainer';
import { DataLoadError } from '@/components/general/DataLoadError';
import { ContentAllBrowseToolbar } from '@/components/general/ContentAllBrowseToolbar';
import { VideoCategories } from './VideoCategories';
import { SectionEmptyState } from '@/components/general/SectionEmptyState';
import { ContentBrowseList } from '@/components/general/ContentBrowseList';
import { VideoCard } from '@/components/cards/VideoCard';
import type { RecentVideoUpload } from './RecentVideoUploads';
import { MEDIA_BROWSE_GRID_CLASS } from '@/lib/constants/mediaCardLayout';
import type { AllBrowseConfig } from '@/lib/constants/allBrowseConfig';
import type { CategoryNavItem } from '@/lib/utils/contentCategoryNav';
import type { Pagination } from '@/lib/types/pagination';

interface AllVideosPageClientProps {
  config: AllBrowseConfig;
  categoryOptions: CategoryNavItem[];
  videos: RecentVideoUpload[];
  pagination?: Pagination | null;
  initialErrorMessage?: string | null;
}

export function AllVideosPageClient({
  config,
  categoryOptions,
  videos,
  pagination = null,
  initialErrorMessage = null,
}: AllVideosPageClientProps) {
  const router = useRouter();

  if (initialErrorMessage && videos.length === 0) {
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
      <SectionContainer className="pb-0">
        <ContentAllBrowseToolbar config={config} />
      </SectionContainer>
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
      {videos.length === 0 ? (
        <SectionContainer>
          <SectionEmptyState
            title="No Videos Found"
            description="Try adjusting your search, sort, or category filters, or check back later for new uploads."
            icon={Video}
            showDefaultActions
          />
        </SectionContainer>
      ) : (
        <ContentBrowseList pagination={pagination} gridClassName={MEDIA_BROWSE_GRID_CLASS}>
          {videos.map((video, index) => (
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
                category={video.category}
              />
            </motion.div>
          ))}
        </ContentBrowseList>
      )}
    </>
  );
}
