'use client';

import { motion } from 'framer-motion';
import {
  Play,
  Heart,
  Share2,
  MoreHorizontal,
  ChevronLeft,
  ChevronRight,
  Flame,
  Clock,
  Eye,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRef } from 'react';
import Link from 'next/link';

export interface TrendingVideo {
  id: number;
  title: string;
  creator: string;
  thumbnail: string;
  views: string;
  duration: string;
  uploadedAt: string;
  isNew: boolean;
}

interface TrendingVideosProps {
  videos: TrendingVideo[];
}

export const TrendingVideos = ({ videos: trendingVideos }: TrendingVideosProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 340;
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
              <p className="text-sm text-muted-foreground">What everyone's watching</p>
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

        {/* Videos Slider */}
        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory">
          {trendingVideos.map((video, index) => (
            <motion.div
              key={video.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ y: -8 }}
              className="group relative min-w-[280px] md:min-w-[320px] snap-start">
              <Link href={`/videos/${video.id}`} className="block">
                <div className="bg-card rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow cursor-pointer">
                {/* Thumbnail */}
                <div className="relative aspect-video overflow-hidden">
                  <img
                    src={video.thumbnail}
                    alt={video.title}
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

                  {/* Duration Badge */}
                  <span className="absolute bottom-3 right-3 px-2 py-1 bg-foreground/80 text-background text-xs rounded-md font-medium">
                    {video.duration}
                  </span>

                  {/* New Badge */}
                  {video.isNew && (
                    <span className="absolute top-3 left-3 px-2 py-1 bg-primary text-primary-foreground text-xs font-bold rounded-full">
                      NEW
                    </span>
                  )}

                  {/* Quick Actions */}
                  <div
                    className="absolute top-3 right-3 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={e => e.stopPropagation()}>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      className="bg-card/80 backdrop-blur-sm hover:bg-card"
                      onClick={e => e.preventDefault()}>
                      <Heart className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      className="bg-card/80 backdrop-blur-sm hover:bg-card"
                      onClick={e => e.preventDefault()}>
                      <Share2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {/* Info */}
                <div className="p-4">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="min-w-0 flex-1">
                      <h3 className="font-semibold truncate group-hover:text-primary transition-colors mb-1">
                        {video.title}
                      </h3>
                      <p className="text-sm text-muted-foreground truncate">{video.creator}</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      className="shrink-0"
                      onClick={e => {
                        e.preventDefault();
                        e.stopPropagation();
                      }}>
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Eye className="w-3 h-3" />
                      {video.views} views
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {video.uploadedAt}
                    </span>
                  </div>
                </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
