'use client';

import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Flame } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRef } from 'react';
import { VideoCard } from '@/components/cards/VideoCard';

export interface TrendingVideo {
  _id: string;
  title: string;
  creator: { _id: string; name: string };
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
              key={video._id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              className="min-w-[280px] md:min-w-[320px] snap-start">
              <VideoCard
                _id={video._id}
                title={video.title}
                creator={video.creator}
                thumbnail={video.thumbnail}
                views={video.views}
                duration={video.duration}
                category="Video"
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
