'use client';

import { useEffect } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Calendar, DiscAlbum, ListMusic } from 'lucide-react';
import Link from 'next/link';
import { FillImage } from '@/components/general/FillImage';
import { Button } from '@/components/ui/button';
import { MusicCard } from '@/components/cards/MusicCard';
import { MultilineText } from '@/components/general/MultilineText';
import type { PublicAlbumCard } from '@/lib/utils/publicApiMappers';
import type { PublicAlbumTrackItem } from '@/lib/constants/endpoints';
import { mapPublicAlbumTrackToMusicCardProps } from '@/lib/utils/publicApiMappers';
import { sendContentAnalyticsEvent } from '@/lib/services/contentAnalytics';
import { AlbumManageButton } from './AlbumManageButton';

interface AlbumDetailPageClientProps {
  album: PublicAlbumCard & { description?: string };
  tracks: PublicAlbumTrackItem[];
}

export function AlbumDetailPageClient({ album, tracks }: AlbumDetailPageClientProps) {
  const entityId = album.slug || album._id;

  useEffect(() => {
    sendContentAnalyticsEvent('album', entityId, 'view');
  }, [entityId]);

  const releaseLabel = album.releaseDate
    ? new Date(album.releaseDate).toLocaleDateString(undefined, {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      })
    : null;

  return (
    <article className="min-h-screen">
      <section className="relative h-[360px] md:h-[420px] overflow-hidden">
        <FillImage
          src={album.cover}
          alt={album.title}
          imageContext="public"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-foreground via-foreground/60 to-transparent" />
        <div className="absolute inset-0">
          <div className="container h-full flex flex-col justify-between px-6 pt-28 pb-8 mx-auto text-primary-foreground">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <Link href="/music/albums">
                <Button
                  variant="ghost"
                  size="sm"
                  className="gap-2 bg-background/80 backdrop-blur-sm text-foreground hover:bg-background">
                  <ArrowLeft className="w-4 h-4" />
                  Back to Albums
                </Button>
              </Link>
              <AlbumManageButton
                albumArtistId={album.artist._id}
                album={{ _id: album._id, title: album.title, slug: album.slug }}
                artistName={album.artist.name}
                variant="ghost"
                className="gap-2 bg-background/80 backdrop-blur-sm text-foreground hover:bg-background"
              />
            </div>
            <div className="max-w-3xl">
              <p className="text-sm uppercase tracking-wide opacity-80 mb-2 flex items-center gap-2">
                <DiscAlbum className="w-4 h-4" />
                Album
              </p>
              <h1 className="text-3xl md:text-5xl font-display font-bold mb-2">{album.title}</h1>
              <p className="text-lg opacity-90">{album.artist.name}</p>
              <div className="flex flex-wrap gap-4 mt-4 text-sm opacity-80">
                <span className="inline-flex items-center gap-1">
                  <ListMusic className="w-4 h-4" />
                  {tracks.length} track{tracks.length === 1 ? '' : 's'}
                </span>
                {releaseLabel ? (
                  <span className="inline-flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {releaseLabel}
                  </span>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="container mx-auto px-4 max-w-6xl">
          {album.excerpt || album.description ? (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-10 max-w-3xl">
              {album.excerpt ? (
                <MultilineText
                  text={album.excerpt}
                  className="mb-4"
                  paragraphClassName="text-lg text-muted-foreground"
                />
              ) : null}
              {album.description ? (
                <MultilineText text={album.description} className="text-muted-foreground" />
              ) : null}
            </motion.div>
          ) : null}

          <h2 className="text-xl font-display font-bold mb-6">Tracks</h2>
          {tracks.length === 0 ? (
            <p className="text-muted-foreground rounded-lg border border-border px-4 py-6 bg-muted/20">
              This album has no published tracks yet.
            </p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {tracks.map(track => {
                const card = mapPublicAlbumTrackToMusicCardProps(track, album.artist);
                return (
                  <MusicCard
                    key={track._id}
                    _id={card._id}
                    title={card.title}
                    artist={card.artist}
                    cover={card.cover}
                    plays={card.plays}
                    genre={card.genre}
                    slug={card.slug}
                  />
                );
              })}
            </div>
          )}
        </div>
      </section>
    </article>
  );
}
