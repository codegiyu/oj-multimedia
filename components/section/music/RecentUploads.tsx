'use client';

import { motion } from 'motion/react';
import { Sparkles } from 'lucide-react';
import { SectionComp } from '@/components/general/SectionComp';
import { MusicCard } from '@/components/cards/MusicCard';
import { EmptyState } from '../news/EmptyState';
import type { MusicAlbumSummary } from '@/lib/constants/endpoints';

export interface RecentUpload {
  _id: string;
  title: string;
  artist: { _id: string; name: string };
  cover: string;
  uploadedAt: string;
  genre: string;
  album?: MusicAlbumSummary;
}

interface RecentUploadsProps {
  uploads: RecentUpload[];
}

export const RecentUploads = ({ uploads: recentUploads }: RecentUploadsProps) => {
  if (recentUploads.length === 0) {
    return (
      <SectionComp
        icon={Sparkles}
        iconColor="secondary"
        heading="Fresh Uploads"
        subtext="Just added by creators"
        viewAllLink="/music"
        contentProps={{ enableAnimation: false }}>
        <EmptyState
          title="No recent uploads"
          description="No recent uploads in this category yet. Check back later for new music."
          icon={<Sparkles className="w-12 h-12 text-muted-foreground" />}
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
      viewAllLink="/music"
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
              album={song.album}
            />
          </motion.div>
        ))}
      </div>
    </SectionComp>
  );
};
