'use client';

import { useState } from 'react';
import { Music, Video, Users, ExternalLink } from 'lucide-react';
import { FillImage } from '@/components/general/FillImage';
import type { ArtistProfile } from '@/lib/types/artist';
import { MultilineText } from '@/components/general/MultilineText';
import { CommunityContentDetailHero } from '../shared/CommunityContentDetailHero';
import { ArtistFollowButton, type ArtistFollowState } from './ArtistFollowButton';
import type { ReactNode } from 'react';

interface ArtistDetailPageClientProps {
  artist: ArtistProfile;
  musicSlot?: ReactNode;
  videosSlot?: ReactNode;
  albumsSlot?: ReactNode;
}

export function ArtistDetailPageClient({
  artist,
  musicSlot,
  videosSlot,
  albumsSlot,
}: ArtistDetailPageClientProps) {
  const initialFollowerCount =
    artist.followerCount ??
    (artist.followers != null && artist.followers !== '' ? Number(artist.followers) || 0 : 0);

  const [followState, setFollowState] = useState<ArtistFollowState>({
    isFollowing: artist.isFollowing ?? false,
    followerCount: initialFollowerCount,
  });

  const hasSocials =
    artist.socials &&
    Object.values(artist.socials).some(v => typeof v === 'string' && v.length > 0);

  return (
    <article className="min-h-screen">
      <CommunityContentDetailHero
        backHref="/community/artists"
        backLabel="Back to Artists"
        title=""
        customContent>
        <div className="flex flex-col md:flex-row gap-8 items-start">
          <div className="shrink-0">
            <div className="relative w-40 h-40 md:w-48 md:h-48 rounded-2xl overflow-hidden ring-4 ring-background shadow-lg">
              <FillImage
                src={artist.image}
                alt={artist.name}
                imageContext="public"
                sizes="(max-width: 768px) 160px, 192px"
              />
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-start justify-between gap-4 mb-2">
              <h1 className="text-3xl md:text-4xl font-display font-bold">{artist.name}</h1>
              <ArtistFollowButton
                artistId={artist._id}
                initialIsFollowing={artist.isFollowing ?? false}
                initialFollowerCount={initialFollowerCount}
                onFollowChange={setFollowState}
                variant="prominent"
              />
            </div>
            {artist.genre && <p className="text-primary font-medium mb-4">{artist.genre}</p>}
            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-4">
              <span className="flex items-center gap-1">
                <Users className="w-4 h-4" />
                {followState.followerCount.toLocaleString()} followers
              </span>
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
              <MultilineText
                text={artist.bio}
                className="mb-6"
                paragraphClassName="text-muted-foreground leading-relaxed"
              />
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
        </div>
      </CommunityContentDetailHero>

      {(albumsSlot || musicSlot || videosSlot) && (
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto space-y-12">
              {albumsSlot}
              {musicSlot}
              {videosSlot}
            </div>
          </div>
        </section>
      )}
    </article>
  );
}
