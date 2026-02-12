'use client';

import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { SectionComp } from '@/components/general/SectionComp';
import { MusicCard } from '@/components/cards/MusicCard';

export interface RecentUpload {
  _id: string;
  title: string;
  artist: { _id: string; name: string };
  cover: string;
  uploadedAt: string;
  genre: string;
}

interface RecentUploadsProps {
  uploads: RecentUpload[];
}

export const RecentUploads = ({ uploads: recentUploads }: RecentUploadsProps) => {
  return (
    <SectionComp
      icon={Sparkles}
      iconColor="secondary"
      heading="Fresh Uploads"
      subtext="Just added by creators"
      viewAllLink="/music/recent"
      contentProps={{ enableAnimation: false }}>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {recentUploads.map((song, index) => (
          <motion.div
            key={song._id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.05 }}>
            <MusicCard
              _id={song._id}
              title={song.title}
              artist={song.artist}
              cover={song.cover}
              plays="0"
              genre={song.genre}
            />
          </motion.div>
        ))}
      </div>
    </SectionComp>
  );
};
