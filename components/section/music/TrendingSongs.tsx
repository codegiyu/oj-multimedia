'use client';

import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Flame } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRef } from 'react';
import Link from 'next/link';
import { MusicCard } from '@/components/cards/MusicCard';

export interface TrendingSong {
  _id: string;
  title: string;
  artist: string;
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

  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Flame className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h2 className="text-2xl font-display font-bold">Trending Now</h2>
              <p className="text-sm text-muted-foreground">What everyone's listening to</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => scroll('left')}
              className="hidden md:flex">
              <ChevronLeft className="w-5 h-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => scroll('right')}
              className="hidden md:flex">
              <ChevronRight className="w-5 h-5" />
            </Button>
            <Button variant="ghost" className="text-muted-foreground hover:text-primary" asChild>
              <Link href="/music/trending">View All</Link>
            </Button>
          </div>
        </div>

        {/* Songs Slider */}
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
      </div>
    </section>
  );
};
