'use client';

import { motion } from 'framer-motion';
import { Flame } from 'lucide-react';
import { useRef } from 'react';
import { SectionComp } from '@/components/general/SectionComp';
import { MusicCard } from '@/components/cards/MusicCard';
import { EmptyState } from '../news/EmptyState';

export interface TrendingSong {
  _id: string;
  title: string;
  artist: { _id: string; name: string };
  cover: string;
  plays: string;
  duration: string;
  isNew: boolean;
  category?: string;
}

interface TrendingSongsProps {
  songs: TrendingSong[];
}

export const TrendingSongs = ({ songs: trendingSongs }: TrendingSongsProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 320;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  if (trendingSongs.length === 0) {
    return (
      <SectionComp
        icon={Flame}
        iconColor="primary"
        heading="Trending Now"
        subtext="What everyone's listening to"
        viewAllLink="/music/trending"
        contentProps={{ enableAnimation: false }}>
        <EmptyState
          title="No trending songs"
          description="No trending songs in this category yet. Try another category or check back later."
          icon={<Flame className="w-12 h-12 text-muted-foreground" />}
        />
      </SectionComp>
    );
  }

  return (
    <SectionComp
      icon={Flame}
      iconColor="primary"
      heading="Trending Now"
      subtext="What everyone's listening to"
      viewAllLink="/music/trending"
      showPrevNext={true}
      onPrev={() => scroll('left')}
      onNext={() => scroll('right')}
      contentProps={{ enableAnimation: false }}>
      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory">
        {trendingSongs.map((song, index) => (
          <motion.div
            key={song._id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.05 }}
            className="min-w-[200px] md:min-w-[240px] snap-start">
            <MusicCard
              _id={song._id}
              title={song.title}
              artist={song.artist}
              cover={song.cover}
              plays={song.plays}
              genre={song.category || 'Music'}
              isNew={song.isNew}
            />
          </motion.div>
        ))}
      </div>
    </SectionComp>
  );
};
