'use client';

import { AppLink } from '@/components/atoms/AppLink';
import { resolveArtistDisplay, type ArtistRef } from '@/lib/utils/artistDisplay';

interface ArtistNameLineProps {
  artist: ArtistRef;
  className?: string;
}

export function ArtistNameLine({
  artist,
  className = 'text-sm text-muted-foreground truncate',
}: ArtistNameLineProps) {
  const { name, href } = resolveArtistDisplay(artist);

  if (href) {
    return (
      <AppLink
        href={href}
        className={`${className} hover:text-primary transition-colors`}
        onClick={e => e.stopPropagation()}>
        {name}
      </AppLink>
    );
  }

  return <p className={className}>{name}</p>;
}
