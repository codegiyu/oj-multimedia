'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Flame, Clock, ArrowRight, Eye } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { NewsCategories } from './NewsCategories';
import { NewsletterCTA } from '../shared';
import { EmptyState } from './EmptyState';
import type { TrendingStory } from './TrendingSidebar';

interface TrendingStoriesPageClientProps {
  trendingStories: TrendingStory[];
}

export const TrendingStoriesPageClient = ({ trendingStories }: TrendingStoriesPageClientProps) => {
  const [displayedItems, setDisplayedItems] = useState(15);
  const [isLoading, setIsLoading] = useState(false);

  const loadMoreItems = async () => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 800));
    setDisplayedItems(prev => Math.min(prev + 10, trendingStories.length));
    setIsLoading(false);
  };

  const hasMore = displayedItems < trendingStories.length;
  const itemsToShow = trendingStories.slice(0, displayedItems);

  return (
    <>
      <NewsCategories />
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
                  The most popular stories everyone is talking about
                </p>
              </div>
            </div>
          </div>

          <div className="">
            {itemsToShow.length === 0 ? (
              <EmptyState
                title="No Trending Stories"
                description="We couldn't find any trending stories in this category. Try selecting a different category or check back later for new content."
                icon={<TrendingUp className="w-12 h-12 text-muted-foreground" />}
              />
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {itemsToShow.map((story, index) => (
                  <motion.article
                    key={story.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: index * 0.05 }}
                    whileHover={{ y: -4 }}
                    className="group">
                    <Link
                      href={`/news/story/${story.id}`}
                      className="block bg-card rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 border border-border/50 hover:border-primary/20">
                      {/* Image */}
                      {story.image && (
                        <div className="relative w-full h-56 sm:h-80 md:h-64 overflow-hidden bg-muted">
                          <Image
                            src={story.image}
                            alt={story.title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          {/* Rank Badge */}
                          <div className="absolute top-3 left-3">
                            <div
                              className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold text-sm ${
                                story.rank <= 3
                                  ? 'bg-primary text-primary-foreground'
                                  : 'bg-background/90 text-foreground'
                              }`}>
                              {story.rank <= 3 && <TrendingUp className="w-4 h-4 mr-1" />}
                              {story.rank}
                            </div>
                          </div>
                          {/* Top 3 Indicator */}
                          {story.rank <= 3 && (
                            <div className="absolute top-3 right-3">
                              <div className="w-8 h-8 rounded-full bg-primary/20 backdrop-blur-sm flex items-center justify-center">
                                <Flame className="w-4 h-4 text-primary" />
                              </div>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Content */}
                      <div className="p-5">
                        {/* Category & Meta */}
                        <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
                          <span className="px-2 py-1 rounded-md bg-primary/10 text-primary font-medium">
                            {story.category}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {story.readTime}
                          </span>
                          {story.views && (
                            <>
                              <span>•</span>
                              <span className="flex items-center gap-1">
                                <Eye className="w-3 h-3" />
                                {story.views}
                              </span>
                            </>
                          )}
                        </div>

                        {/* Title */}
                        <h3 className="text-lg font-semibold text-foreground line-clamp-2 group-hover:text-primary transition-colors mb-3">
                          {story.title}
                        </h3>

                        {/* Excerpt */}
                        {story.excerpt && (
                          <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
                            {story.excerpt}
                          </p>
                        )}

                        {/* Read More */}
                        <div className="flex items-center gap-2 text-sm text-primary font-medium group-hover:gap-3 transition-all">
                          <span>Read more</span>
                          <ArrowRight className="w-4 h-4" />
                        </div>
                      </div>
                    </Link>
                  </motion.article>
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
                      Load More Stories
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </motion.button>
              </div>
            )}
          </div>
        </div>
      </section>
      <NewsletterCTA />
    </>
  );
};
