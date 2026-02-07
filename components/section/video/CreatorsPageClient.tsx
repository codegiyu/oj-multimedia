'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Users, Play, Verified, Video, Eye, ArrowRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { VideoCategories } from './VideoCategories';
import { VideoUploadCTA } from './VideoUploadCTA';
import { EmptyState } from '../news/EmptyState';
import type { FeaturedCreator } from './CreatorSpotlight';

interface CreatorsPageClientProps {
  featuredCreators: (FeaturedCreator & { category: string })[];
}

export const CreatorsPageClient = ({ featuredCreators }: CreatorsPageClientProps) => {
  const [displayedItems, setDisplayedItems] = useState(24);
  const [isLoading, setIsLoading] = useState(false);

  const loadMoreItems = async () => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 800));
    setDisplayedItems(prev => Math.min(prev + 12, featuredCreators.length));
    setIsLoading(false);
  };

  const hasMore = displayedItems < featuredCreators.length;
  const itemsToShow = featuredCreators.slice(0, displayedItems);

  return (
    <>
      <VideoCategories />
      <section className="py-12 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <Users className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h2 className="text-2xl font-display font-bold text-foreground">
                  Featured Creators
                </h2>
                <p className="text-sm text-muted-foreground">Active and trending creators</p>
              </div>
            </div>
          </div>

          <div>
            {itemsToShow.length === 0 ? (
              <EmptyState
                title="No Featured Creators"
                description="We couldn't find any featured creators in this category. Try selecting a different category or check back later for new content."
                icon={<Users className="w-12 h-12 text-muted-foreground" />}
              />
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {itemsToShow.map((creator, index) => (
                  <motion.div
                    key={creator._id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={{ y: -8 }}
                    className="group bg-card rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow">
                    {/* Latest Video Preview */}
                    <div className="relative aspect-video overflow-hidden">
                      <Image
                        src={creator.latestVideo.thumbnail}
                        alt={creator.latestVideo.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-lg">
                          <Play className="w-4 h-4 fill-current ml-0.5" />
                        </div>
                      </div>
                      <span className="absolute bottom-2 right-2 px-1.5 py-0.5 bg-foreground/80 text-background text-xs rounded font-medium">
                        {creator.latestVideo.duration}
                      </span>
                    </div>

                    {/* Creator Info */}
                    <div className="p-4">
                      <div className="flex items-start gap-3 mb-3">
                        {/* Avatar */}
                        <div className="relative shrink-0">
                          <div className="w-14 h-14 rounded-full overflow-hidden ring-2 ring-background shadow-md">
                            <Image
                              src={creator.avatar}
                              alt={creator.name}
                              fill
                              className="object-cover transition-transform duration-300 group-hover:scale-110"
                            />
                          </div>
                          {creator.verified && (
                            <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-primary rounded-full flex items-center justify-center ring-2 ring-background">
                              <Verified className="w-3 h-3 text-primary-foreground" />
                            </div>
                          )}
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold text-sm group-hover:text-primary transition-colors truncate">
                              {creator.name}
                            </h3>
                          </div>
                          <p className="text-xs text-muted-foreground mb-2">{creator.category}</p>
                          <div className="flex items-center gap-3 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Users className="w-3 h-3" />
                              {creator.followers}
                            </span>
                            <span className="flex items-center gap-1">
                              <Video className="w-3 h-3" />
                              {creator.videos}
                            </span>
                            <span className="flex items-center gap-1">
                              <Eye className="w-3 h-3" />
                              {creator.views}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Latest Video Title */}
                      <div className="pt-3 border-t border-border/50">
                        <p className="text-xs text-muted-foreground mb-1">Latest:</p>
                        <Link href={`/videos?category=${creator.category || 'all'}`}>
                          <p className="text-sm font-medium truncate group-hover:text-primary transition-colors">
                            {creator.latestVideo.title}
                          </p>
                        </Link>
                      </div>

                      {/* Follow Button */}
                      <button className="w-full mt-3 px-4 py-2 rounded-lg border border-border bg-background hover:bg-muted transition-colors text-sm font-medium opacity-0 group-hover:opacity-100">
                        Follow Creator
                      </button>
                    </div>
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
                      Load More Creators
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
