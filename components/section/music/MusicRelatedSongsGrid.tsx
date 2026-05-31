'use client';

import { motion } from 'motion/react';
import { MusicCard } from '@/components/cards/MusicCard';
import type { MusicItemWithArtist } from '@/lib/utils/music';

interface MusicRelatedSongsGridProps {
  songs: MusicItemWithArtist[];
}

export function MusicRelatedSongsGrid({ songs }: MusicRelatedSongsGridProps) {
  if (songs.length === 0) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="mt-12">
      <h2 className="text-2xl font-display font-bold mb-6">Related Songs</h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {songs.map((song, index) => (
          <motion.div
            key={song._id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}>
            <MusicCard
              _id={song._id}
              title={song.title}
              artist={song.artist}
              cover={song.cover}
              plays={song.plays || '0'}
              genre={song.category || 'Music'}
              slug={song.slug}
              downloadUrl={song.downloadUrl}
              audioUrl={song.audioUrl}
              isMonetizable={song.isMonetizable}
              downloadPrice={song.downloadPrice}
              album={song.album}
              optionsItem={song}
            />
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
