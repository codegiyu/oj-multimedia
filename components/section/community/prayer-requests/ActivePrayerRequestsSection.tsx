'use client';

import { motion } from 'motion/react';
import { HandHeart, Heart, MessageCircle, Clock, ArrowRight, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useState } from 'react';
import { toast } from '@/components/atoms/Toast';
import { SectionComp } from '@/components/general/SectionComp';
import { ListPagination } from '@/components/general/ListPagination';
import type { PrayerRequest } from './PrayerRequestsPageClient';
import type { Pagination } from '@/lib/types/community';

interface ActivePrayerRequestsSectionProps {
  requests: PrayerRequest[];
  pagination?: Pagination | null;
}

export const ActivePrayerRequestsSection = ({
  requests,
  pagination = null,
}: ActivePrayerRequestsSectionProps) => {
  const [prayerCounts, setPrayerCounts] = useState<Record<string, number>>(
    requests.reduce(
      (acc, req) => {
        acc[req._id] = req.prayers;
        return acc;
      },
      {} as Record<string, number>
    )
  );
  const [displayedItems, setDisplayedItems] = useState(6);
  const [isLoading, setIsLoading] = useState(false);

  const useServerPagination = pagination != null && pagination.totalPages > 1;
  const itemsToShow = useServerPagination ? requests : requests.slice(0, displayedItems);

  const loadMoreItems = async () => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 800));
    setDisplayedItems(prev => Math.min(prev + 6, requests.length));
    setIsLoading(false);
  };

  const hasMore = !useServerPagination && displayedItems < requests.length;

  const handlePray = (e: React.MouseEvent, requestId: string) => {
    e.preventDefault();
    e.stopPropagation();
    setPrayerCounts(prev => ({
      ...prev,
      [requestId]: (prev[requestId] || 0) + 1,
    }));
    toast({
      title: 'Praying!',
      description: 'Thank you for joining in prayer.',
      variant: 'success',
    });
  };

  const handleComment = (e: React.MouseEvent, requestId: string) => {
    e.preventDefault();
    e.stopPropagation();
    // Navigate to detail page for comments
    window.location.href = `/community/prayer-requests/${requestId}`;
  };

  return (
    <SectionComp
      id="active-prayer-requests"
      icon={HandHeart}
      iconColor="accent"
      heading="Active Prayer Requests"
      subtext="Join us in lifting these needs to God"
      viewAllLink="/community/prayer-requests/active"
      contentProps={{ enableAnimation: false }}>
      <div className="grid md:grid-cols-2 gap-6">
        {itemsToShow.map((request, index) => (
          <motion.div
            key={request._id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ y: -4 }}
            className="bg-card rounded-2xl p-6 shadow-sm border border-border/50 hover:shadow-md transition-all">
            <Link href={`/community/prayer-requests/${request._id}`} className="block">
              <div className="flex items-start justify-between gap-3 mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    {request.urgent && (
                      <Badge className="bg-red-500 text-white flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        Urgent
                      </Badge>
                    )}
                    <Badge variant="secondary" className="text-xs">
                      {request.category}
                    </Badge>
                  </div>
                  <h3 className="font-semibold text-lg mb-2 group-hover:text-accent transition-colors">
                    {request.title}
                  </h3>
                  <p className="text-sm text-muted-foreground line-clamp-3 mb-3">
                    {request.content}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-border/50">
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {request.timeAgo}
                  </span>
                  <span className="flex items-center gap-1">
                    <Heart className="w-3 h-3" />
                    {prayerCounts[request._id] || request.prayers} prayers
                  </span>
                  <span className="flex items-center gap-1">
                    <MessageCircle className="w-3 h-3" />
                    {request.comments} comments
                  </span>
                </div>
              </div>
            </Link>

            <div className="flex items-center justify-between mt-4">
              <span className="text-sm text-muted-foreground">— {request.author}</span>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="ghost"
                  className="gap-1"
                  onClick={e => handlePray(e, request._id)}>
                  <Heart className="w-4 h-4" />
                  Pray
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  className="gap-1"
                  onClick={e => handleComment(e, request._id)}>
                  <MessageCircle className="w-4 h-4" />
                  Comment
                </Button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Server pagination */}
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
                Load More Requests
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </motion.button>
        </div>
      )}
    </SectionComp>
  );
};
