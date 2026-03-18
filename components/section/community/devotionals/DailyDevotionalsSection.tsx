'use client';

import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Calendar, Clock, Eye, Bookmark } from 'lucide-react';
import Link from 'next/link';
import { SectionComp } from '@/components/general/SectionComp';
import { DataLoadError } from '@/components/general/DataLoadError';
import { EmptyState } from '@/components/section/news/EmptyState';
import type { DailyDevotional } from './DevotionalsPageClient';

interface DailyDevotionalsSectionProps {
  devotionals: DailyDevotional[];
  initialErrorMessage?: string | null;
}

export const DailyDevotionalsSection = ({
  devotionals,
  initialErrorMessage = null,
}: DailyDevotionalsSectionProps) => {
  const router = useRouter();
  if (initialErrorMessage && devotionals.length === 0) {
    return (
      <div className="container mx-auto px-4 pb-16">
        <DataLoadError
          title="Unable to load devotionals"
          message={initialErrorMessage}
          onRetry={() => router.refresh()}
          icon={<Calendar className="w-8 h-8 text-destructive" />}
        />
      </div>
    );
  }
  if (devotionals.length === 0) {
    return (
      <div className="container mx-auto px-4 pb-16">
        <EmptyState
          title="No latest devotionals"
          description="Check back later for new daily devotionals."
          icon={<Calendar className="w-12 h-12 text-muted-foreground" />}
          actionLabel="Back to Devotionals"
          actionHref="/community/devotionals"
        />
      </div>
    );
  }
  return (
    <SectionComp
      id="daily-devotionals"
      icon={Calendar}
      iconColor="secondary"
      heading="Daily Devotionals"
      subtext="Start your day with God's word"
      viewAllLink="/community/devotionals/latest"
      contentProps={{ enableAnimation: false }}>
      <div className="grid md:grid-cols-2 gap-4">
        {devotionals.map((devotional, index) => (
          <motion.div
            key={devotional._id}
            initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.01 }}
            className="bg-card rounded-2xl p-5 shadow-sm border border-border/50 hover:shadow-md transition-all cursor-pointer group">
            <Link href={`/community/devotionals/${devotional._id}`}>
              <div className="flex gap-4">
                <div className="w-16 h-16 rounded-xl bg-secondary/10 flex items-center justify-center shrink-0">
                  <Calendar className="w-7 h-7 text-secondary" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs text-secondary font-medium">
                          {devotional.category}
                        </span>
                        {devotional.date === 'Today' && (
                          <span className="text-xs bg-green-500/20 text-green-600 dark:text-green-400 px-2 py-0.5 rounded-full">
                            Today
                          </span>
                        )}
                      </div>
                      <h3 className="font-semibold group-hover:text-secondary transition-colors line-clamp-1">
                        {devotional.title}
                      </h3>
                      <p className="text-sm text-primary font-medium mt-1">{devotional.verse}</p>
                    </div>
                    <button className="p-2 rounded-lg hover:bg-muted transition-colors shrink-0">
                      <Bookmark className="w-4 h-4 text-muted-foreground" />
                    </button>
                  </div>

                  <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                    {devotional.excerpt}
                  </p>

                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>{devotional.date}</span>
                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {devotional.readingTime}
                      </span>
                      <span className="flex items-center gap-1">
                        <Eye className="w-3 h-3" />
                        {devotional.views.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </SectionComp>
  );
};
