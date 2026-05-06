'use client';

import { motion } from 'framer-motion';
import { useQueryState, parseAsString } from 'nuqs';
import { ALL_CATEGORY_ID, MUSIC_CATEGORIES } from '@/lib/constants/contentTaxonomy';

const genres = [{ id: ALL_CATEGORY_ID, label: 'All Genres' }, ...MUSIC_CATEGORIES];

const genreEmojiById: Record<string, string> = {
  [ALL_CATEGORY_ID]: '🎵',
  afrobeats: '🌍',
  hiphop: '🎤',
  pop: '✨',
  rnb: '💜',
  gospel: '🙌',
  instrumental: '🎹',
  acoustic: '🎸',
  worship: '🎶',
  spoken: '📖',
  sermon: '📿',
};

export const MusicCategories = () => {
  const [activeGenre, setActiveGenre] = useQueryState(
    'category',
    parseAsString.withDefault(ALL_CATEGORY_ID)
  );

  const handleCategoryChange = (categoryId: string) => {
    setActiveGenre(categoryId === ALL_CATEGORY_ID ? null : categoryId);
  };

  return (
    <section className="py-6 border-b border-border/50">
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap justify-center gap-2 pb-2">
          {genres.map(genre => {
            const isActive = activeGenre === genre.id;

            return (
              <motion.button
                key={genre.id}
                onClick={() => handleCategoryChange(genre.id)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`
                  flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap
                  transition-colors duration-200
                  ${
                    isActive
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted hover:bg-muted/80 text-foreground'
                  }
                `}>
                <span>{genreEmojiById[genre.id] ?? '🎵'}</span>
                <span>{genre.label}</span>
              </motion.button>
            );
          })}
        </div>
      </div>
    </section>
  );
};
