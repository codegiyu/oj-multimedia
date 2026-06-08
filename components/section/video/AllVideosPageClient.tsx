'use client';

import { motion } from 'motion/react';
import { Video } from 'lucide-react';
import { BrowseListPageClient } from '@/components/general/BrowseListPageClient';
import { VideoCategories } from './VideoCategories';
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
  return (
    <BrowseListPageClient
      config={config}
      items={videos}
      pagination={pagination}
      initialErrorMessage={initialErrorMessage}
      errorTitle="Unable to load videos"
      errorIcon={<Video className="w-8 h-8 text-destructive" />}
      empty={{
        title: 'No Videos Found',
        description:
          'Try adjusting your search, sort, or category filters, or check back later for new uploads.',
        icon: Video,
        showDefaultActions: true,
      }}
      gridClassName={MEDIA_BROWSE_GRID_CLASS}
      afterToolbar={<VideoCategories categoryOptions={categoryOptions} />}
      renderItem={(video, index) => (
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
      )}
    />
  );
}
