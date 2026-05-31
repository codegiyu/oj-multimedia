'use client';

import { motion } from 'motion/react';
import { VideoCard } from '@/components/cards/VideoCard';
import type { VideoItemWithCreator } from '@/lib/utils/videos';

interface VideoRelatedVideosGridProps {
  videos: VideoItemWithCreator[];
}

export function VideoRelatedVideosGrid({ videos }: VideoRelatedVideosGridProps) {
  if (videos.length === 0) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="mt-12">
      <h2 className="text-2xl font-display font-bold mb-6">Related Videos</h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {videos.map((video, index) => (
          <motion.div
            key={video._id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}>
            <VideoCard
              _id={video._id}
              title={video.title}
              creator={video.creator}
              thumbnail={video.thumbnail}
              views={video.views || '0'}
              duration={video.duration || '0:00'}
              category={video.category || 'Video'}
            />
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
