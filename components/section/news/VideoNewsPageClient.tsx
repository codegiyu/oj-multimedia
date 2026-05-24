'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'motion/react';
import { Play, Clock, ArrowRight, Newspaper } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { SectionContainer } from '@/components/general/SectionContainer';
import { DataLoadError } from '@/components/general/DataLoadError';
import { FillImage } from '@/components/general/FillImage';
import { NewsCategories } from './NewsCategories';
import type { CategoryNavItem } from '@/lib/utils/contentCategoryNav';
import { NewsletterCTA } from '../shared';
import { EmptyState } from './EmptyState';
import { SectionComp } from '@/components/general/SectionComp';
import type { VideoNewsItem } from './VideoNews';

interface VideoNewsPageClientProps {
  categoryOptions: CategoryNavItem[];
  videoNews: VideoNewsItem[];
  initialErrorMessage?: string | null;
}

export const VideoNewsPageClient = ({
  categoryOptions,

  videoNews,
  initialErrorMessage = null,
}: VideoNewsPageClientProps) => {
  const router = useRouter();
  const [displayedItems, setDisplayedItems] = useState(12);
  const [isLoading, setIsLoading] = useState(false);

  const loadMoreItems = async () => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 800));
    setDisplayedItems(prev => Math.min(prev + 6, videoNews.length));
    setIsLoading(false);
  };

  const hasMore = displayedItems < videoNews.length;
  const itemsToShow = videoNews.slice(0, displayedItems);

  if (initialErrorMessage && videoNews.length === 0) {
    return (
      <SectionContainer>
        <DataLoadError
          title="Unable to load video stories"
          message={initialErrorMessage}
          onRetry={() => router.refresh()}
          icon={<Newspaper className="w-8 h-8 text-destructive" />}
        />
      </SectionContainer>
    );
  }

  return (
    <>
      <NewsCategories categoryOptions={categoryOptions} />
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
        icon={Play}
        iconColor="primary"
        heading="Video Stories"
        subtext="Watch and explore"
        viewAllLink="/news/videos"
        background="bg-muted/30"
        contentProps={{ enableAnimation: false }}>
        {itemsToShow.length === 0 ? (
          <EmptyState
            title="No Video Stories"
            description="We couldn't find any video stories in this category. Try selecting a different category or check back later for new content."
            icon={<Play className="w-12 h-12 text-muted-foreground" />}
          />
        ) : (
          <>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {itemsToShow.map((video, index) => (
                <Link key={video._id} href={`/news/story/${video._id}`}>
                  <motion.article
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    whileHover={{ y: -6 }}
                    className="group cursor-pointer">
                    <div className="relative aspect-video rounded-xl overflow-hidden mb-3">
                      <FillImage
                        imageContext="public"
                        src={video.image}
                        alt={video.title}
                        sizes="(max-width: 768px) 50vw, 400px"
                        className="transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-foreground/20 group-hover:bg-foreground/30 transition-colors" />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <motion.div
                          whileHover={{ scale: 1.1 }}
                          className="w-12 h-12 rounded-full bg-primary flex items-center justify-center shadow-lg">
                          <Play className="w-5 h-5 text-primary-foreground fill-primary-foreground ml-0.5" />
                        </motion.div>
                      </div>
                      <span className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-foreground/80 text-primary-foreground text-xs font-medium flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {video.duration}
                      </span>
                      <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-primary/90 text-primary-foreground text-xs font-medium">
                        {video.category}
                      </span>
                    </div>
                    <h3 className="font-medium text-foreground line-clamp-2 group-hover:text-primary transition-colors text-sm">
                      {video.title}
                    </h3>
                    <p className="text-xs text-muted-foreground mt-1">{video.views} views</p>
                  </motion.article>
                </Link>
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
      <NewsletterCTA />
    </>
  );
};
