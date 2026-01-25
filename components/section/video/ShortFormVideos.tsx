'use client';

import { motion } from 'framer-motion';
import { Play, Heart, Share2, ChevronLeft, ChevronRight, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRef } from 'react';

export interface ShortFormVideo {
  id: number;
  title: string;
  creator: string;
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
              key={video.id}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ scale: 1.05 }}
              className="group relative min-w-[140px] md:min-w-[160px] snap-start">
              <div className="bg-card rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow">
                {/* Thumbnail - Vertical */}
                <div className="relative aspect-[9/16] overflow-hidden">
                  <img
                    src={video.thumbnail}
                    alt={video.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />

                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-foreground/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  {/* Play Button */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <Button variant="play" size="icon" className="shadow-glow">
                      <Play className="w-4 h-4 fill-current ml-0.5" />
                    </Button>
                  </div>

                  {/* Duration Badge */}
                  <span className="absolute bottom-2 right-2 px-1.5 py-0.5 bg-foreground/80 text-background text-[10px] rounded font-medium">
                    {video.duration}
                  </span>

                  {/* Actions on Hover */}
                  <div className="absolute bottom-2 left-2 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      className="bg-card/80 backdrop-blur-sm hover:bg-card h-7 w-7">
                      <Heart className="w-3 h-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      className="bg-card/80 backdrop-blur-sm hover:bg-card h-7 w-7">
                      <Share2 className="w-3 h-3" />
                    </Button>
                  </div>
                </div>

                {/* Info */}
                <div className="p-2">
                  <h3 className="font-semibold text-xs line-clamp-2 group-hover:text-primary transition-colors mb-1">
                    {video.title}
                  </h3>
                  <p className="text-[10px] text-muted-foreground truncate mb-1">{video.creator}</p>
                  <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                    <span>{video.views} views</span>
                    <span>•</span>
                    <span className="flex items-center gap-0.5">
                      <Heart className="w-2.5 h-2.5" />
                      {video.likes}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
