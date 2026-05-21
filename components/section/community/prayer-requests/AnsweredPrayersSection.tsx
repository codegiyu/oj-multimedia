'use client';

import { motion } from 'motion/react';
import { Sparkles, Heart, ArrowRight, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { useState } from 'react';
import { SectionComp } from '@/components/general/SectionComp';
import type { AnsweredPrayer } from './PrayerRequestsPageClient';

interface AnsweredPrayersSectionProps {
  prayers: AnsweredPrayer[];
}

export const AnsweredPrayersSection = ({ prayers }: AnsweredPrayersSectionProps) => {
  const [displayedItems, setDisplayedItems] = useState(6);
  const [isLoading, setIsLoading] = useState(false);

  const loadMoreItems = async () => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 800));
    setDisplayedItems(prev => Math.min(prev + 6, prayers.length));
    setIsLoading(false);
  };

  const hasMore = displayedItems < prayers.length;
  const itemsToShow = prayers.slice(0, displayedItems);

  return (
    <SectionComp
      id="answered-prayers"
      icon={Sparkles}
      iconColor="secondary"
      heading="Answered Prayers"
      subtext="Praise reports and testimonies of God's faithfulness"
      viewAllLink="/community/prayer-requests/answered"
      contentProps={{ enableAnimation: false }}>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {itemsToShow.map((prayer, index) => (
          <motion.div
            key={prayer._id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ y: -4 }}
            className="bg-card rounded-2xl p-6 shadow-sm border border-border/50 hover:shadow-md transition-all">
            <Link href={`/community/prayer-requests/${prayer._id}`}>
              <div className="flex items-start gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge className="bg-green-500 text-white">Answered</Badge>
                  </div>
                  <h3 className="font-semibold text-lg mb-1">{prayer.title}</h3>
                  <p className="text-xs text-muted-foreground">{prayer.answeredDate}</p>
                </div>
              </div>

              <div className="mb-4">
                <p className="text-xs text-muted-foreground mb-2 italic line-clamp-2">
                  Original: {prayer.originalRequest}
                </p>
                <p className="text-sm text-foreground line-clamp-4">{prayer.testimony}</p>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-border/50">
                <span className="text-sm text-muted-foreground">— {prayer.author}</span>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Heart className="w-3 h-3" />
                  {prayer.prayers} prayers
                </div>
              </div>
            </Link>
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
                Load More Answers
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </motion.button>
        </div>
      )}
    </SectionComp>
  );
};
