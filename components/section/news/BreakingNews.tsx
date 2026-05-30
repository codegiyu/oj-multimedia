'use client';

import { useRef } from 'react';
import Link from 'next/link';
import { motion } from 'motion/react';
import { AlertTriangle } from 'lucide-react';
import { SectionComp } from '@/components/general/SectionComp';
import { EmptyState } from './EmptyState';
import { NewsPriorityIndicator } from './NewsPriorityIndicator';

export interface BreakingNewsStory {
  _id: string;
  title: string;
  excerpt?: string;
  category: string;
  readTime: string;
  views: string;
  priority: number;
  author?: string;
  date?: string;
}

interface BreakingNewsProps {
  stories: BreakingNewsStory[];
}

export const BreakingNews = ({ stories }: BreakingNewsProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollBy({
      left: direction === 'left' ? -280 : 280,
      behavior: 'smooth',
    });
  };

  if (stories.length === 0) {
    return (
      <SectionComp
        icon={AlertTriangle}
        iconColor="accent"
        heading="Breaking News"
        subtext="High-priority stories from the last week"
        viewAllLink="/news/breaking"
        background="bg-destructive/5 border-y border-destructive/10"
        contentProps={{ enableAnimation: false }}>
        <EmptyState
          title="No breaking stories"
          description="There are no high-priority stories right now. Check back soon."
          icon={<AlertTriangle className="w-12 h-12 text-muted-foreground" />}
        />
      </SectionComp>
    );
  }

  return (
    <SectionComp
      icon={AlertTriangle}
      iconColor="accent"
      heading="Breaking News"
      subtext="High-priority stories from the last week"
      viewAllLink="/news/breaking"
      showPrevNext
      onPrev={() => scroll('left')}
      onNext={() => scroll('right')}
      background="bg-destructive/5 border-y border-destructive/10"
      contentProps={{ enableAnimation: false }}>
      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide snap-x snap-mandatory">
        {stories.map((story, index) => (
          <motion.article
            key={story._id}
            initial={{ opacity: 0, x: 12 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.04 }}
            className="min-w-[260px] max-w-[320px] snap-start shrink-0 rounded-xl border border-destructive/20 bg-card p-4 shadow-sm hover:border-destructive/40 transition-colors">
            <div className="flex items-start justify-between gap-2 mb-2">
              <span className="text-xs font-medium text-destructive uppercase tracking-wide">
                {story.category}
              </span>
              <NewsPriorityIndicator priority={story.priority} />
            </div>
            <Link href={`/news/story/${story._id}`} className="group block">
              <h3 className="font-display font-semibold text-base leading-snug group-hover:text-primary transition-colors line-clamp-2">
                {story.title}
              </h3>
              {story.excerpt ? (
                <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{story.excerpt}</p>
              ) : null}
            </Link>
            <div className="mt-3 flex items-center gap-3 text-xs text-muted-foreground">
              <span>{story.readTime}</span>
              <span>{story.views} views</span>
            </div>
          </motion.article>
        ))}
      </div>
    </SectionComp>
  );
};
