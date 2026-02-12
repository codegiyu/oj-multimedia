'use client';

import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { SectionComp } from '@/components/general/SectionComp';
import { VideoCard } from '@/components/cards/VideoCard';

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
  return (
    <SectionComp
      icon={Sparkles}
      iconColor="secondary"
      heading="Fresh Uploads"
      subtext="Just added by creators"
      viewAllLink="/videos/recent"
      contentProps={{ enableAnimation: false }}>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
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
