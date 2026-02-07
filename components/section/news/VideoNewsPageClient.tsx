'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Play, Clock, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { NewsCategories } from './NewsCategories';
import { NewsletterCTA } from '../shared';
import { EmptyState } from './EmptyState';
import type { VideoNewsItem } from './VideoNews';

interface VideoNewsPageClientProps {
  videoNews: VideoNewsItem[];
}

export const VideoNewsPageClient = ({ videoNews }: VideoNewsPageClientProps) => {
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

  return (
    <>
      <NewsCategories />
      <section className="py-12 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <Play className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h2 className="text-2xl font-display font-bold text-foreground">Video Stories</h2>
                <p className="text-sm text-muted-foreground">Watch and explore</p>
              </div>
            </div>
          </div>

          {itemsToShow.length === 0 ? (
            <EmptyState
              title="No Video Stories"
              description="We couldn't find any video stories in this category. Try selecting a different category or check back later for new content."
              icon={<Play className="w-12 h-12 text-muted-foreground" />}
            />
          ) : (
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
                    {/* Thumbnail */}
                    <div className="relative aspect-video rounded-xl overflow-hidden mb-3">
                      <img
                        src={video.image}
                        alt={video.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-foreground/20 group-hover:bg-foreground/30 transition-colors" />

                      {/* Play Button */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <motion.div
                          whileHover={{ scale: 1.1 }}
                          className="w-12 h-12 rounded-full bg-primary flex items-center justify-center shadow-lg">
                          <Play className="w-5 h-5 text-primary-foreground fill-primary-foreground ml-0.5" />
                        </motion.div>
                      </div>

                      {/* Duration */}
                      <span className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-foreground/80 text-primary-foreground text-xs font-medium flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {video.duration}
                      </span>

                      {/* Category */}
                      <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-primary/90 text-primary-foreground text-xs font-medium">
                        {video.category}
                      </span>
                    </div>

                    {/* Info */}
                    <h3 className="font-medium text-foreground line-clamp-2 group-hover:text-primary transition-colors text-sm">
                      {video.title}
                    </h3>
                    <p className="text-xs text-muted-foreground mt-1">{video.views} views</p>
                  </motion.article>
                </Link>
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
      </section>
      <NewsletterCTA />
    </>
  );
};
