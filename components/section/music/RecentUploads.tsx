'use client';

import { motion } from 'framer-motion';
import { Play, Clock, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { MusicCardOptions } from './MusicCardOptions';
import { MUSIC_ITEMS } from '@/lib/constants/music';

export interface RecentUpload {
  id: number;
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
          {recentUploads.map((song, index) => {
            const musicItem = MUSIC_ITEMS.find(item => item.id === song.id);
            return (
              <motion.div
                key={song.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ y: -4 }}
                className="group">
                <Link
                  href={`/music/${song.id}`}
                  className="flex gap-4 p-4 bg-card rounded-2xl hover:shadow-md transition-all cursor-pointer">
                  {/* Cover */}
                  <div className="relative w-20 h-20 rounded-xl overflow-hidden shrink-0">
                    <img
                      src={song.cover}
                      alt={song.title}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-foreground/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <Play className="w-6 h-6 text-background fill-current" />
                    </div>
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <h3 className="font-semibold truncate group-hover:text-primary transition-colors">
                        {song.title}
                      </h3>
                      <p className="text-sm text-muted-foreground truncate">{song.artist}</p>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span className="px-2 py-0.5 bg-muted rounded-full">{song.genre}</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {song.uploadedAt}
                      </span>
                    </div>
                  </div>

                  {/* Options Menu */}
                  <div
                    className="shrink-0 self-center opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={e => e.preventDefault()}>
                    {musicItem && <MusicCardOptions musicItem={musicItem} />}
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
