'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Clock, Eye, MessageCircle, ArrowRight, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { NewsCategories } from './NewsCategories';
import { NewsletterCTA } from '../shared';
import { EmptyState } from './EmptyState';
import type { FeaturedStory } from './FeaturedStories';

interface FeaturedStoriesPageClientProps {
  featuredStories: FeaturedStory[];
}

export const FeaturedStoriesPageClient = ({ featuredStories }: FeaturedStoriesPageClientProps) => {
  const [displayedItems, setDisplayedItems] = useState(9);
  const [isLoading, setIsLoading] = useState(false);

  const loadMoreItems = async () => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 800));
    setDisplayedItems(prev => Math.min(prev + 6, featuredStories.length));
    setIsLoading(false);
  };

  const hasMore = displayedItems < featuredStories.length;
  const itemsToShow = featuredStories.slice(0, displayedItems);

  return (
    <>
      <NewsCategories />
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-display font-bold text-foreground">Featured Stories</h2>
              <p className="text-sm text-muted-foreground mt-1">
                Handpicked stories worth your time
              </p>
            </div>
          </div>

          {itemsToShow.length === 0 ? (
            <EmptyState
              title="No Featured Stories"
              description="We couldn't find any featured stories in this category. Try selecting a different category or check back later for new content."
              icon={<Sparkles className="w-12 h-12 text-muted-foreground" />}
            />
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {itemsToShow.map((story, index) => (
                <Link key={story._id} href={`/news/story/${story._id}`} className="h-full">
                  <motion.article
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    whileHover={{ y: -6 }}
                    className="h-full group bg-card rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer">
                    {/* Image */}
                    <div className="relative aspect-[16/10] overflow-hidden">
                      <img
                        src={story.image}
                        alt={story.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-foreground/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                      {/* Category Badge */}
                      <span className="absolute bottom-3 left-3 px-2.5 py-1 rounded-full bg-primary text-primary-foreground text-xs font-medium">
                        {story.category}
                      </span>

                      {/* Featured Badge */}
                      {story.featured && (
                        <span className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-primary/90 text-primary-foreground text-xs font-medium">
                          Featured
                        </span>
                      )}
                    </div>

                    {/* Content */}
                    <div className="p-5">
                      <h3 className="font-semibold text-foreground line-clamp-2 group-hover:text-primary transition-colors mb-2">
                        {story.title}
                      </h3>
                      <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                        {story.excerpt}
                      </p>

                      {/* Meta */}
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {story.readTime}
                        </span>
                        <span className="flex items-center gap-1">
                          <Eye className="w-3 h-3" />
                          {story.views}
                        </span>
                        <span className="flex items-center gap-1">
                          <MessageCircle className="w-3 h-3" />
                          {story.comments}
                        </span>
                      </div>
                    </div>
                  </motion.article>
                </Link>
              ))}
            </div>
          )}

          {/* Load More */}
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
                    Load More Stories
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
