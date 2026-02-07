'use client';

import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { MusicCard } from '@/components/cards/MusicCard';

export interface RecentUpload {
  _id: string;
  title: string;
  artist: string;
  cover: string;
  uploadedAt: string;
  genre: string;
}

interface RecentUploadsProps {
  uploads: RecentUpload[];
}

export const RecentUploads = ({ uploads: recentUploads }: RecentUploadsProps) => {
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
          <Button variant="ghost" className="text-muted-foreground hover:text-primary" asChild>
            <Link href="/music/recent">View All</Link>
          </Button>
        </div>

        {/* Grid */}
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
      </div>
    </section>
  );
};
