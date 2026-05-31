'use client';

import { motion } from 'motion/react';
import { Heart, MessageCircle, Calendar, Share2, AlertCircle, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/atoms/Toast';
import type { PrayerRequestItem } from '@/lib/constants/community/prayer-requests';
import { MultilineText } from '@/components/general/MultilineText';
import { LoginModal } from '@/components/auth/LoginModal';
import { useSendPrayer } from '@/lib/hooks/useSendPrayer';
import { CommunityContentDetailHero } from '../shared/CommunityContentDetailHero';
import type { ReactNode } from 'react';

interface PrayerRequestDetailPageClientProps {
  request: PrayerRequestItem;
  relatedSlot?: ReactNode;
}

export const PrayerRequestDetailPageClient = ({
  request,
  relatedSlot,
}: PrayerRequestDetailPageClientProps) => {
  const { prayerCount, sendPrayer, isLoginModalOpen, setIsLoginModalOpen, formatPrayerCount } =
    useSendPrayer(request._id, { initialCount: request.prayers });

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: request.title,
          text: request.content,
          url: window.location.href,
        });
        toast({
          title: 'Shared!',
          description: 'Prayer request shared successfully.',
          variant: 'success',
        });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        toast({
          title: 'Link Copied!',
          description: 'Prayer request link copied to clipboard.',
          variant: 'success',
        });
      }
    } catch {
      // User cancelled share
    }
  };

  const handlePray = () => {
    void sendPrayer();
  };

  return (
    <article className="min-h-screen">
      <CommunityContentDetailHero
        backHref="/community/prayer-requests"
        backLabel="Back to Prayer Requests"
        title={request.title}
        headerPrefix={
          request.urgent ? (
            <AlertCircle className="w-6 h-6 text-destructive flex-shrink-0 mt-1" />
          ) : undefined
        }
        metaItems={[
          { icon: User, label: request.author },
          ...(request.date
            ? [{ icon: Calendar, label: new Date(request.date).toLocaleDateString() }]
            : []),
        ]}
        badge={
          <>
            {request.urgent && (
              <span className="inline-flex w-fit px-3 py-1 rounded-full bg-destructive/10 text-destructive text-xs font-medium mr-2">
                Urgent
              </span>
            )}
            {request.category && (
              <span className="inline-flex w-fit px-3 py-1 rounded-full bg-primary/10 text-primary text-xs">
                {request.category}
              </span>
            )}
          </>
        }
      />

      <section className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="prose prose-lg max-w-none">
            <MultilineText
              text={request.fullContent || request.content}
              paragraphClassName="text-lg text-foreground leading-relaxed"
            />
          </motion.div>

          {request.isAnswered && request.testimony && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="mt-8 p-6 bg-green-500/10 border border-green-500/20 rounded-lg">
              <h3 className="text-xl font-display font-bold mb-4 text-green-600">Praise Report!</h3>
              <MultilineText
                text={request.testimony}
                paragraphClassName="text-foreground leading-relaxed"
              />
              {request.answeredDate && (
                <p className="text-sm text-muted-foreground mt-4">
                  Answered on {new Date(request.answeredDate).toLocaleDateString()}
                </p>
              )}
            </motion.div>
          )}

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-12 pt-8 border-t border-border flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-6">
              <Button variant="ghost" size="sm" onClick={handlePray} className="gap-2">
                <Heart className="w-4 h-4" />
                {formatPrayerCount(prayerCount)}
              </Button>
              <span className="flex items-center gap-2 text-sm text-muted-foreground">
                <MessageCircle className="w-4 h-4" />
                {request.comments} comments
              </span>
            </div>
            <Button onClick={handleShare} variant="outline" size="sm" className="gap-2">
              <Share2 className="w-4 h-4" />
              Share
            </Button>
          </motion.div>
        </div>
      </section>

      {relatedSlot}
      <LoginModal
        open={isLoginModalOpen}
        onOpenChange={setIsLoginModalOpen}
        title="Sign in to send a prayer"
        description="Create an account or sign in to join others in prayer."
      />
    </article>
  );
};
