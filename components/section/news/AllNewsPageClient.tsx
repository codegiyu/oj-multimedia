'use client';

import { useRouter } from 'next/navigation';
import { motion } from 'motion/react';
import { Newspaper } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SectionContainer } from '@/components/general/SectionContainer';
import { DataLoadError } from '@/components/general/DataLoadError';
import { ContentAllBrowseToolbar } from '@/components/general/ContentAllBrowseToolbar';
import { NewsCategories } from './NewsCategories';
import { SectionEmptyState } from '@/components/general/SectionEmptyState';
import { ContentBrowseList } from '@/components/general/ContentBrowseList';
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
  const router = useRouter();

  if (initialErrorMessage && newsItems.length === 0) {
    return (
      <SectionContainer>
        <DataLoadError
          title="Unable to load stories"
          message={initialErrorMessage}
          onRetry={() => router.refresh()}
          icon={<Newspaper className="w-8 h-8 text-destructive" />}
        />
      </SectionContainer>
    );
  }

  return (
    <>
      <SectionContainer className="pb-0">
        <ContentAllBrowseToolbar config={config} />
      </SectionContainer>
      <NewsCategories categoryOptions={categoryOptions} />
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
            description="Try adjusting your search, sort, or category filters, or check back later for new stories."
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
}
