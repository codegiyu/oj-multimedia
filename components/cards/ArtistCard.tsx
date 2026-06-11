'use client';

import { motion } from 'motion/react';
import { Verified } from 'lucide-react';
import { AppLink } from '@/components/atoms/AppLink';
import { FixedImage } from '@/components/general/FillImage';
import {
  ArtistFollowButton,
  type ArtistFollowState,
} from '@/components/section/community/artists/ArtistFollowButton';

export interface ArtistCardProps {
  _id: string;
  name: string;
  image: string;
  genre?: string;
  followers?: string;
  verified?: boolean;
  showFollowButton?: boolean;
  isFollowing?: boolean;
  followerCount?: number;
  onFollowChange?: (state: ArtistFollowState) => void;
}

export function ArtistCard({
  _id,
  name,
  image,
  genre,
  followers,
  verified,
  showFollowButton = false,
  isFollowing,
  followerCount,
  onFollowChange,
}: ArtistCardProps) {
  const resolvedFollowerCount =
    followerCount ?? (followers != null && followers !== '' ? Number(followers) || 0 : 0);

  const cardContent = (
    <motion.div
      whileHover={{ y: -4 }}
      className="group p-4 rounded-2xl bg-muted/50 hover:bg-muted transition-colors cursor-pointer text-center">
      <div className="relative w-16 h-16 mx-auto mb-3">
        <div
          className="h-full w-full rounded-full overflow-hidden"
          data-testid="artist-card-avatar-clip">
          <FixedImage
            imageContext="public"
            src={image}
            alt={name}
            width={64}
            height={64}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
          />
        </div>
        {verified && (
          <div
            className="absolute -bottom-0.5 -right-0.5 z-10 w-5 h-5 bg-primary rounded-full flex items-center justify-center ring-2 ring-background"
            data-testid="artist-card-verified-badge">
            <Verified className="w-3 h-3 text-primary-foreground" />
          </div>
        )}
      </div>
      <h4 className="font-semibold text-sm group-hover:text-primary transition-colors truncate px-1">
        {name}
      </h4>
      {genre && <p className="text-xs text-muted-foreground truncate px-1">{genre}</p>}
      {followers && <p className="text-xs mt-1 text-primary font-medium">{followers} followers</p>}
      {showFollowButton && (
        <div className="mt-3 flex justify-center" onClick={event => event.stopPropagation()}>
          <ArtistFollowButton
            artistId={_id}
            initialIsFollowing={isFollowing}
            initialFollowerCount={resolvedFollowerCount}
            onFollowChange={onFollowChange}
            variant="compact"
          />
        </div>
      )}
    </motion.div>
  );

  return (
    <AppLink href={`/community/artists/${_id}`} className="block">
      {cardContent}
    </AppLink>
  );
}
