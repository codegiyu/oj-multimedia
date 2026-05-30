'use client';

import { motion } from 'motion/react';
import { HandHeart, Heart, MessageCircle, Clock, ArrowRight, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { SectionComp } from '@/components/general/SectionComp';
import { ListPagination } from '@/components/general/ListPagination';
import { LoginModal } from '@/components/auth/LoginModal';
import { useSendPrayer } from '@/lib/hooks/useSendPrayer';
import type { PrayerRequest } from './PrayerRequestsPageClient';
import type { Pagination } from '@/lib/types/community';
import { useState } from 'react';

interface ActivePrayerRequestsSectionProps {
  requests: PrayerRequest[];
  pagination?: Pagination | null;
}

function ActivePrayerRequestCard({ request }: { request: PrayerRequest }) {
  const {
    prayerCount,
    sendPrayer,
    isPending,
    isLoginModalOpen,
    setIsLoginModalOpen,
    formatPrayerCount,
  } = useSendPrayer(request._id, { initialCount: request.prayers });

  const handleComment = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    window.location.href = `/community/prayer-requests/${request._id}`;
  };

  return (
    <>
      <motion.div
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
              <p className="text-sm text-muted-foreground line-clamp-3 mb-3">{request.content}</p>
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
                {formatPrayerCount(prayerCount)}
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
              disabled={isPending}
              onClick={e => void sendPrayer(e)}>
              <Heart className="w-4 h-4" />
              Send prayer
            </Button>
            <Button size="sm" variant="ghost" className="gap-1" onClick={handleComment}>
              <MessageCircle className="w-4 h-4" />
              Comment
            </Button>
          </div>
        </div>
      </motion.div>
      <LoginModal
        open={isLoginModalOpen}
        onOpenChange={setIsLoginModalOpen}
        title="Sign in to send a prayer"
        description="Create an account or sign in to join others in prayer."
      />
    </>
  );
}

export const ActivePrayerRequestsSection = ({
  requests,
  pagination = null,
}: ActivePrayerRequestsSectionProps) => {
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
            transition={{ delay: index * 0.1 }}>
            <ActivePrayerRequestCard request={request} />
          </motion.div>
        ))}
      </div>

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
