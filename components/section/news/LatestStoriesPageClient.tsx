'use client';

import { useRouter } from 'next/navigation';
import { motion } from 'motion/react';
import { Newspaper } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SectionContainer } from '@/components/general/SectionContainer';
import { DataLoadError } from '@/components/general/DataLoadError';
import { NewsCategories } from './NewsCategories';
import type { CategoryNavItem } from '@/lib/utils/contentCategoryNav';
import { SectionEmptyState } from '@/components/general/SectionEmptyState';
import { ContentBrowseList } from '@/components/general/ContentBrowseList';
import { NewsCard } from '@/components/cards/NewsCard';
import type { NewsItem } from './NewsFeed';
import { NEWS_LATEST_BROWSE_GRID_CLASS } from '@/lib/utils/newsBrowse';
import type { Pagination } from '@/lib/types/pagination';

interface LatestStoriesPageClientProps {
  categoryOptions?: CategoryNavItem[];
  newsItems: NewsItem[];
  pagination?: Pagination | null;
  initialErrorMessage?: string | null;
  showCategoryNav?: boolean;
}

export const LatestStoriesPageClient = ({
  categoryOptions = [],
  newsItems,
  pagination = null,
  initialErrorMessage = null,
  showCategoryNav = true,
}: LatestStoriesPageClientProps) => {
  const router = useRouter();

  if (initialErrorMessage && newsItems.length === 0) {
    return (
      <SectionContainer>
        <DataLoadError
          title="Unable to load latest stories"
          message={initialErrorMessage}
          onRetry={() => router.refresh()}
          icon={<Newspaper className="w-8 h-8 text-destructive" />}
        />
      </SectionContainer>
    );
  }

  return (
    <>
      {showCategoryNav ? <NewsCategories categoryOptions={categoryOptions} /> : null}
      {initialErrorMessage && (
        <div className="container mx-auto px-4 mb-4">
          <div className="rounded-md border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive flex items-center justify-between gap-4">
            <span>{initialErrorMessage}</span>
            <Button variant="outline" size="sm" onClick={() => router.refresh()}>
              Retry
            </Button>
          </div>
        </div>
      )}
      {newsItems.length === 0 ? (
        <SectionContainer>
          <SectionEmptyState
            title="No Stories Found"
            description="We couldn't find any stories in this category. Try selecting a different category or check back later for new content."
            icon={Newspaper}
            showDefaultActions
          />
        </SectionContainer>
      ) : (
        <ContentBrowseList pagination={pagination} gridClassName={NEWS_LATEST_BROWSE_GRID_CLASS}>
          {newsItems.map((item, index) => (
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
          ))}
        </ContentBrowseList>
      )}
    </>
  );
};
