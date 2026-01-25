'use client';

import { motion } from 'framer-motion';
import { useQueryState, parseAsString } from 'nuqs';

const genres = [
  { id: 'all', label: 'All Genres', emoji: '🎵' },
  { id: 'afrobeats', label: 'Afrobeats', emoji: '🌍' },
  { id: 'hiphop', label: 'Hip-Hop', emoji: '🎤' },
  { id: 'pop', label: 'Pop', emoji: '✨' },
  { id: 'rnb', label: 'R&B', emoji: '💜' },
  { id: 'gospel', label: 'Gospel', emoji: '🙌' },
  { id: 'instrumental', label: 'Instrumental', emoji: '🎹' },
  { id: 'acoustic', label: 'Acoustic', emoji: '🎸' },
  { id: 'worship', label: 'Worship', emoji: '🎶' },
  { id: 'spoken', label: 'Spoken Word', emoji: '📖' },
];

export const MusicCategories = () => {
  const [activeGenre, setActiveGenre] = useQueryState('genre', parseAsString.withDefault('all'));

  return (
    <section className="py-6 border-b border-border/50 sticky top-16 bg-background/95 backdrop-blur-sm z-40">
      <div className="container mx-auto px-4">
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {genres.map(genre => (
            <motion.button
              key={genre.id}
              onClick={() => setActiveGenre(genre.id)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`
                flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap
                transition-colors duration-200
                ${
                  activeGenre === genre.id
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted hover:bg-muted/80 text-foreground'
                }
              `}>
              <span>{genre.emoji}</span>
              <span>{genre.label}</span>
            </motion.button>
          ))}
        </div>
      </div>
    </section>
  );
};
