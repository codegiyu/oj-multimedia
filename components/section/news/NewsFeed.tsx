'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Clock,
  Eye,
  MessageCircle,
  Heart,
  Bookmark,
  Newspaper,
  User,
  Calendar,
} from 'lucide-react';
import { EmptyState } from './EmptyState';

export interface NewsItem {
  id: number;
  title: string;
  excerpt: string;
  category: string;
  image: string;
  readTime: string;
  views: string;
  comments: number;
  likes: number;
  videoUrl?: string; // Optional video URL to differentiate video stories from regular stories
  author?: string; // Author name
  date?: string; // Publication date
}

interface NewsFeedProps {
  items: NewsItem[];
}

export const NewsFeed = ({ items: newsItems }: NewsFeedProps) => {
  const [displayedItems, setDisplayedItems] = useState(6);
  const [isLoading, setIsLoading] = useState(false);

  // Generate more items (in a real app, this would be an API call)
  const loadMoreItems = async () => {
    setIsLoading(true);
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));

    // In a real app, you'd fetch more items from an API
    // For now, we'll just show more of the existing items
    setDisplayedItems(prev => Math.min(prev + 6, newsItems.length));
    setIsLoading(false);
  };

  const hasMore = displayedItems < newsItems.length;
  const itemsToShow = newsItems.slice(0, displayedItems);

  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-display font-bold text-foreground">Latest Stories</h2>
        </div>

        {newsItems.length === 0 ? (
          <EmptyState
            title="No Stories Found"
            description="We couldn't find any stories in this category. Try selecting a different category or check back later for new content."
            icon={<Newspaper className="w-12 h-12 text-muted-foreground" />}
          />
        ) : (
          <>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {itemsToShow.map((item, index) => (
                <Link key={item.id} href={`/news/story/${item.id}`}>
                  <motion.article
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    whileHover={{ y: -6 }}
                    className="group bg-card rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer">
                    {/* Image */}
                    <div className="relative aspect-[16/10] overflow-hidden">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-foreground/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                      {/* Save Button */}
                      <button className="absolute top-3 right-3 w-8 h-8 rounded-full bg-background/80 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:bg-background">
                        <Bookmark className="w-4 h-4 text-foreground" />
                      </button>

                      {/* Category Badge */}
                      <span className="absolute bottom-3 left-3 px-2.5 py-1 rounded-full bg-primary text-primary-foreground text-xs font-medium">
                        {item.category}
                      </span>
                    </div>

                    {/* Content */}
                    <div className="p-5">
                      <h3 className="font-semibold text-foreground line-clamp-2 group-hover:text-primary transition-colors mb-2">
                        {item.title}
                      </h3>
                      <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                        {item.excerpt}
                      </p>

                      {/* Meta */}
                      <div className="space-y-2">
                        {(item.author || item.date) && (
                          <div className="flex items-center gap-3 text-xs text-muted-foreground flex-wrap">
                            {item.author && (
                              <span className="flex items-center gap-1">
                                <User className="w-3 h-3" />
                                {item.author}
                              </span>
                            )}
                            {item.date && (
                              <span className="flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                {new Date(item.date).toLocaleDateString('en-US', {
                                  month: 'short',
                                  day: 'numeric',
                                  year: 'numeric',
                                })}
                              </span>
                            )}
                          </div>
                        )}
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <div className="flex items-center gap-3">
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {item.readTime}
                            </span>
                            <span className="flex items-center gap-1">
                              <Eye className="w-3 h-3" />
                              {item.views}
                            </span>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="flex items-center gap-1">
                              <Heart className="w-3 h-3" />
                              {item.likes}
                            </span>
                            <span className="flex items-center gap-1">
                              <MessageCircle className="w-3 h-3" />
                              {item.comments}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.article>
                </Link>
              ))}
            </div>

            {/* Load More */}
            {hasMore && (
              <div className="flex justify-center mt-10">
                <motion.button
                  onClick={loadMoreItems}
                  disabled={isLoading}
                  whileHover={{ scale: isLoading ? 1 : 1.02 }}
                  whileTap={{ scale: isLoading ? 1 : 0.98 }}
                  className="px-8 py-3 rounded-full bg-muted text-foreground font-medium hover:bg-muted/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                  {isLoading ? 'Loading...' : 'Load More Stories'}
                </motion.button>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
};
