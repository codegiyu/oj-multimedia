'use client';

import { motion } from 'motion/react';
import { Verified } from 'lucide-react';
import { AppLink } from '@/components/atoms/AppLink';
import { FixedImage } from '@/components/general/FillImage';

export interface ArtistCardProps {
  _id: string;
  name: string;
  image: string;
  genre?: string;
  followers?: string;
  verified?: boolean;
}

export function ArtistCard({ _id, name, image, genre, followers, verified }: ArtistCardProps) {
  const cardContent = (
    <motion.div
      whileHover={{ y: -4 }}
      className="group p-4 rounded-2xl bg-muted/50 hover:bg-muted transition-colors cursor-pointer text-center">
      <div className="relative w-16 h-16 rounded-full overflow-hidden mx-auto mb-3">
        <FixedImage
          imageContext="public"
          src={image}
          alt={name}
          width={64}
          height={64}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
        />
        {verified && (
          <div className="absolute bottom-0 right-0 w-5 h-5 bg-primary rounded-full flex items-center justify-center ring-2 ring-background">
            <Verified className="w-3 h-3 text-primary-foreground" />
          </div>
        )}
      </div>
      <h4 className="font-semibold text-sm group-hover:text-primary transition-colors truncate px-1">
        {name}
      </h4>
      {genre && <p className="text-xs text-muted-foreground truncate px-1">{genre}</p>}
      {followers && <p className="text-xs mt-1 text-primary font-medium">{followers} followers</p>}
    </motion.div>
  );

  return (
    <AppLink href={`/community/artists/${_id}`} className="block">
      {cardContent}
    </AppLink>
  );
}
