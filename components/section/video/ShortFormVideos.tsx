'use client';

import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { VideoCard } from '@/components/cards/VideoCard';
import { useRef } from 'react';

export interface ShortFormVideo {
  _id: string;
  title: string;
  creator: { _id: string; name: string };
  thumbnail: string;
  views: string;
  duration: string;
  likes: string;
}

interface ShortFormVideosProps {
  videos: ShortFormVideo[];
}

export const ShortFormVideos = ({ videos: shortFormVideos }: ShortFormVideosProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 180;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  return (
    <section className="py-12 bg-muted/30">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Zap className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h2 className="text-2xl font-display font-bold">Short Clips</h2>
              <p className="text-sm text-muted-foreground">Quick, engaging content</p>
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

        {/* Short Videos Slider */}
        <div
          ref={scrollRef}
          className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory">
          {shortFormVideos.map((video, index) => (
            <motion.div
              key={video._id}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              className="min-w-[140px] md:min-w-[160px] snap-start">
              <VideoCard
                _id={video._id}
                title={video.title}
                creator={video.creator}
                thumbnail={video.thumbnail}
                views={video.views}
                duration={video.duration}
                category=""
                variant="shortForm"
                likes={video.likes}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
