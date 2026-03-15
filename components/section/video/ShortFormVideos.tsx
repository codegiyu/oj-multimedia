'use client';

import { motion } from 'framer-motion';
import { Zap } from 'lucide-react';
import { useRef } from 'react';
import { SectionComp } from '@/components/general/SectionComp';
import { VideoCard } from '@/components/cards/VideoCard';
import { EmptyState } from '../news/EmptyState';

export interface ShortFormVideo {
  _id: string;
  title: string;
  creator: { _id: string; name: string };
  thumbnail: string;
  views: string;
  duration: string;
  category: string;
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

  if (shortFormVideos.length === 0) {
    return (
      <SectionComp
        icon={Zap}
        iconColor="primary"
        heading="Short Clips"
        subtext="Quick, engaging content"
        viewAllLink="/videos/short-form"
        background="bg-muted/30"
        contentProps={{ enableAnimation: false }}>
        <EmptyState
          title="No short form videos"
          description="No short form videos in this category yet. Check back later."
          icon={<Zap className="w-12 h-12 text-muted-foreground" />}
        />
      </SectionComp>
    );
  }

  return (
    <SectionComp
      icon={Zap}
      iconColor="primary"
      heading="Short Clips"
      subtext="Quick, engaging content"
      viewAllLink="/videos/short-form"
      showPrevNext={true}
      onPrev={() => scroll('left')}
      onNext={() => scroll('right')}
      background="bg-muted/30"
      contentProps={{ enableAnimation: false }}>
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
              category={video.category}
              variant="shortForm"
              likes={video.likes}
            />
          </motion.div>
        ))}
      </div>
    </SectionComp>
  );
};
