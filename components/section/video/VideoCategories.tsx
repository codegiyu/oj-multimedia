'use client';

import { useRouter, usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { useQueryState, parseAsString } from 'nuqs';

const categories = [
  { id: 'all', label: 'All Videos', emoji: '🎬' },
  { id: 'music', label: 'Music Videos', emoji: '🎵' },
  { id: 'short', label: 'Short Clips', emoji: '⚡' },
  { id: 'talks', label: 'Talks & Speeches', emoji: '🎤' },
  { id: 'creative', label: 'Creative Content', emoji: '✨' },
  { id: 'inspirational', label: 'Inspirational', emoji: '💫' },
  { id: 'live', label: 'Live Performances', emoji: '🎭' },
  { id: 'podcasts', label: 'Podcasts / Video Talks', emoji: '🎙️' },
  { id: 'sermon', label: 'Sermons', emoji: '📿' },
];

export const VideoCategories = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [activeCategory] = useQueryState('category', parseAsString.withDefault('all'));

  const handleCategoryChange = (categoryId: string) => {
    // Use router.push to trigger server-side re-render with new searchParams
    // nuqs will automatically sync from the URL change
    const newUrl = categoryId === 'all' ? pathname : `${pathname}?category=${categoryId}`;
    router.push(newUrl, { scroll: false });
  };

  return (
    <section className="py-6 border-b border-border/50">
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap justify-center gap-2 pb-2">
          {categories.map(category => (
            <motion.button
              key={category.id}
              onClick={() => handleCategoryChange(category.id)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`
                flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap
                transition-colors duration-200
                ${
                  activeCategory === category.id
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted hover:bg-muted/80 text-foreground'
                }
              `}>
              <span>{category.emoji}</span>
              <span>{category.label}</span>
            </motion.button>
          ))}
        </div>
      </div>
    </section>
  );
};
