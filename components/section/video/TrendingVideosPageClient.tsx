'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Flame, Play, Heart, Download, ArrowRight, Eye, Clock } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { VideoCategories } from './VideoCategories';
import { VideoUploadCTA } from './VideoUploadCTA';
import { EmptyState } from '../news/EmptyState';
import type { TrendingVideo } from './TrendingVideos';

interface TrendingVideosPageClientProps {
  trendingVideos: (TrendingVideo & { category: string })[];
}

export const TrendingVideosPageClient = ({ trendingVideos }: TrendingVideosPageClientProps) => {
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

  return (
    <>
      <VideoCategories />
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <Flame className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h2 className="text-2xl font-display font-bold text-foreground">Trending Now</h2>
                <p className="text-sm text-muted-foreground">
                  The most popular videos everyone is watching
                </p>
              </div>
            </div>
          </div>

          <div>
            {itemsToShow.length === 0 ? (
              <EmptyState
                title="No Trending Videos"
                description="We couldn't find any trending videos in this category. Try selecting a different category or check back later for new content."
                icon={<Flame className="w-12 h-12 text-muted-foreground" />}
              />
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {itemsToShow.map((video, index) => (
                  <motion.div
                    key={video.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: index * 0.05 }}
                    whileHover={{ y: -4 }}
                    className="group">
                    <Link
                      href={`/videos/${video.id}`}
                      className="block bg-card rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 border border-border/50 hover:border-primary/20">
                      {/* Thumbnail */}
                      <div className="relative aspect-video overflow-hidden bg-muted">
                        <Image
                          src={video.thumbnail}
                          alt={video.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        {/* Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                        {/* Play Button */}
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <div className="w-16 h-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-lg">
                            <Play className="w-6 h-6 fill-current ml-1" />
                          </div>
                        </div>

                        {/* New Badge */}
                        {video.isNew && (
                          <span className="absolute top-3 left-3 px-2 py-1 bg-primary text-primary-foreground text-xs font-bold rounded-full">
                            NEW
                          </span>
                        )}

                        {/* Quick Actions */}
                        <div className="absolute top-3 right-3 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={e => {
                              e.preventDefault();
                              // Handle favorite
                            }}
                            className="w-8 h-8 rounded-full bg-card/80 backdrop-blur-sm hover:bg-card flex items-center justify-center">
                            <Heart className="w-4 h-4" />
                          </button>
                          <button
                            onClick={e => {
                              e.preventDefault();
                              // Handle download
                            }}
                            className="w-8 h-8 rounded-full bg-card/80 backdrop-blur-sm hover:bg-card flex items-center justify-center">
                            <Download className="w-4 h-4" />
                          </button>
                        </div>

                        {/* Duration */}
                        <span className="absolute bottom-3 right-3 px-2 py-1 bg-foreground/80 text-background text-xs rounded-md font-medium">
                          {video.duration}
                        </span>
                      </div>

                      {/* Info */}
                      <div className="p-4">
                        <h3 className="font-semibold truncate group-hover:text-primary transition-colors">
                          {video.title}
                        </h3>
                        <p className="text-sm text-muted-foreground truncate">{video.creator}</p>
                        <div className="flex items-center gap-3 text-xs text-muted-foreground mt-2">
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
