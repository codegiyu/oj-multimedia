'use client';

import { motion } from 'motion/react';
import { Film } from 'lucide-react';
import { SectionComp } from '@/components/general/SectionComp';
import { VideoCard } from '@/components/cards/VideoCard';
import { SectionEmptyState } from '@/components/general/SectionEmptyState';
import { MEDIA_BROWSE_GRID_CLASS } from '@/lib/constants/mediaCardLayout';
import type { RecentVideoUpload } from './RecentVideoUploads';

interface LongFormVideosProps {
  videos: RecentVideoUpload[];
}

export const LongFormVideos = ({ videos }: LongFormVideosProps) => {
  if (videos.length === 0) {
    return (
      <SectionComp
        icon={Film}
        iconColor="primary"
        heading="Long-form Videos"
        subtext="Films, documentaries, and extended content"
        viewAllLink="/videos/long-form"
        contentProps={{ enableAnimation: false }}>
        <SectionEmptyState
          title="No long-form videos"
          description="No long-form videos in this category yet. Check back later."
          icon={Film}
          actionLabel="Browse long-form videos"
          actionHref="/videos/long-form"
        />
      </SectionComp>
    );
  }

  return (
    <SectionComp
      icon={Film}
      iconColor="primary"
      heading="Long-form Videos"
      subtext="Films, documentaries, and extended content"
      viewAllLink="/videos/long-form"
      contentProps={{ enableAnimation: false }}>
      <div className={MEDIA_BROWSE_GRID_CLASS}>
        {videos.map((video, index) => (
          <motion.div
            key={video._id}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.05 }}>
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
