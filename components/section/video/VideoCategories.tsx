'use client';

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
];

export const VideoCategories = () => {
  const [activeCategory, setActiveCategory] = useQueryState(
    'category',
    parseAsString.withDefault('all')
  );

  return (
    <section className="py-6 border-b border-border/50 sticky top-16 bg-background/95 backdrop-blur-sm z-40">
      <div className="container mx-auto px-4">
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {categories.map(category => (
            <motion.button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
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
