'use client';

import { useRouter } from 'next/navigation';
import { motion } from 'motion/react';
import { Sparkles, Clock, Eye, MessageCircle, Newspaper } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { SectionContainer } from '@/components/general/SectionContainer';
import { DataLoadError } from '@/components/general/DataLoadError';
import { NewsCategories } from './NewsCategories';
import type { CategoryNavItem } from '@/lib/utils/contentCategoryNav';
import { FillImage } from '@/components/general/FillImage';
import { NewsletterCTA } from '../shared';
import { SectionEmptyState } from '@/components/general/SectionEmptyState';
import { ContentBrowseList } from '@/components/general/ContentBrowseList';
import { MultilinePreview } from '@/components/general/MultilinePreview';
import type { FeaturedStory } from './FeaturedStories';
import { NEWS_FEATURED_BROWSE_GRID_CLASS } from '@/lib/utils/newsBrowse';
import type { Pagination } from '@/lib/types/pagination';

interface FeaturedStoriesPageClientProps {
  categoryOptions?: CategoryNavItem[];
  featuredStories: FeaturedStory[];
  pagination?: Pagination | null;
  initialErrorMessage?: string | null;
  showCategoryNav?: boolean;
}

export const FeaturedStoriesPageClient = ({
  categoryOptions = [],
  featuredStories,
  pagination = null,
  initialErrorMessage = null,
  showCategoryNav = true,
}: FeaturedStoriesPageClientProps) => {
  const router = useRouter();

  if (initialErrorMessage && featuredStories.length === 0) {
    return (
      <SectionContainer>
        <DataLoadError
          title="Unable to load featured stories"
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
      {featuredStories.length === 0 ? (
        <SectionContainer>
          <SectionEmptyState
            title="No Featured Stories"
            description="We couldn't find any featured stories in this category. Try selecting a different category or check back later for new content."
            icon={Sparkles}
            showDefaultActions
          />
        </SectionContainer>
      ) : (
        <ContentBrowseList pagination={pagination} gridClassName={NEWS_FEATURED_BROWSE_GRID_CLASS}>
          {featuredStories.map((story, index) => (
            <Link key={story._id} href={`/news/story/${story._id}`} className="h-full">
              <motion.article
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                whileHover={{ y: -6 }}
                className="h-full group bg-card rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer">
                <div className="relative aspect-[16/10] overflow-hidden">
                  <FillImage
                    imageContext="public"
                    src={story.image}
                    alt={story.title}
                    sizes="(max-width: 768px) 50vw, 400px"
                    className="transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-foreground/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <span className="absolute bottom-3 left-3 px-2.5 py-1 rounded-full bg-primary text-primary-foreground text-xs font-medium">
                    {story.category}
                  </span>
                  {story.featured && (
                    <span className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-primary/90 text-primary-foreground text-xs font-medium">
                      Featured
                    </span>
                  )}
                </div>
                <div className="p-5">
                  <h3 className="font-semibold text-foreground line-clamp-2 group-hover:text-primary transition-colors mb-2">
                    {story.title}
                  </h3>
                  <MultilinePreview
                    text={story.excerpt}
                    className="text-sm text-muted-foreground line-clamp-2 mb-4"
                  />
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
        </ContentBrowseList>
      )}
      <NewsletterCTA />
    </>
  );
};
