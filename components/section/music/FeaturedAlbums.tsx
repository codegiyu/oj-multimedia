'use client';

import { useRef } from 'react';
import { DiscAlbum } from 'lucide-react';
import { SectionComp } from '@/components/general/SectionComp';
import { AlbumCard } from '@/components/cards/AlbumCard';
import { SectionEmptyState } from '@/components/general/SectionEmptyState';
import type { PublicAlbumCard } from '@/lib/utils/publicApiMappers';

interface FeaturedAlbumsProps {
  albums: PublicAlbumCard[];
}

export function FeaturedAlbums({ albums }: FeaturedAlbumsProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollBy({
      left: direction === 'left' ? -320 : 320,
      behavior: 'smooth',
    });
  };

  if (albums.length === 0) {
    return (
      <SectionComp
        icon={DiscAlbum}
        iconColor="secondary"
        heading="Featured Albums"
        subtext="Full releases from your favorite artists"
        viewAllLink="/music/albums"
        contentProps={{ enableAnimation: false }}>
        <SectionEmptyState
          title="No albums yet"
          description="Published albums will appear here."
          icon={DiscAlbum}
          actionLabel="Browse albums"
          actionHref="/music/albums"
        />
      </SectionComp>
    );
  }

  return (
    <SectionComp
      icon={DiscAlbum}
      iconColor="secondary"
      heading="Featured Albums"
      subtext="Full releases from your favorite artists"
      viewAllLink="/music/albums"
      showPrevNext={true}
      onPrev={() => scroll('left')}
      onNext={() => scroll('right')}
      contentProps={{ enableAnimation: false }}>
      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory">
        {albums.map(album => (
          <div key={album._id} className="min-w-[260px] max-w-[260px] snap-start shrink-0">
            <AlbumCard {...album} />
          </div>
        ))}
      </div>
    </SectionComp>
  );
}
