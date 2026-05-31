'use client';

import { motion } from 'motion/react';
import { Sparkles } from 'lucide-react';
import { SectionComp } from '@/components/general/SectionComp';
import { VideoCard } from '@/components/cards/VideoCard';
import { SectionEmptyState } from '@/components/general/SectionEmptyState';
import { MEDIA_BROWSE_GRID_CLASS } from '@/lib/constants/mediaCardLayout';

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
      contentProps={{ enableAnimation: false }}>
      <div className={MEDIA_BROWSE_GRID_CLASS}>
        {recentUploads.map((video, index) => (
          <motion.div
            key={video._id}
            initial={{ opacity: 0, y: 20 }}
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
              variant="recent"
              uploadedAt={video.uploadedAt}
            />
          </motion.div>
        ))}
      </div>
    </SectionComp>
  );
};
