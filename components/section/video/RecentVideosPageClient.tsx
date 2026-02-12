'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight } from 'lucide-react';
import { VideoCategories } from './VideoCategories';
import { VideoUploadCTA } from './VideoUploadCTA';
import { EmptyState } from '../news/EmptyState';
import { VideoCard } from '@/components/cards/VideoCard';
import type { RecentVideoUpload } from './RecentVideoUploads';

interface RecentVideosPageClientProps {
  recentUploads: (RecentVideoUpload & { category: string })[];
}

export const RecentVideosPageClient = ({ recentUploads }: RecentVideosPageClientProps) => {
  const [displayedItems, setDisplayedItems] = useState(20);
  const [isLoading, setIsLoading] = useState(false);

  const loadMoreItems = async () => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 800));
    setDisplayedItems(prev => Math.min(prev + 12, recentUploads.length));
    setIsLoading(false);
  };

  const hasMore = displayedItems < recentUploads.length;
  const itemsToShow = recentUploads.slice(0, displayedItems);

  return (
    <>
      <VideoCategories />
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-secondary/20 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-secondary-foreground" />
              </div>
              <div>
                <h2 className="text-2xl font-display font-bold text-foreground">Fresh Uploads</h2>
                <p className="text-sm text-muted-foreground">Just added by creators</p>
              </div>
            </div>
          </div>

          <div>
            {itemsToShow.length === 0 ? (
              <EmptyState
                title="No Recent Uploads"
                description="We couldn't find any recent uploads in this category. Try selecting a different category or check back later for new content."
                icon={<Sparkles className="w-12 h-12 text-muted-foreground" />}
              />
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
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
                      category={video.category}
                      variant="recent"
                      uploadedAt={video.uploadedAt}
                    />
                  </motion.div>
                ))}
              </div>
            )}

            {/* Load More */}
            {hasMore && itemsToShow.length > 0 && (
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
          </div>
        </div>
      </section>
      <VideoUploadCTA />
    </>
  );
};
