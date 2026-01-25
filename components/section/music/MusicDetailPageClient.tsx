'use client';

import { motion } from 'framer-motion';
import { ArrowLeft, Clock, Eye, Calendar, Share2, Bookmark, Music } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import type { MusicItem } from '@/lib/constants/music';
import { AudioPlayer } from './AudioPlayer';
import { DownloadButton } from './DownloadButton';

interface MusicDetailPageClientProps {
  musicItem: MusicItem;
  relatedSongs: MusicItem[];
}

export const MusicDetailPageClient = ({ musicItem, relatedSongs }: MusicDetailPageClientProps) => {
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: musicItem.title,
        text: `${musicItem.title} by ${musicItem.artist}`,
        url: window.location.href,
      });
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
    }
  };

  return (
    <article className="min-h-screen">
      {/* Hero Section with Cover Image */}
      <section className="relative h-[400px] md:h-[500px] lg:h-[600px] overflow-hidden">
        <Image src={musicItem.cover} alt={musicItem.title} fill className="object-cover" priority />
        <div className="absolute inset-0 bg-gradient-to-t from-foreground via-foreground/60 to-transparent" />

        {/* Content Overlay */}
        <div className="absolute inset-0">
          <div className="container h-full flex flex-col justify-between px-6 pt-28 pb-6 md:pb-8 lg:pb-12 text-primary-foreground mx-auto relative">
            <div className="w-full h-10 relative">
              {/* Back Button */}
              <div className="absolute top-0 left-0 z-10">
                <Link href="/music">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="gap-2 bg-background/80 backdrop-blur-sm text-foreground hover:bg-background">
                    <ArrowLeft className="w-4 h-4" />
                    Back to Music
                  </Button>
                </Link>
              </div>

              {/* Action Buttons */}
              <div className="absolute top-0 right-0 z-10 flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleShare}
                  className="gap-2 bg-background/80 backdrop-blur-sm text-foreground hover:bg-background">
                  <Share2 className="w-4 h-4" />
                  Share
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="gap-2 bg-background/80 backdrop-blur-sm text-foreground hover:bg-background">
                  <Bookmark className="w-4 h-4" />
                  Save
                </Button>
              </div>
            </div>

            <div className="max-w-4xl">
              <span className="inline-flex w-fit px-3 py-1 rounded-full bg-primary text-primary-foreground text-xs font-medium mb-4">
                {musicItem.category}
              </span>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold mb-2">
                {musicItem.title}
              </h1>
              <p className="text-xl md:text-2xl text-primary-foreground/90 mb-4">
                {musicItem.artist}
              </p>
              <div className="flex items-center gap-4 text-sm text-primary-foreground/80 flex-wrap">
                {musicItem.plays && (
                  <span className="flex items-center gap-1">
                    <Eye className="w-4 h-4" />
                    {musicItem.plays}
                  </span>
                )}
                {musicItem.duration && (
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {musicItem.duration}
                  </span>
                )}
                {musicItem.releaseDate && (
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {new Date(musicItem.releaseDate).toLocaleDateString('en-US', {
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Audio Player */}
          {musicItem.audioUrl && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-8">
              <AudioPlayer
                audioUrl={musicItem.audioUrl}
                title={musicItem.title}
                artist={musicItem.artist}
              />
            </motion.div>
          )}

          {/* Download Button */}
          {musicItem.downloadUrl && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="mb-8">
              <DownloadButton musicItem={musicItem} />
            </motion.div>
          )}

          {/* Description */}
          {musicItem.description && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mb-8">
              <h2 className="text-2xl font-display font-bold mb-4">About</h2>
              <p className="text-base text-foreground leading-relaxed whitespace-pre-line">
                {musicItem.description}
              </p>
            </motion.div>
          )}

          {/* Lyrics */}
          {musicItem.lyrics && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="mb-8">
              <div className="flex items-center gap-2 mb-4">
                <Music className="w-5 h-5 text-primary" />
                <h2 className="text-2xl font-display font-bold">Lyrics</h2>
              </div>
              <div className="bg-muted/50 rounded-xl p-6">
                <p className="text-base text-foreground leading-relaxed whitespace-pre-line">
                  {musicItem.lyrics}
                </p>
              </div>
            </motion.div>
          )}

          {/* Related Songs */}
          {relatedSongs.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="mt-12">
              <h2 className="text-2xl font-display font-bold mb-6">Related Songs</h2>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {relatedSongs.map((song, index) => (
                  <motion.div
                    key={song.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ y: -4 }}
                    className="group">
                    <Link
                      href={`/music/${song.id}`}
                      className="block bg-card rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all border border-border/50 hover:border-primary/20">
                      <div className="relative aspect-square overflow-hidden">
                        <Image
                          src={song.cover}
                          alt={song.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-foreground/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
                            <Music className="w-6 h-6 fill-current ml-1" />
                          </div>
                        </div>
                      </div>
                      <div className="p-4">
                        <h3 className="font-semibold truncate group-hover:text-primary transition-colors">
                          {song.title}
                        </h3>
                        <p className="text-sm text-muted-foreground truncate">{song.artist}</p>
                        {song.plays && (
                          <p className="text-xs text-muted-foreground mt-1">{song.plays} plays</p>
                        )}
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </section>
    </article>
  );
};
