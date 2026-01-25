'use client';

import { motion } from 'framer-motion';
import {
  Play,
  Heart,
  Download,
  MoreHorizontal,
  ChevronLeft,
  ChevronRight,
  Flame,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRef } from 'react';

export interface TrendingSong {
  id: number;
  title: string;
  artist: string;
  cover: string;
  plays: string;
  duration: string;
  isNew: boolean;
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
            <Button variant="ghost" className="text-muted-foreground hover:text-primary">
              View All
            </Button>
          </div>
        </div>

        {/* Songs Slider */}
        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory">
          {trendingSongs.map((song, index) => (
            <motion.div
              key={song.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ y: -8 }}
              className="group relative min-w-[200px] md:min-w-[240px] snap-start">
              <div className="bg-card rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow">
                {/* Cover */}
                <div className="relative aspect-square overflow-hidden">
                  <img
                    src={song.cover}
                    alt={song.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />

                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  {/* Play Button */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <Button variant="play" size="icon-lg" className="shadow-glow">
                      <Play className="w-6 h-6 fill-current ml-1" />
                    </Button>
                  </div>

                  {/* New Badge */}
                  {song.isNew && (
                    <span className="absolute top-3 left-3 px-2 py-1 bg-primary text-primary-foreground text-xs font-bold rounded-full">
                      NEW
                    </span>
                  )}

                  {/* Quick Actions */}
                  <div className="absolute top-3 right-3 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      className="bg-card/80 backdrop-blur-sm hover:bg-card">
                      <Heart className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      className="bg-card/80 backdrop-blur-sm hover:bg-card">
                      <Download className="w-4 h-4" />
                    </Button>
                  </div>

                  {/* Duration */}
                  <span className="absolute bottom-3 right-3 px-2 py-1 bg-foreground/80 text-background text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity">
                    {song.duration}
                  </span>
                </div>

                {/* Info */}
                <div className="p-4">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <h3 className="font-semibold truncate group-hover:text-primary transition-colors">
                        {song.title}
                      </h3>
                      <p className="text-sm text-muted-foreground truncate">{song.artist}</p>
                    </div>
                    <Button variant="ghost" size="icon-sm" className="shrink-0">
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">{song.plays} plays</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
