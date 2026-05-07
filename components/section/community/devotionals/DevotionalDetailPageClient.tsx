'use client';

import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Clock, Eye, Calendar, Share2, Bookmark, BookOpen } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/atoms/Toast';
import type { DevotionalItem } from '@/lib/constants/community/devotionals';
import { RelatedDevotionals } from './RelatedDevotionals';
import { sendContentAnalyticsEvent } from '@/lib/services/contentAnalytics';

interface DevotionalDetailPageClientProps {
  devotional: DevotionalItem;
  relatedDevotionals: DevotionalItem[];
}

export const DevotionalDetailPageClient = ({
  devotional,
  relatedDevotionals,
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
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary/10 via-background to-accent/10 py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <Link href="/community/devotionals">
              <Button variant="ghost" size="sm" className="gap-2 mb-6">
                <ArrowLeft className="w-4 h-4" />
                Back to Devotionals
              </Button>
            </Link>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}>
              <span className="inline-flex w-fit px-3 py-1 rounded-full bg-primary text-primary-foreground text-xs font-medium mb-4">
                {devotional.category}
              </span>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold mb-4">
                {devotional.title}
              </h1>
              {devotional.verse && (
                <p className="text-lg text-muted-foreground font-medium mb-6 italic">
                  {devotional.verse}
                </p>
              )}
              <div className="flex items-center gap-4 text-sm text-muted-foreground flex-wrap">
                {devotional.date && (
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {devotional.date}
                  </span>
                )}
                {devotional.readingTime && (
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {devotional.readingTime}
                  </span>
                )}
                {devotional.views && (
                  <span className="flex items-center gap-1">
                    <Eye className="w-4 h-4" />
                    {devotional.views.toLocaleString()} views
                  </span>
                )}
                {devotional.author && (
                  <span className="flex items-center gap-1">
                    <BookOpen className="w-4 h-4" />
                    {devotional.author}
                  </span>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Excerpt */}
          {devotional.excerpt && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-xl text-muted-foreground font-medium mb-8 leading-relaxed">
              {devotional.excerpt}
            </motion.div>
          )}

          {/* Full Content */}
          {devotional.fullContent && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="prose prose-lg max-w-none">
              {devotional.fullContent.introduction && (
                <p className="text-lg text-foreground leading-relaxed mb-6">
                  {devotional.fullContent.introduction}
                </p>
              )}

              {devotional.fullContent.sections?.map((section, sectionIndex) => (
                <div key={sectionIndex} className="mb-8">
                  {section.heading && (
                    <h2 className="text-2xl font-display font-bold text-foreground mb-4 mt-8">
                      {section.heading}
                    </h2>
                  )}
                  {section.paragraphs.map((paragraph, paraIndex) => (
                    <p key={paraIndex} className="text-base text-foreground leading-relaxed mb-4">
                      {paragraph}
                    </p>
                  ))}
                </div>
              ))}

              {devotional.fullContent.conclusion && (
                <p className="text-lg text-foreground leading-relaxed mt-8 font-medium">
                  {devotional.fullContent.conclusion}
                </p>
              )}
            </motion.div>
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
                    <span className="text-primary mt-1">•</span>
                    <span className="text-foreground">{point}</span>
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
              <Button variant="outline" size="sm" className="gap-2">
                <Bookmark className="w-4 h-4" />
                Save
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Related Devotionals */}
      {relatedDevotionals.length > 0 && (
        <section className="container mx-auto px-4 py-12 bg-muted/30">
          <RelatedDevotionals devotionals={relatedDevotionals} />
        </section>
      )}
    </article>
  );
};
