'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Zap, Play, Heart, Share2, ArrowRight, Eye } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { VideoCategories } from './VideoCategories';
import { VideoUploadCTA } from './VideoUploadCTA';
import { EmptyState } from '../news/EmptyState';
import type { ShortFormVideo } from './ShortFormVideos';

interface ShortFormVideosPageClientProps {
  shortFormVideos: (ShortFormVideo & { category: string })[];
}

export const ShortFormVideosPageClient = ({ shortFormVideos }: ShortFormVideosPageClientProps) => {
  const [displayedItems, setDisplayedItems] = useState(20);
  const [isLoading, setIsLoading] = useState(false);

  const loadMoreItems = async () => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 800));
    setDisplayedItems(prev => Math.min(prev + 12, shortFormVideos.length));
    setIsLoading(false);
  };

  const hasMore = displayedItems < shortFormVideos.length;
  const itemsToShow = shortFormVideos.slice(0, displayedItems);

  return (
    <>
      <VideoCategories />
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <Zap className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h2 className="text-2xl font-display font-bold text-foreground">Short Clips</h2>
                <p className="text-sm text-muted-foreground">Quick, engaging content</p>
              </div>
            </div>
          </div>

          <div>
            {itemsToShow.length === 0 ? (
              <EmptyState
                title="No Short Form Videos"
                description="We couldn't find any short form videos in this category. Try selecting a different category or check back later for new content."
                icon={<Zap className="w-12 h-12 text-muted-foreground" />}
              />
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
                {itemsToShow.map((video, index) => (
                  <motion.div
                    key={video.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: index * 0.05 }}
                    whileHover={{ scale: 1.05 }}
                    className="group">
                    <Link
                      href={`/videos/${video.id}`}
                      className="block bg-card rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 border border-border/50 hover:border-primary/20">
                      {/* Thumbnail - Vertical */}
                      <div className="relative aspect-[9/16] overflow-hidden bg-muted">
                        <Image
                          src={video.thumbnail}
                          alt={video.title}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                        {/* Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-foreground/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                        {/* Play Button */}
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-lg">
                            <Play className="w-4 h-4 fill-current ml-0.5" />
                          </div>
                        </div>

                        {/* Duration Badge */}
                        <span className="absolute bottom-2 right-2 px-1.5 py-0.5 bg-foreground/80 text-background text-[10px] rounded font-medium">
                          {video.duration}
                        </span>

                        {/* Actions on Hover */}
                        <div className="absolute bottom-2 left-2 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={e => {
                              e.preventDefault();
                              // Handle favorite
                            }}
                            className="w-7 h-7 rounded-full bg-card/80 backdrop-blur-sm hover:bg-card flex items-center justify-center">
                            <Heart className="w-3 h-3" />
                          </button>
                          <button
                            onClick={e => {
                              e.preventDefault();
                              // Handle share
                            }}
                            className="w-7 h-7 rounded-full bg-card/80 backdrop-blur-sm hover:bg-card flex items-center justify-center">
                            <Share2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>

                      {/* Info */}
                      <div className="p-2">
                        <h3 className="font-semibold text-xs line-clamp-2 group-hover:text-primary transition-colors mb-1">
                          {video.title}
                        </h3>
                        <p className="text-[10px] text-muted-foreground truncate mb-1">
                          {video.creator}
                        </p>
                        <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                          <span className="flex items-center gap-0.5">
                            <Eye className="w-2.5 h-2.5" />
                            {video.views}
                          </span>
                          <span>•</span>
                          <span className="flex items-center gap-0.5">
                            <Heart className="w-2.5 h-2.5" />
                            {video.likes}
                          </span>
                        </div>
                      </div>
                    </Link>
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
