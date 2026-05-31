'use client';

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
import { SectionEmptyState } from '@/components/general/SectionEmptyState';
import { ContentBrowseList } from '@/components/general/ContentBrowseList';
import { MultilinePreview } from '@/components/general/MultilinePreview';
import type { TrendingStory } from './TrendingSidebar';
import { NEWS_TRENDING_BROWSE_GRID_CLASS } from '@/lib/utils/newsBrowse';
import type { Pagination } from '@/lib/types/pagination';

interface TrendingStoriesPageClientProps {
  categoryOptions?: CategoryNavItem[];
  trendingStories: TrendingStory[];
  pagination?: Pagination | null;
  initialErrorMessage?: string | null;
  showCategoryNav?: boolean;
}

export const TrendingStoriesPageClient = ({
  categoryOptions = [],
  trendingStories,
  pagination = null,
  initialErrorMessage = null,
  showCategoryNav = true,
}: TrendingStoriesPageClientProps) => {
  const router = useRouter();

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
      {trendingStories.length === 0 ? (
        <SectionContainer>
          <SectionEmptyState
            title="No Trending Stories"
            description="We couldn't find any trending stories in this category. Try selecting a different category or check back later for new content."
            icon={TrendingUp}
            showDefaultActions
          />
        </SectionContainer>
      ) : (
        <ContentBrowseList pagination={pagination} gridClassName={NEWS_TRENDING_BROWSE_GRID_CLASS}>
          {trendingStories.map((story, index) => (
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
                    {story.views ? (
                      <>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Eye className="w-3 h-3" />
                          {story.views}
                        </span>
                      </>
                    ) : null}
                  </div>
                  <h3 className="text-lg font-semibold text-foreground line-clamp-2 group-hover:text-primary transition-colors mb-3">
                    {story.title}
                  </h3>
                  {story.excerpt ? (
                    <MultilinePreview
                      text={story.excerpt}
                      className="text-sm text-muted-foreground line-clamp-3 mb-4"
                    />
                  ) : null}
                  <div className="flex items-center gap-2 text-sm text-primary font-medium group-hover:gap-3 transition-all">
                    <span>Read more</span>
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </Link>
            </motion.article>
          ))}
        </ContentBrowseList>
      )}
      <NewsletterCTA />
    </>
  );
};
