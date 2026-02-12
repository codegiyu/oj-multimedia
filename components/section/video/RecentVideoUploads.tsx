'use client';

import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
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
    <section className="py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-secondary/20 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-secondary-foreground" />
            </div>
            <div>
              <h2 className="text-2xl font-display font-bold">Fresh Uploads</h2>
              <p className="text-sm text-muted-foreground">Just added by creators</p>
            </div>
          </div>
          <Button variant="ghost" className="text-muted-foreground hover:text-primary">
            View All
          </Button>
        </div>

        {/* Grid */}
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
      </div>
    </section>
  );
};
