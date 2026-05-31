'use client';

import { useState } from 'react';
import { motion } from 'motion/react';
import { Newspaper } from 'lucide-react';
import { SectionEmptyState } from '@/components/general/SectionEmptyState';
import { NewsCard } from '@/components/cards/NewsCard';

export interface NewsItem {
  _id: string;
  title: string;
  excerpt: string;
  category: string;
  image: string;
  readTime: string;
  views: string;
  comments: number;
  likes: number;
  videoUrl?: string;
  author?: string;
  date?: string;
  priority?: number;
}

interface NewsFeedProps {
  items: NewsItem[];
}

export const NewsFeed = ({ items: newsItems }: NewsFeedProps) => {
  const [displayedItems, setDisplayedItems] = useState(6);
  const [isLoading, setIsLoading] = useState(false);

  const loadMoreItems = async () => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 800));
    setDisplayedItems(prev => Math.min(prev + 6, newsItems.length));
    setIsLoading(false);
  };

  const hasMore = displayedItems < newsItems.length;
  const itemsToShow = newsItems.slice(0, displayedItems);

  if (newsItems.length === 0) {
    return (
      <SectionEmptyState
        title="No Stories Found"
        description="We couldn't find any stories in this category. Try selecting a different category or check back later for new content."
        icon={Newspaper}
        showDefaultActions
      />
    );
  }

  return (
    <div className="grid gap-6">
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {itemsToShow.map((item, index) => (
          <motion.div
            key={item._id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.3, delay: index * 0.05 }}>
            <NewsCard
              _id={item._id}
              title={item.title}
              excerpt={item.excerpt}
              category={item.category}
              time={item.readTime}
              image={item.image}
            />
          </motion.div>
        ))}
      </div>

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
    </div>
  );
};
