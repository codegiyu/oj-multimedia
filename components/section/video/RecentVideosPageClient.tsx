'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Play, Heart, ArrowRight, Eye, Clock } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { VideoCategories } from './VideoCategories';
import { VideoUploadCTA } from './VideoUploadCTA';
import { EmptyState } from '../news/EmptyState';
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
                    key={video.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: index * 0.05 }}
                    whileHover={{ y: -4 }}
                    className="group flex gap-4 p-4 bg-card rounded-2xl hover:shadow-md transition-all cursor-pointer border border-border/50 hover:border-primary/20">
                    {/* Thumbnail */}
                    <div className="relative w-32 h-20 rounded-xl overflow-hidden shrink-0">
                      <Image
                        src={video.thumbnail}
                        alt={video.title}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-foreground/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <Play className="w-5 h-5 text-background fill-current" />
                      </div>
                      <span className="absolute bottom-1 right-1 px-1.5 py-0.5 bg-foreground/80 text-background text-[10px] rounded font-medium">
                        {video.duration}
                      </span>
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                      <div>
                        <Link href={`/videos/${video.id}`}>
                          <h3 className="font-semibold text-sm truncate group-hover:text-primary transition-colors mb-1">
                            {video.title}
                          </h3>
                        </Link>
                        <p className="text-xs text-muted-foreground truncate mb-2">
                          {video.creator}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span className="px-2 py-0.5 bg-muted rounded-full">{video.category}</span>
                        {video.views && (
                          <span className="flex items-center gap-1">
                            <Eye className="w-3 h-3" />
                            {video.views}
                          </span>
                        )}
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {video.uploadedAt}
                        </span>
                      </div>
                    </div>

                    {/* Action */}
                    <button
                      onClick={e => {
                        e.preventDefault();
                        // Handle favorite
                      }}
                      className="shrink-0 self-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <Heart className="w-4 h-4" />
                    </button>
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
