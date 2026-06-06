'use client';

import { DiscAlbum, Music, Video } from 'lucide-react';
import { MusicCard } from '@/components/cards/MusicCard';
import { AlbumCard } from '@/components/cards/AlbumCard';
import { VideoCard } from '@/components/cards/VideoCard';
import type { PublicAlbumCard } from '@/lib/utils/publicApiMappers';
import type { MusicItemWithArtist } from '@/lib/utils/music';
import type { VideoItemWithCreator } from '@/lib/utils/videos';
import { getVideoCategoryLabel } from '@/lib/constants/contentTaxonomy';
import { MEDIA_BROWSE_GRID_CLASS } from '@/lib/constants/mediaCardLayout';

export function ArtistAlbumsGrid({ items }: { items: PublicAlbumCard[] }) {
  if (items.length === 0) {
    return null;
  }

  return (
    <div>
      <h2 className="text-xl font-display font-bold mb-6 flex items-center gap-2">
        <DiscAlbum className="w-5 h-5 text-primary" />
        Albums
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {items.map(item => (
          <AlbumCard key={item._id} {...item} />
        ))}
      </div>
    </div>
  );
}

export function ArtistMusicGrid({ items }: { items: MusicItemWithArtist[] }) {
  if (items.length === 0) {
    return null;
  }

  return (
    <div>
      <h2 className="text-xl font-display font-bold mb-6 flex items-center gap-2">
        <Music className="w-5 h-5 text-primary" />
        Music
      </h2>
      <div className={MEDIA_BROWSE_GRID_CLASS}>
        {items.map(item => (
          <MusicCard
            key={item._id}
            _id={item._id}
            title={item.title}
            artist={item.artist}
            cover={item.cover}
            plays={item.plays ?? '0'}
            genre={item.genre ?? item.category ?? ''}
            isNew={item.isNew}
            album={item.album}
          />
        ))}
      </div>
    </div>
  );
}

export function ArtistVideosGrid({ items }: { items: VideoItemWithCreator[] }) {
  if (items.length === 0) {
    return null;
  }

  return (
    <div>
      <h2 className="text-xl font-display font-bold mb-6 flex items-center gap-2">
        <Video className="w-5 h-5 text-primary" />
        Videos
      </h2>
      <div className={MEDIA_BROWSE_GRID_CLASS}>
        {items.map(item => (
          <VideoCard
            key={item._id}
            _id={item._id}
            title={item.title}
            creator={item.creator}
            thumbnail={item.thumbnail}
            views={item.views ?? '0'}
            duration={item.duration ?? ''}
            category={getVideoCategoryLabel(item.category)}
          />
        ))}
      </div>
    </div>
  );
}
