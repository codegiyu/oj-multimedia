'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'motion/react';
import { Star, ArrowRight, Video } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SectionContainer } from '@/components/general/SectionContainer';
import { DataLoadError } from '@/components/general/DataLoadError';
import { VideoCategories } from './VideoCategories';
import type { CategoryNavItem } from '@/lib/utils/contentCategoryNav';
import { VideoUploadCTA } from './VideoUploadCTA';
import { SectionEmptyState } from '@/components/general/SectionEmptyState';
import { SectionComp } from '@/components/general/SectionComp';
import { VideoCard } from '@/components/cards/VideoCard';
import type { FeaturedVideo } from './FeaturedVideos';
import { MEDIA_BROWSE_GRID_CLASS } from '@/lib/constants/mediaCardLayout';

interface FeaturedVideosPageClientProps {
  categoryOptions?: CategoryNavItem[];
  featuredVideos: FeaturedVideo[];
  initialErrorMessage?: string | null;
  showCategoryNav?: boolean;
}

export const FeaturedVideosPageClient = ({
  categoryOptions = [],
  featuredVideos,
  initialErrorMessage = null,
  showCategoryNav = true,
}: FeaturedVideosPageClientProps) => {
  const router = useRouter();
  const [displayedItems, setDisplayedItems] = useState(20);
  const [isLoading, setIsLoading] = useState(false);

  const loadMoreItems = async () => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 800));
    setDisplayedItems(prev => Math.min(prev + 12, featuredVideos.length));
    setIsLoading(false);
  };

  const hasMore = displayedItems < featuredVideos.length;
  const itemsToShow = featuredVideos.slice(0, displayedItems);

  if (initialErrorMessage && featuredVideos.length === 0) {
    return (
      <SectionContainer>
        <DataLoadError
          title="Unable to load featured videos"
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
      <SectionComp
        icon={Star}
        iconColor="primary"
        heading="Featured Videos"
        subtext="Editor's picks and popular uploads"
        viewAllLink="/videos/featured"
        contentProps={{ enableAnimation: false }}>
        {itemsToShow.length === 0 ? (
          <SectionEmptyState
            title="No Featured Videos"
            description="We couldn't find any featured videos in this category. Try selecting a different category or check back later for new content."
            icon={Star}
            showDefaultActions
          />
        ) : (
          <>
            <div className={MEDIA_BROWSE_GRID_CLASS}>
              {itemsToShow.map((video, index) => (
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
                    views={video.views || '0'}
                    duration={video.duration}
                    category={video.category || 'Video'}
                    variant="featured"
                    featured={video.featured}
                  />
                </motion.div>
              ))}
            </div>

            {hasMore && (
              <div className="flex justify-center mt-10">
                <motion.button
                  onClick={loadMoreItems}
                  disabled={isLoading}
                  whileHover={{ scale: isLoading ? 1 : 1.02 }}
                  whileTap={{ scale: isLoading ? 1 : 0.98 }}
                  className="px-8 py-3 rounded-full bg-muted text-foreground font-medium hover:bg-muted/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2">
                  {isLoading ? (
                    'Loading...'
                  ) : (
                    <>
                      Load More Videos
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </motion.button>
              </div>
            )}
          </>
        )}
      </SectionComp>
      <VideoUploadCTA />
    </>
  );
};
