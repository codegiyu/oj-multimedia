'use client';

import { motion } from 'motion/react';
import { HandHeart, Heart, Clock, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { SectionComp } from '@/components/general/SectionComp';
import { EmptyState } from '@/components/section/news/EmptyState';
import { LoginModal } from '@/components/auth/LoginModal';
import { useSendPrayer } from '@/lib/hooks/useSendPrayer';
import type { PrayerRequest } from './prayer-requests/PrayerRequestsPageClient';

interface RecentPrayerRequestsSectionProps {
  requests: PrayerRequest[];
}

function RecentPrayerRequestCard({ request }: { request: PrayerRequest }) {
  const {
    prayerCount,
    sendPrayer,
    isPending,
    isLoginModalOpen,
    setIsLoginModalOpen,
    formatPrayerCount,
  } = useSendPrayer(request._id, { initialCount: request.prayers });

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        whileHover={{ y: -4 }}
        className="bg-card rounded-2xl p-5 shadow-sm border border-border/50 hover:shadow-md transition-all">
        <Link href={`/community/prayer-requests/${request._id}`} className="block">
          <div className="flex items-start justify-between gap-3 mb-3">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                {request.urgent && (
                  <Badge className="bg-red-500 text-white flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    Urgent
                  </Badge>
                )}
                {request.category && (
                  <Badge variant="secondary" className="text-xs">
                    {request.category}
                  </Badge>
                )}
              </div>
              <h3 className="font-semibold text-lg mb-2 line-clamp-1">{request.title}</h3>
              <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{request.content}</p>
            </div>
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-border/50 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {request.timeAgo}
            </span>
            <span>{formatPrayerCount(prayerCount)}</span>
          </div>
        </Link>

        <div className="flex items-center justify-between mt-4">
          <span className="text-sm text-muted-foreground">— {request.author}</span>
          <Button
            size="sm"
            variant="ghost"
            className="gap-1"
            disabled={isPending}
            onClick={e => void sendPrayer(e)}>
            <Heart className="w-4 h-4" />
            Send prayer
          </Button>
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

export const RecentPrayerRequestsSection = ({ requests }: RecentPrayerRequestsSectionProps) => {
  return (
    <SectionComp
      icon={HandHeart}
      iconColor="accent"
      heading="Recent Prayer Requests"
      subtext="Join us in lifting these needs to God"
      viewAllLink="/community/prayer-requests/active"
      contentProps={{ enableAnimation: false }}>
      {requests.length === 0 ? (
        <EmptyState
          title="No active prayer requests"
          description="When someone shares a need, it will appear here. You can also submit your own."
          icon={<HandHeart className="w-12 h-12 text-muted-foreground" />}
          actionLabel="View prayer requests"
          actionHref="/community/prayer-requests"
          showDefaultActions={false}
        />
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {requests.map(request => (
            <RecentPrayerRequestCard key={request._id} request={request} />
          ))}
        </div>
      )}
    </SectionComp>
  );
};
