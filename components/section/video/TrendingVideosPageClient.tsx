'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'motion/react';
import { Flame, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SectionContainer } from '@/components/general/SectionContainer';
import { DataLoadError } from '@/components/general/DataLoadError';
import { VideoCategories } from './VideoCategories';
import type { CategoryNavItem } from '@/lib/utils/contentCategoryNav';
import { VideoUploadCTA } from './VideoUploadCTA';
import { SectionEmptyState } from '@/components/general/SectionEmptyState';
import { SectionComp } from '@/components/general/SectionComp';
import { VideoCard } from '@/components/cards/VideoCard';
import type { TrendingVideo } from './TrendingVideos';
import { Video } from 'lucide-react';

interface TrendingVideosPageClientProps {
  categoryOptions?: CategoryNavItem[];
  trendingVideos: TrendingVideo[];
  initialErrorMessage?: string | null;
  showCategoryNav?: boolean;
}

export const TrendingVideosPageClient = ({
  categoryOptions = [],
  trendingVideos,
  initialErrorMessage = null,
  showCategoryNav = true,
}: TrendingVideosPageClientProps) => {
  const router = useRouter();
  const [displayedItems, setDisplayedItems] = useState(20);
  const [isLoading, setIsLoading] = useState(false);

  const loadMoreItems = async () => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 800));
    setDisplayedItems(prev => Math.min(prev + 12, trendingVideos.length));
    setIsLoading(false);
  };

  const hasMore = displayedItems < trendingVideos.length;
  const itemsToShow = trendingVideos.slice(0, displayedItems);

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
      <SectionComp
        icon={Flame}
        iconColor="primary"
        heading="Trending Now"
        subtext="The most popular videos everyone is watching"
        viewAllLink="/videos/trending"
        contentProps={{ enableAnimation: false }}>
        {itemsToShow.length === 0 ? (
          <SectionEmptyState
            title="No Trending Videos"
            description="We couldn't find any trending videos in this category. Try selecting a different category or check back later for new content."
            icon={Flame}
            showDefaultActions
          />
        ) : (
          <>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
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
                    views={video.views}
                    duration={video.duration}
                    category="Video"
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
