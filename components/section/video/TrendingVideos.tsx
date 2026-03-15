'use client';

import { motion } from 'framer-motion';
import { Flame } from 'lucide-react';
import { useRef } from 'react';
import { SectionComp } from '@/components/general/SectionComp';
import { VideoCard } from '@/components/cards/VideoCard';
import { EmptyState } from '../news/EmptyState';

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

  if (trendingVideos.length === 0) {
    return (
      <SectionComp
        icon={Flame}
        iconColor="primary"
        heading="Trending Now"
        subtext="What everyone's watching"
        viewAllLink="/videos/trending"
        contentProps={{ enableAnimation: false }}>
        <EmptyState
          title="No trending videos"
          description="No trending videos in this category yet. Try another category or check back later."
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
      subtext="What everyone's watching"
      viewAllLink="/videos/trending"
      showPrevNext={true}
      onPrev={() => scroll('left')}
      onNext={() => scroll('right')}
      contentProps={{ enableAnimation: false }}>
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
    </SectionComp>
  );
};
