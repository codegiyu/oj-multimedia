'use client';

import { motion } from 'motion/react';
import { Heart, MessageSquare, Quote, Filter, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { FixedImage } from '@/components/general/FillImage';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useState, useEffect } from 'react';
import { SectionComp } from '@/components/general/SectionComp';
import { MultilinePreview } from '@/components/general/MultilinePreview';
import { ListPagination } from '@/components/general/ListPagination';
import { SectionEmptyState } from '@/components/general/SectionEmptyState';
import type { Testimony } from './TestimoniesPageClient';
import type { Pagination } from '@/lib/types/community';
import { TESTIMONY_CATEGORY_FILTER_OPTIONS } from '@/lib/constants/communityCategorySelectOptions';

interface AllTestimoniesProps {
  testimonies: Testimony[];
  pagination?: Pagination | null;
}

export const AllTestimonies = ({ testimonies, pagination = null }: AllTestimoniesProps) => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [displayedItems, setDisplayedItems] = useState(12);
  const [isLoading, setIsLoading] = useState(false);

  const filteredTestimonies =
    selectedCategory === 'All'
      ? testimonies
      : testimonies.filter(t => t.category === selectedCategory);

  const useServerPagination = pagination != null && pagination.totalPages > 1;
  const itemsToShow = useServerPagination
    ? filteredTestimonies
    : filteredTestimonies.slice(0, displayedItems);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDisplayedItems(12);
    }, 0);
    return () => clearTimeout(timer);
  }, [selectedCategory]);

  const loadMoreItems = async () => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 800));
    setDisplayedItems(prev => Math.min(prev + 12, filteredTestimonies.length));
    setIsLoading(false);
  };

  const hasMore = !useServerPagination && displayedItems < filteredTestimonies.length;

  return (
    <SectionComp
      icon={Quote}
      iconColor="secondary"
      heading="All Testimonies"
      subtext="Browse through all testimonies and be inspired by stories of God's goodness"
      contentProps={{ enableAnimation: false }}>
      {/* Category Filter */}
      <div className="flex flex-wrap items-center gap-3 mb-8 justify-center">
        <Filter className="w-4 h-4 text-muted-foreground" />
        {TESTIMONY_CATEGORY_FILTER_OPTIONS.map(category => (
          <Button
            key={category.value}
            variant={selectedCategory === category.text ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedCategory(category.text)}
            className="text-sm">
            {category.text}
          </Button>
        ))}
      </div>

      {/* Testimonies Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {itemsToShow.map((testimony, index) => (
          <motion.div
            key={testimony._id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.05 }}
            whileHover={{ y: -4 }}>
            <Link href={`/community/testimonies/${testimony._id}`}>
              <Card className="card-interactive h-full">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <Quote className="w-6 h-6 text-primary/20 shrink-0" />
                    {testimony.category && (
                      <span className="px-2 py-1 bg-primary/10 text-primary text-xs font-medium rounded-full">
                        {testimony.category}
                      </span>
                    )}
                  </div>
                  <MultilinePreview
                    text={testimony.content}
                    className="text-muted-foreground mb-6 line-clamp-4"
                  />

                  <div className="flex items-center justify-between pt-4 border-t border-border">
                    <div className="flex items-center gap-3">
                      <FixedImage
                        imageContext="public"
                        src={testimony.avatar}
                        alt={testimony.author}
                        width={40}
                        height={40}
                        className="h-10 w-10 rounded-full object-cover"
                      />
                      <div>
                        <p className="font-semibold text-sm text-foreground">{testimony.author}</p>
                        <p className="text-xs text-muted-foreground">{testimony.timeAgo}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Heart className="w-4 h-4" />
                        {testimony.likes}
                      </span>
                      <span className="flex items-center gap-1">
                        <MessageSquare className="w-4 h-4" />
                        {testimony.comments}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          </motion.div>
        ))}
      </div>

      {itemsToShow.length === 0 && (
        <SectionEmptyState
          title="No testimonies in this category"
          description="Try a different category or check back later for new testimonies."
          icon={Quote}
          actionLabel="View all testimonies"
          actionHref="/community/testimonies"
        />
      )}

      {/* Server pagination (prev/next page) */}
      {useServerPagination && pagination && (
        <div className="mt-10">
          <ListPagination
            page={pagination.page}
            totalPages={pagination.totalPages}
            total={pagination.total}
            limit={pagination.limit}
          />
        </div>
      )}

      {/* Load more (when not using server pagination) */}
      {hasMore && itemsToShow.length > 0 && (
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
                Load More Testimonies
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </motion.button>
        </div>
      )}
    </SectionComp>
  );
};
