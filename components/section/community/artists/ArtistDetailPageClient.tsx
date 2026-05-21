'use client';

import { motion } from 'motion/react';
import { ArrowLeft, Music, Video, Users, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { MusicCard } from '@/components/cards/MusicCard';
import { VideoCard } from '@/components/cards/VideoCard';
import type { ArtistProfile } from '@/lib/types/artist';
import type { MusicItemWithArtist } from '@/lib/utils/music';
import type { VideoItemWithCreator } from '@/lib/utils/videos';

interface ArtistDetailPageClientProps {
  artist: ArtistProfile;
  musicItems: MusicItemWithArtist[];
  videoItems: VideoItemWithCreator[];
}

// const socialIcons: Record<string, React.ComponentType<{ className?: string }>> = {};
// Optional: add Lucide icons for facebook, instagram, etc. if needed

export function ArtistDetailPageClient({
  artist,
  musicItems,
  videoItems,
}: ArtistDetailPageClientProps) {
  const hasSocials =
    artist.socials &&
    Object.values(artist.socials).some(v => typeof v === 'string' && v.length > 0);

  return (
    <article className="min-h-screen">
      <section className="bg-gradient-to-br from-primary/10 via-background to-accent/10 py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <Link href="/community/artists">
              <Button variant="ghost" size="sm" className="gap-2 mb-6">
                <ArrowLeft className="w-4 h-4" />
                Back to Artists
              </Button>
            </Link>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col md:flex-row gap-8 items-start">
              <div className="shrink-0">
                <div className="relative w-40 h-40 md:w-48 md:h-48 rounded-2xl overflow-hidden ring-4 ring-background shadow-lg">
                  <Image
                    src={artist.image}
                    alt={artist.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 160px, 192px"
                  />
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <h1 className="text-3xl md:text-4xl font-display font-bold mb-2">{artist.name}</h1>
                {artist.genre && <p className="text-primary font-medium mb-4">{artist.genre}</p>}
                <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-4">
                  {artist.followers && (
                    <span className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      {artist.followers} followers
                    </span>
                  )}
                  {artist.songs != null && (
                    <span className="flex items-center gap-1">
                      <Music className="w-4 h-4" />
                      {artist.songs} songs
                    </span>
                  )}
                  {artist.videos != null && (
                    <span className="flex items-center gap-1">
                      <Video className="w-4 h-4" />
                      {artist.videos} videos
                    </span>
                  )}
                </div>
                {artist.bio && (
                  <p className="text-muted-foreground mb-6 leading-relaxed">{artist.bio}</p>
                )}
                {hasSocials && artist.socials && (
                  <div className="flex flex-wrap gap-2">
                    {Object.entries(artist.socials).map(
                      ([key, url]) =>
                        url && (
                          <a
                            key={key}
                            href={url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-sm text-primary hover:underline">
                            {key}
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        )
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {(musicItems.length > 0 || videoItems.length > 0) && (
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto space-y-12">
              {musicItems.length > 0 && (
                <div>
                  <h2 className="text-xl font-display font-bold mb-6 flex items-center gap-2">
                    <Music className="w-5 h-5 text-primary" />
                    Music
                  </h2>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {musicItems.map(item => (
                      <MusicCard
                        key={item._id}
                        _id={item._id}
                        title={item.title}
                        artist={item.artist}
                        cover={item.cover}
                        plays={item.plays ?? '0'}
                        genre={item.genre ?? item.category ?? ''}
                        isNew={item.isNew}
                      />
                    ))}
                  </div>
                </div>
              )}

              {videoItems.length > 0 && (
                <div>
                  <h2 className="text-xl font-display font-bold mb-6 flex items-center gap-2">
                    <Video className="w-5 h-5 text-primary" />
                    Videos
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {videoItems.map(item => (
                      <VideoCard
                        key={item._id}
                        _id={item._id}
                        title={item.title}
                        creator={item.creator}
                        thumbnail={item.thumbnail}
                        views={item.views ?? '0'}
                        duration={item.duration ?? ''}
                        category={
                          item.category === 'music'
                            ? 'Music Videos'
                            : item.category === 'short'
                              ? 'Short Clips'
                              : item.category === 'talks'
                                ? 'Talks & Speeches'
                                : item.category === 'creative'
                                  ? 'Creative Content'
                                  : item.category === 'inspirational'
                                    ? 'Inspirational'
                                    : item.category === 'live'
                                      ? 'Live Performances'
                                      : item.category === 'sermon'
                                        ? 'Sermons'
                                        : 'Podcasts / Video Talks'
                        }
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      )}
    </article>
  );
}
