'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'motion/react';
import { Flame, ArrowRight, Clock, Eye, TrendingUp, Newspaper } from 'lucide-react';
import { FillImage } from '@/components/general/FillImage';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { SectionContainer } from '@/components/general/SectionContainer';
import { DataLoadError } from '@/components/general/DataLoadError';
import { NewsCategories } from './NewsCategories';
import type { CategoryNavItem } from '@/lib/utils/contentCategoryNav';
import { NewsletterCTA } from '../shared';
import { EmptyState } from './EmptyState';
import { SectionComp } from '@/components/general/SectionComp';
import type { TrendingStory } from './TrendingSidebar';

interface TrendingStoriesPageClientProps {
  categoryOptions: CategoryNavItem[];
  trendingStories: TrendingStory[];
  initialErrorMessage?: string | null;
}

export const TrendingStoriesPageClient = ({
  categoryOptions,

  trendingStories,
  initialErrorMessage = null,
}: TrendingStoriesPageClientProps) => {
  const router = useRouter();
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

  if (initialErrorMessage && trendingStories.length === 0) {
    return (
      <SectionContainer>
        <DataLoadError
          title="Unable to load trending stories"
          message={initialErrorMessage}
          onRetry={() => router.refresh()}
          icon={<Newspaper className="w-8 h-8 text-destructive" />}
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
        icon={Flame}
        iconColor="primary"
        heading="Trending Now"
        subtext="The most popular stories everyone is talking about"
        viewAllLink="/news/trending"
        contentProps={{ enableAnimation: false }}>
        {itemsToShow.length === 0 ? (
          <EmptyState
            title="No Trending Stories"
            description="We couldn't find any trending stories in this category. Try selecting a different category or check back later for new content."
            icon={<TrendingUp className="w-12 h-12 text-muted-foreground" />}
          />
        ) : (
          <>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {itemsToShow.map((story, index) => (
                <motion.article
                  key={story._id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  whileHover={{ y: -4 }}
                  className="group">
                  <Link
                    href={`/news/story/${story._id}`}
                    className="block bg-card rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 border border-border/50 hover:border-primary/20">
                    <div className="relative w-full h-56 sm:h-80 md:h-64 overflow-hidden bg-muted">
                      <FillImage
                        src={story.image ?? ''}
                        alt={story.title}
                        imageContext="public"
                        sizes="(max-width: 768px) 100vw, 600px"
                        className="group-hover:scale-105 transition-transform duration-300"
                      />
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
                      {story.rank <= 3 && (
                        <div className="absolute top-3 right-3">
                          <div className="w-8 h-8 rounded-full bg-primary/20 backdrop-blur-sm flex items-center justify-center">
                            <Flame className="w-4 h-4 text-primary" />
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="p-5">
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
                      <h3 className="text-lg font-semibold text-foreground line-clamp-2 group-hover:text-primary transition-colors mb-3">
                        {story.title}
                      </h3>
                      {story.excerpt && (
                        <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
                          {story.excerpt}
                        </p>
                      )}
                      <div className="flex items-center gap-2 text-sm text-primary font-medium group-hover:gap-3 transition-all">
                        <span>Read more</span>
                        <ArrowRight className="w-4 h-4" />
                      </div>
                    </div>
                  </Link>
                </motion.article>
              ))}
            </div>
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
          </>
        )}
      </SectionComp>
      <NewsletterCTA />
    </>
  );
};
