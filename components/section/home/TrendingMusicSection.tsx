'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Flame } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { MusicCard } from '@/components/cards/MusicCard';

export interface TrendingMusicItem {
  title: string;
  artist: string;
  cover: string;
  plays: string;
  genre: string;
  isNew: boolean;
}

interface TrendingMusicSectionProps {
  music: TrendingMusicItem[];
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export const TrendingMusicSection = ({ music: trendingMusic }: TrendingMusicSectionProps) => {
  const [selectedGenre, setSelectedGenre] = useState<string>('All');

  const genres = ['All', 'Afrobeats', 'Hip-Hop', 'Pop', 'R&B', 'Gospel', 'Instrumental'];

  const filteredMusic =
    selectedGenre === 'All'
      ? trendingMusic
      : trendingMusic.filter(track => track.genre === selectedGenre);

  return (
    <section id="music" className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Flame className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h2 className="section-header">Trending Music</h2>
              <p className="text-muted-foreground text-sm">Discover what's hot right now</p>
            </div>
          </div>
          <Button
            variant="ghost"
            className="gap-2 text-muted-foreground hover:text-primary"
            asChild>
            <Link href="/music/trending">
              View All
              <ArrowRight className="w-4 h-4" />
            </Link>
          </Button>
        </div>

        {/* Genre Filter */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2 scrollbar-hide">
          {genres.map(genre => (
            <button
              key={genre}
              onClick={() => setSelectedGenre(genre)}
              className={`quick-link whitespace-nowrap transition-colors ${
                selectedGenre === genre ? 'bg-primary text-primary-foreground' : ''
              }`}>
              {genre}
            </button>
          ))}
        </div>

        {/* Music Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 md:gap-6">
          {filteredMusic.map((track, index) => (
            <motion.div key={index} variants={itemVariants}>
              <MusicCard {...track} />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};
