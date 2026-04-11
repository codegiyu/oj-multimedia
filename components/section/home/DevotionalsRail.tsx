'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { BookOpen } from 'lucide-react';
import { SectionComp } from '@/components/general/SectionComp';
import { EmptyState } from '@/components/section/news/EmptyState';

export interface HomeDevotionalCard {
  _id: string;
  title: string;
  slug: string;
  excerpt?: string;
  coverImage?: string;
}

interface DevotionalsRailProps {
  items: HomeDevotionalCard[];
}

export function DevotionalsRail({ items }: DevotionalsRailProps) {
  return (
    <SectionComp
      icon={BookOpen}
      iconColor="accent"
      heading="Latest devotionals"
      subtext="Daily encouragement and study"
      viewAllLink="/community/devotionals"
      showPrevNext={false}
      contentProps={{ className: '', enableAnimation: false }}>
      {items.length === 0 ? (
        <EmptyState
          title="No devotionals yet"
          description="New devotionals will show up here."
          icon={<BookOpen className="w-12 h-12 text-muted-foreground" />}
          actionLabel="Community hub"
          actionHref="/community"
          showDefaultActions={false}
        />
      ) : (
        <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory">
          {items.map((d, index) => (
            <motion.div
              key={d._id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              className="w-[260px] sm:w-[280px] shrink-0 snap-start">
              <Link
                href={`/community/devotionals/${encodeURIComponent(d.slug || d._id)}`}
                className="block rounded-2xl border border-border/60 bg-card overflow-hidden hover:border-primary/40 transition-colors shadow-sm">
                {d.coverImage ? (
                  <div className="aspect-[16/10] relative bg-muted">
                    <img
                      src={d.coverImage}
                      alt=""
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="aspect-[16/10] bg-muted flex items-center justify-center">
                    <BookOpen className="w-10 h-10 text-muted-foreground" />
                  </div>
                )}
                <div className="p-4">
                  <h3 className="font-semibold text-foreground line-clamp-2">{d.title}</h3>
                  {d.excerpt && (
                    <p className="text-sm text-muted-foreground line-clamp-2 mt-2">{d.excerpt}</p>
                  )}
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      )}
    </SectionComp>
  );
}
