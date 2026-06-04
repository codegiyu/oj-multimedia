'use client';

import { useRef } from 'react';
import { motion } from 'motion/react';
import { Sparkles } from 'lucide-react';
import { SectionComp } from '@/components/general/SectionComp';
import { VideoCard } from '@/components/cards/VideoCard';
import { SectionEmptyState } from '@/components/general/SectionEmptyState';
import {
  VIDEO_DEFAULT_RAIL_ITEM_CLASS,
  VIDEO_RAIL_SCROLL_PX,
} from '@/lib/constants/mediaCardLayout';

export interface RecentVideoUpload {
  _id: string;
  title: string;
  creator: { _id: string; name: string };
  thumbnail: string;
  uploadedAt: string;
  category: string;
  views: string;
  duration: string;
}

interface RecentVideoUploadsProps {
  uploads: RecentVideoUpload[];
}

export const RecentVideoUploads = ({ uploads: recentUploads }: RecentVideoUploadsProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -VIDEO_RAIL_SCROLL_PX : VIDEO_RAIL_SCROLL_PX,
        behavior: 'smooth',
      });
    }
  };

  if (recentUploads.length === 0) {
    return (
      <SectionComp
        icon={Sparkles}
        iconColor="secondary"
        heading="Fresh Uploads"
        subtext="Just added by creators"
        viewAllLink="/videos/recent"
        contentProps={{ enableAnimation: false }}>
        <SectionEmptyState
          title="No recent uploads"
          description="No recent video uploads in this category yet. Check back later."
          icon={Sparkles}
          showDefaultActions
        />
      </SectionComp>
    );
  }

  return (
    <SectionComp
      icon={Sparkles}
      iconColor="secondary"
      heading="Fresh Uploads"
      subtext="Just added by creators"
      viewAllLink="/videos/recent"
      showPrevNext={true}
      onPrev={() => scroll('left')}
      onNext={() => scroll('right')}
      contentProps={{ enableAnimation: false }}>
      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory">
        {recentUploads.map((video, index) => (
          <motion.div
            key={video._id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.05 }}
            className={VIDEO_DEFAULT_RAIL_ITEM_CLASS}>
            <VideoCard
              _id={video._id}
              title={video.title}
              creator={video.creator}
              thumbnail={video.thumbnail}
              views={video.views}
              duration={video.duration}
              category={video.category}
            />
          </motion.div>
        ))}
      </div>
    </SectionComp>
  );
};
