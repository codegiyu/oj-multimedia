'use client';

import { motion } from 'motion/react';
import { Newspaper } from 'lucide-react';
import { BrowseListPageClient } from '@/components/general/BrowseListPageClient';
import { NewsCategories } from './NewsCategories';
import { NewsCard } from '@/components/cards/NewsCard';
import type { NewsItem } from './NewsFeed';
import { NEWS_LATEST_BROWSE_GRID_CLASS } from '@/lib/utils/newsBrowse';
import type { AllBrowseConfig } from '@/lib/constants/allBrowseConfig';
import type { CategoryNavItem } from '@/lib/utils/contentCategoryNav';
import type { Pagination } from '@/lib/types/pagination';

interface AllNewsPageClientProps {
  config: AllBrowseConfig;
  categoryOptions: CategoryNavItem[];
  newsItems: NewsItem[];
  pagination?: Pagination | null;
  initialErrorMessage?: string | null;
}

export function AllNewsPageClient({
  config,
  categoryOptions,
  newsItems,
  pagination = null,
  initialErrorMessage = null,
}: AllNewsPageClientProps) {
  return (
    <BrowseListPageClient
      config={config}
      items={newsItems}
      pagination={pagination}
      initialErrorMessage={initialErrorMessage}
      errorTitle="Unable to load stories"
      errorIcon={<Newspaper className="w-8 h-8 text-destructive" />}
      empty={{
        title: 'No Stories Found',
        description:
          'Try adjusting your search, sort, or category filters, or check back later for new stories.',
        icon: Newspaper,
        showDefaultActions: true,
      }}
      gridClassName={NEWS_LATEST_BROWSE_GRID_CLASS}
      afterToolbar={<NewsCategories categoryOptions={categoryOptions} />}
      renderItem={(item, index) => (
        <motion.div
          key={item._id}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: index * 0.05 }}
          className="h-full">
          <NewsCard
            _id={item._id}
            title={item.title}
            excerpt={item.excerpt}
            category={item.category}
            time={item.readTime}
            image={item.image}
          />
        </motion.div>
      )}
    />
  );
}
