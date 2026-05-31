'use client';

import { motion } from 'motion/react';
import { BookOpen, Clock, Eye } from 'lucide-react';
import Link from 'next/link';
import { SectionComp } from '@/components/general/SectionComp';
import { SectionEmptyState } from '@/components/general/SectionEmptyState';
import { DevotionalListThumbnail } from '@/components/section/community/devotionals/DevotionalListThumbnail';
import { DevotionalSaveButton } from '@/components/content/DevotionalSaveButton';

export interface Devotional {
  _id: string;
  title: string;
  excerpt: string;
  author: string;
  readTime: string;
  views: number;
  category: string;
  coverImage?: string;
}

interface TrendingDevotionalsProps {
  devotionals: Devotional[];
}

export const TrendingDevotionals = ({ devotionals }: TrendingDevotionalsProps) => {
  return (
    <SectionComp
      icon={BookOpen}
      iconColor="secondary"
      heading="Popular Devotionals"
      subtext="Most viewed devotionals"
      viewAllLink="/community/devotionals/popular"
      sectionClassName="overflow-hidden"
      contentProps={{ enableAnimation: false }}>
      {devotionals.length === 0 ? (
        <SectionEmptyState
          title="No popular devotionals yet"
          description="Most-viewed devotionals will show up here. Check back soon."
          icon={BookOpen}
          actionLabel="Browse devotionals"
          actionHref="/community/devotionals"
        />
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {devotionals.map((devotional, index) => (
            <motion.div
              key={devotional._id}
              initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.01 }}
              className="bg-card rounded-2xl p-5 shadow-sm border border-border/50 hover:shadow-md transition-all group">
              <div className="flex gap-4">
                <Link
                  href={`/community/devotionals/${devotional._id}`}
                  className="flex gap-4 flex-1 min-w-0">
                  <DevotionalListThumbnail coverImage={devotional.coverImage} title={devotional.title} />

                  <div className="flex-1 min-w-0">
                    <div className="mb-2">
                      <span className="text-xs text-secondary font-medium">
                        {devotional.category}
                      </span>
                      <h3 className="font-semibold group-hover:text-secondary transition-colors line-clamp-1">
                        {devotional.title}
                      </h3>
                    </div>

                    <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                      {devotional.excerpt}
                    </p>

                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>{devotional.author}</span>
                      <div className="flex items-center gap-3">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {devotional.readTime}
                        </span>
                        <span className="flex items-center gap-1">
                          <Eye className="w-3 h-3" />
                          {devotional.views.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
                <DevotionalSaveButton entityId={devotional._id} />
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </SectionComp>
  );
};
