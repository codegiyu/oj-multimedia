'use client';

import { useEffect } from 'react';
import { motion } from 'motion/react';
import { Clock, Eye, Calendar, Share2, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/atoms/Toast';
import type { DevotionalItem } from '@/lib/constants/community/devotionals';
import { MultilineText } from '@/components/general/MultilineText';
import { StructuredProseContent } from '@/components/general/StructuredProseContent';
import { sendContentAnalyticsEvent } from '@/lib/services/contentAnalytics';
import { CommunityContentDetailHero } from '../shared/CommunityContentDetailHero';
import { DevotionalSaveButton } from '@/components/content/DevotionalSaveButton';
import type { ReactNode } from 'react';

interface DevotionalDetailPageClientProps {
  devotional: DevotionalItem;
  relatedSlot?: ReactNode;
}

export const DevotionalDetailPageClient = ({
  devotional,
  relatedSlot,
}: DevotionalDetailPageClientProps) => {
  useEffect(() => {
    sendContentAnalyticsEvent('devotional', devotional._id, 'view');
  }, [devotional._id]);

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: devotional.title,
          text: devotional.excerpt || devotional.title,
          url: window.location.href,
        });
        toast({
          title: 'Shared!',
          description: 'Devotional shared successfully.',
          variant: 'success',
        });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        toast({
          title: 'Link Copied!',
          description: 'Devotional link copied to clipboard.',
          variant: 'success',
        });
      }
    } catch {
      // User cancelled share
    }
  };

  return (
    <article className="min-h-screen">
      <CommunityContentDetailHero
        backHref="/community/devotionals"
        backLabel="Back to Devotionals"
        title={devotional.title}
        subtitle={devotional.verse}
        badge={
          <span className="inline-flex w-fit px-3 py-1 rounded-full bg-primary text-primary-foreground text-xs font-medium">
            {devotional.category}
          </span>
        }
        metaItems={[
          ...(devotional.date ? [{ icon: Calendar, label: devotional.date }] : []),
          ...(devotional.readingTime ? [{ icon: Clock, label: devotional.readingTime }] : []),
          ...(devotional.views
            ? [{ icon: Eye, label: `${devotional.views.toLocaleString()} views` }]
            : []),
          ...(devotional.author ? [{ icon: BookOpen, label: devotional.author }] : []),
        ]}
      />

      {/* Main Content */}
      <section className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Excerpt */}
          {devotional.excerpt && (
            <MultilineText
              animate
              text={devotional.excerpt}
              className="mb-8"
              paragraphClassName="text-xl text-muted-foreground font-medium leading-relaxed"
            />
          )}

          {/* Full Content — API may send structured object or plain content string */}
          {(devotional.fullContent || (devotional as { content?: string }).content) && (
            <StructuredProseContent
              animate
              content={devotional.fullContent ?? (devotional as { content?: string }).content}
            />
          )}

          {/* Prayer Points */}
          {devotional.prayerPoints && devotional.prayerPoints.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mt-12 p-6 bg-muted/50 rounded-lg">
              <h3 className="text-xl font-display font-bold mb-4">Prayer Points</h3>
              <ul className="space-y-2">
                {devotional.prayerPoints.map((point, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-primary mt-1 shrink-0">•</span>
                    <MultilineText
                      text={point}
                      className="space-y-1 flex-1"
                      paragraphClassName="text-foreground"
                    />
                  </li>
                ))}
              </ul>
            </motion.div>
          )}

          {/* Meta Information Footer */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-12 pt-8 border-t border-border flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              {devotional.views && (
                <span className="flex items-center gap-2">
                  <Eye className="w-4 h-4" />
                  {devotional.views.toLocaleString()} views
                </span>
              )}
            </div>
            <div className="flex gap-2">
              <Button onClick={handleShare} variant="outline" size="sm" className="gap-2">
                <Share2 className="w-4 h-4" />
                Share
              </Button>
              <DevotionalSaveButton entityId={devotional._id} variant="labeled" />
            </div>
          </motion.div>
        </div>
      </section>

      {relatedSlot}
    </article>
  );
};
