'use client';

import { motion } from 'motion/react';
import { Film } from 'lucide-react';
import { SectionComp } from '@/components/general/SectionComp';
import { VideoCard } from '@/components/cards/VideoCard';
import { EmptyState } from '../news/EmptyState';
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
        <EmptyState
          title="No long-form videos"
          description="No long-form videos in this category yet. Check back later."
          icon={<Film className="w-12 h-12 text-muted-foreground" />}
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
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
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
