'use client';

import { useMemo, useRef } from 'react';
import { Flame } from 'lucide-react';
import { MusicCard } from '@/components/cards/MusicCard';
import { SectionComp } from '@/components/general/SectionComp';
import { EmptyState } from '@/components/section/news/EmptyState';
import { useQueryState, parseAsString } from 'nuqs';
import { motion } from 'motion/react';

export interface TrendingMusicItem {
  _id: string;
  title: string;
  artist: { _id: string; name: string };
  cover: string;
  plays: string;
  genre: string;
  isNew: boolean;
}

interface TrendingMusicSectionProps {
  music: TrendingMusicItem[];
}

const genres = [
  { id: 'All', label: 'All' },
  { id: 'Afrobeats', label: 'Afrobeats' },
  { id: 'Hip-Hop', label: 'Hip-Hop' },
  { id: 'Pop', label: 'Pop' },
  { id: 'R&B', label: 'R&B' },
  { id: 'Gospel', label: 'Gospel' },
  { id: 'Instrumental', label: 'Instrumental' },
];

export const TrendingMusicSection = ({ music: trendingMusic }: TrendingMusicSectionProps) => {
  const [selectedGenre] = useQueryState('genre', parseAsString.withDefault('All'));
  const scrollRef = useRef<HTMLDivElement>(null);

  const filteredMusic = useMemo(
    () =>
      selectedGenre === 'All'
        ? trendingMusic
        : trendingMusic.filter(track => track.genre === selectedGenre),
    [trendingMusic, selectedGenre]
  );

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 280;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  return (
    <SectionComp
      id="music"
      icon={Flame}
      iconColor="primary"
      heading="Trending Music"
      subtext="Discover what's hot right now"
      viewAllLink="/music/trending"
      tabs={genres}
      tabsQueryKey="genre"
      defaultTab="All"
      showPrevNext={true}
      onPrev={() => scroll('left')}
      onNext={() => scroll('right')}
      contentProps={{
        className: '',
        enableAnimation: false,
      }}>
      {filteredMusic.length === 0 ? (
        <EmptyState
          title="No trending music in this genre"
          description="Try a different genre or check back soon for new releases."
          icon={<Flame className="w-12 h-12 text-muted-foreground" />}
          actionLabel="View all music"
          actionHref="/music/trending"
          showDefaultActions={false}
        />
      ) : (
        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory">
          {filteredMusic.map((track, index) => (
            <motion.div
              key={track._id || index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              className="w-[160px] sm:w-[180px] md:w-[200px] lg:w-[220px] xl:w-[240px] 2xl:w-[260px] snap-start shrink-0">
              <MusicCard {...track} />
            </motion.div>
          ))}
        </div>
      )}
    </SectionComp>
  );
};
