'use client';

import { useEffect, useCallback } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Clock, Eye, Calendar, Share2, Bookmark, Music, DiscAlbum } from 'lucide-react';
import Link from 'next/link';
import { FillImage } from '@/components/general/FillImage';
import { Button } from '@/components/ui/button';
import type { MusicItemWithArtist } from '@/lib/utils/music';
import { AudioPlayerDynamic } from './AudioPlayerDynamic';
import { DownloadButton } from './DownloadButton';
import { sendContentAnalyticsEvent } from '@/lib/services/contentAnalytics';
import { MultilineText } from '@/components/general/MultilineText';
import { cn } from '@/lib/utils';
import { useFavoriteToggle } from '@/lib/hooks/useFavoriteToggle';
import { LoginModal } from '@/components/auth/LoginModal';
import { shareContent } from '@/lib/utils/shareContent';
import { publicMusicAlbumHref } from '@/lib/utils/publicMusicAlbum';
import { parseMediaDurationSeconds } from '@/lib/utils/formatMediaDuration';
import type { ReactNode } from 'react';

interface MusicDetailPageClientProps {
  musicItem: MusicItemWithArtist;
  relatedSlot?: ReactNode;
}

export const MusicDetailPageClient = ({ musicItem, relatedSlot }: MusicDetailPageClientProps) => {
  const artistName =
    typeof musicItem.artist === 'string' ? musicItem.artist : musicItem.artist.name;

  const entityId = musicItem.slug || musicItem._id;

  useEffect(() => {
    sendContentAnalyticsEvent('music', entityId, 'view');
  }, [entityId]);

  const onAudioFirstPlay = useCallback(() => {
    sendContentAnalyticsEvent('music', entityId, 'play');
  }, [entityId]);

  const { isFavorite, toggle, isLoginModalOpen, setIsLoginModalOpen } = useFavoriteToggle(
    'music',
    musicItem._id
  );

  const handleShare = () => {
    void shareContent({
      title: musicItem.title,
      text: `${musicItem.title} by ${artistName}`,
      url: typeof window !== 'undefined' ? window.location.href : `/music/${musicItem._id}`,
    });
  };

  return (
    <article className="min-h-screen">
      {/* Hero Section with Cover Image */}
      <section className="relative h-[400px] md:h-[500px] lg:h-[600px] overflow-hidden">
        <FillImage
          src={musicItem.cover}
          alt={musicItem.title}
          imageContext="public"
          priority
          sizes="100vw"
        />
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
                  type="button"
                  aria-pressed={isFavorite}
                  onClick={() => void toggle()}
                  className="gap-2 bg-background/80 backdrop-blur-sm text-foreground hover:bg-background">
                  <Bookmark className={cn('w-4 h-4', isFavorite && 'fill-current text-primary')} />
                  {isFavorite ? 'Saved' : 'Save'}
                </Button>
              </div>
            </div>

            <div className="max-w-4xl">
              <nav
                aria-label="Breadcrumb"
                className="flex flex-wrap items-center gap-2 text-sm text-primary-foreground/80 mb-3">
                <Link
                  href="/music"
                  className="hover:text-primary-foreground underline-offset-4 hover:underline">
                  Music
                </Link>
                {musicItem.album ? (
                  <>
                    <span aria-hidden>/</span>
                    <Link
                      href={publicMusicAlbumHref(musicItem.album)}
                      className="inline-flex items-center gap-1 hover:text-primary-foreground underline-offset-4 hover:underline">
                      <DiscAlbum className="w-3.5 h-3.5 shrink-0" aria-hidden />
                      {musicItem.album.title}
                    </Link>
                  </>
                ) : null}
              </nav>
              <span className="inline-flex w-fit px-3 py-1 rounded-full bg-primary text-primary-foreground text-xs font-medium mb-4">
                {musicItem.category}
              </span>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold mb-2">
                {musicItem.title}
              </h1>
              <p className="text-xl md:text-2xl text-primary-foreground/90 mb-2">{artistName}</p>
              {musicItem.album ? (
                <Link
                  href={publicMusicAlbumHref(musicItem.album)}
                  className="inline-flex items-center gap-1.5 text-sm text-primary-foreground/85 hover:text-primary-foreground mb-4 underline-offset-4 hover:underline">
                  <DiscAlbum className="w-4 h-4 shrink-0" aria-hidden />
                  From album: {musicItem.album.title}
                </Link>
              ) : (
                <div className="mb-4" />
              )}
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
              <AudioPlayerDynamic
                audioUrl={musicItem.audioUrl}
                durationSeconds={
                  (musicItem as { durationSeconds?: number }).durationSeconds ??
                  parseMediaDurationSeconds(musicItem.duration)
                }
                title={musicItem.title}
                artist={
                  typeof musicItem.artist === 'string' ? musicItem.artist : musicItem.artist.name
                }
                onFirstPlay={onAudioFirstPlay}
              />
            </motion.div>
          )}

          {(musicItem.audioUrl ||
            musicItem.downloadUrl ||
            (musicItem.isMonetizable && (musicItem.price ?? musicItem.downloadPrice))) && (
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
              <MultilineText
                text={musicItem.description}
                paragraphClassName="text-base text-foreground leading-relaxed"
              />
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
                <MultilineText
                  text={musicItem.lyrics}
                  paragraphClassName="text-base text-foreground leading-relaxed"
                />
              </div>
            </motion.div>
          )}

          {relatedSlot}
        </div>
      </section>
      <LoginModal
        open={isLoginModalOpen}
        onOpenChange={setIsLoginModalOpen}
        title="Sign in to save favorites"
        description="Create an account or sign in to save music and videos to your favorites."
      />
    </article>
  );
};
