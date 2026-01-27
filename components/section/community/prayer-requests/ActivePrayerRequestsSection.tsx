'use client';

import { motion } from 'framer-motion';
import { HandHeart, Heart, MessageCircle, Clock, ArrowRight, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useState } from 'react';
import { toast } from '@/components/atoms/Toast';
import type { PrayerRequest } from './PrayerRequestsPageClient';

interface ActivePrayerRequestsSectionProps {
  requests: PrayerRequest[];
}

export const ActivePrayerRequestsSection = ({ requests }: ActivePrayerRequestsSectionProps) => {
  const [prayerCounts, setPrayerCounts] = useState<Record<number, number>>(
    requests.reduce(
      (acc, req) => {
        acc[req.id] = req.prayers;
        return acc;
      },
      {} as Record<number, number>
    )
  );
  const [displayedItems, setDisplayedItems] = useState(6);
  const [isLoading, setIsLoading] = useState(false);

  const loadMoreItems = async () => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 800));
    setDisplayedItems(prev => Math.min(prev + 6, requests.length));
    setIsLoading(false);
  };

  const hasMore = displayedItems < requests.length;
  const itemsToShow = requests.slice(0, displayedItems);

  const handlePray = (e: React.MouseEvent, requestId: number) => {
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

  const handleComment = (e: React.MouseEvent, requestId: number) => {
    e.preventDefault();
    e.stopPropagation();
    // Navigate to detail page for comments
    window.location.href = `/community/prayer-requests/${requestId}`;
  };

  return (
    <section className="container mx-auto px-4 py-12">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
            <HandHeart className="w-5 h-5 text-accent" />
          </div>
          <div>
            <h2 className="section-header">Active Prayer Requests</h2>
            <p className="text-muted-foreground text-sm">Join us in lifting these needs to God</p>
          </div>
        </div>
        <Button variant="ghost" className="gap-2 text-accent" asChild>
          <Link href="/community/prayer-requests/active">
            View All
            <ArrowRight className="w-4 h-4" />
          </Link>
        </Button>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {itemsToShow.map((request, index) => (
          <motion.div
            key={request.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ y: -4 }}
            className="bg-card rounded-2xl p-6 shadow-sm border border-border/50 hover:shadow-md transition-all">
            <Link href={`/community/prayer-requests/${request.id}`} className="block">
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
                    {prayerCounts[request.id] || request.prayers} prayers
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
                  onClick={e => handlePray(e, request.id)}>
                  <Heart className="w-4 h-4" />
                  Pray
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  className="gap-1"
                  onClick={e => handleComment(e, request.id)}>
                  <MessageCircle className="w-4 h-4" />
                  Comment
                </Button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Load More */}
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
    </section>
  );
};
