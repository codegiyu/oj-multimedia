'use client';

import { useRouter } from 'next/navigation';
import { motion } from 'motion/react';
import { useQueryState, parseAsString } from 'nuqs';
import { ALL_CATEGORY_ID } from '@/lib/constants/contentTaxonomy';
import type { CategoryNavItem } from '@/lib/utils/contentCategoryNav';

const categoryEmojiById: Record<string, string> = {
  [ALL_CATEGORY_ID]: '🎬',
  music: '🎵',
  short: '⚡',
  talks: '🎤',
  creative: '✨',
  inspirational: '💫',
  live: '🎭',
  podcasts: '🎙️',
  sermon: '📿',
};

export type VideoCategoriesProps = {
  categoryOptions: CategoryNavItem[];
};

export const VideoCategories = ({ categoryOptions }: VideoCategoriesProps) => {
  const router = useRouter();
  const [activeCategory, setActiveCategory] = useQueryState(
    'category',
    parseAsString.withDefault(ALL_CATEGORY_ID)
  );

  const handleCategoryChange = async (categoryId: string) => {
    await setActiveCategory(categoryId === ALL_CATEGORY_ID ? null : categoryId);
    router.refresh();
  };

  return (
    <section className="py-6 border-b border-border/50">
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap justify-center gap-2 pb-2">
          {categoryOptions.map(category => (
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
              <span>{categoryEmojiById[category.id] ?? '🎬'}</span>
              <span>{category.label}</span>
            </motion.button>
          ))}
        </div>
      </div>
    </section>
  );
};
