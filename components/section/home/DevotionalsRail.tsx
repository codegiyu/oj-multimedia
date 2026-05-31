'use client';

import Link from 'next/link';
import { FillImage } from '@/components/general/FillImage';
import { motion } from 'motion/react';
import { ArrowRight, BookOpen } from 'lucide-react';
import { SectionComp } from '@/components/general/SectionComp';
import { SectionEmptyState } from '@/components/general/SectionEmptyState';
import { MultilinePreview } from '@/components/general/MultilinePreview';

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
        <SectionEmptyState
          title="No devotionals yet"
          description="New devotionals will show up here."
          icon={BookOpen}
          actionLabel="Community hub"
          actionHref="/community"
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
              whileHover={{ y: -4 }}
              className="w-[260px] sm:w-[280px] shrink-0 snap-start">
              <Link
                href={`/community/devotionals/${encodeURIComponent(d.slug || d._id)}`}
                className="group block rounded-2xl border border-border/60 bg-card overflow-hidden hover:border-primary/40 shadow-sm hover:shadow-lg transition-all">
                <div className="aspect-[16/10] relative bg-muted overflow-hidden">
                  <FillImage
                    src={d.coverImage ?? ''}
                    alt=""
                    imageContext="public"
                    sizes="(max-width: 768px) 50vw, 400px"
                    className="transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-foreground line-clamp-2 group-hover:text-primary transition-colors">
                    {d.title}
                  </h3>
                  {d.excerpt && (
                    <MultilinePreview
                      text={d.excerpt}
                      className="text-sm text-muted-foreground line-clamp-2 mt-2"
                    />
                  )}
                  <span className="mt-3 flex items-center gap-1 text-sm font-medium text-primary">
                    Read more
                    <ArrowRight className="w-4 h-4" />
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      )}
    </SectionComp>
  );
}
