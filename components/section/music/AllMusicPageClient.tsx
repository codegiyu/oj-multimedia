'use client';

import { motion } from 'motion/react';
import { Music } from 'lucide-react';
import { BrowseListPageClient } from '@/components/general/BrowseListPageClient';
import { MusicCategories } from './MusicCategories';
import { MusicCard } from '@/components/cards/MusicCard';
import type { TrendingSong } from './TrendingSongs';
import { MEDIA_BROWSE_GRID_CLASS } from '@/lib/constants/mediaCardLayout';
import type { AllBrowseConfig } from '@/lib/constants/allBrowseConfig';
import type { CategoryNavItem } from '@/lib/utils/contentCategoryNav';
import type { Pagination } from '@/lib/types/pagination';

interface AllMusicPageClientProps {
  config: AllBrowseConfig;
  categoryOptions: CategoryNavItem[];
  songs: (TrendingSong & { category?: string })[];
  pagination?: Pagination | null;
  initialErrorMessage?: string | null;
}

export function AllMusicPageClient({
  config,
  categoryOptions,
  songs,
  pagination = null,
  initialErrorMessage = null,
}: AllMusicPageClientProps) {
  return (
    <BrowseListPageClient
      config={config}
      items={songs}
      pagination={pagination}
      initialErrorMessage={initialErrorMessage}
      errorTitle="Unable to load music"
      errorIcon={<Music className="w-8 h-8 text-destructive" />}
      empty={{
        title: 'No Music Found',
        description:
          'Try adjusting your search, sort, or category filters, or check back later for new uploads.',
        icon: Music,
        showDefaultActions: true,
      }}
      gridClassName={MEDIA_BROWSE_GRID_CLASS}
      afterToolbar={<MusicCategories categoryOptions={categoryOptions} />}
      renderItem={(song, index) => (
        <motion.div
          key={song._id}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: index * 0.05 }}>
          <MusicCard
            _id={song._id}
            title={song.title}
            artist={song.artist}
            cover={song.cover}
            plays={song.plays}
            genre={song.category || 'Music'}
            isNew={song.isNew}
            album={song.album}
          />
        </motion.div>
      )}
    />
  );
}
