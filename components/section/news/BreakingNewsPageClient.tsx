'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'motion/react';
import { AlertTriangle, Clock, Eye, Newspaper } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SectionContainer } from '@/components/general/SectionContainer';
import { DataLoadError } from '@/components/general/DataLoadError';
import { NewsCategories } from './NewsCategories';
import type { CategoryNavItem } from '@/lib/utils/contentCategoryNav';
import { NewsletterCTA } from '../shared';
import { EmptyState } from './EmptyState';
import { SectionComp } from '@/components/general/SectionComp';
import { MultilinePreview } from '@/components/general/MultilinePreview';
import { NewsPriorityIndicator } from './NewsPriorityIndicator';
import type { BreakingNewsStory } from './BreakingNews';

interface BreakingNewsPageClientProps {
  categoryOptions: CategoryNavItem[];
  breakingStories: BreakingNewsStory[];
  initialErrorMessage?: string | null;
}

export const BreakingNewsPageClient = ({
  categoryOptions,
  breakingStories,
  initialErrorMessage = null,
}: BreakingNewsPageClientProps) => {
  const router = useRouter();
  const [displayedItems, setDisplayedItems] = useState(20);
  const [isLoading, setIsLoading] = useState(false);

  const loadMoreItems = async () => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 600));
    setDisplayedItems(prev => Math.min(prev + 10, breakingStories.length));
    setIsLoading(false);
  };

  const hasMore = displayedItems < breakingStories.length;
  const itemsToShow = breakingStories.slice(0, displayedItems);

  if (initialErrorMessage && breakingStories.length === 0) {
    return (
      <SectionContainer>
        <DataLoadError
          title="Unable to load breaking news"
          message={initialErrorMessage}
          onRetry={() => router.refresh()}
          icon={<AlertTriangle className="w-8 h-8 text-destructive" />}
        />
      </SectionContainer>
    );
  }

  return (
    <>
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
      <SectionComp
        icon={AlertTriangle}
        iconColor="accent"
        heading="All Breaking Stories"
        subtext="High-priority coverage from the past week"
        contentProps={{ enableAnimation: false }}>
        {breakingStories.length === 0 ? (
          <EmptyState
            title="No breaking stories"
            description="There are no high-priority stories in this category right now."
            icon={<Newspaper className="w-12 h-12 text-muted-foreground" />}
          />
        ) : (
          <div className="grid gap-4">
            {itemsToShow.map((story, index) => (
              <motion.article
                key={story._id}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.03 }}
                className="rounded-xl border border-destructive/15 bg-card p-5 md:p-6 hover:border-destructive/30 transition-colors">
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  <span className="text-xs font-medium text-destructive uppercase tracking-wide">
                    {story.category}
                  </span>
                  <NewsPriorityIndicator priority={story.priority} preferDialog />
                </div>
                <Link href={`/news/story/${story._id}`} className="group block">
                  <h2 className="text-xl md:text-2xl font-display font-bold group-hover:text-primary transition-colors">
                    {story.title}
                  </h2>
                  {story.excerpt ? (
                    <MultilinePreview
                      text={story.excerpt}
                      className="text-muted-foreground mt-2 line-clamp-3"
                    />
                  ) : null}
                </Link>
                <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {story.readTime}
                  </span>
                  <span className="flex items-center gap-1">
                    <Eye className="w-4 h-4" />
                    {story.views}
                  </span>
                  {story.author ? <span>{story.author}</span> : null}
                </div>
              </motion.article>
            ))}
            {hasMore ? (
              <div className="flex justify-center pt-4">
                <Button variant="outline" onClick={() => void loadMoreItems()} disabled={isLoading}>
                  {isLoading ? 'Loading…' : 'Load more'}
                </Button>
              </div>
            ) : null}
          </div>
        )}
      </SectionComp>
      <NewsletterCTA />
    </>
  );
};
