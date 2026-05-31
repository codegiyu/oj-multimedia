'use client';

import { motion } from 'motion/react';
import { Disc3 } from 'lucide-react';
import { MusicCard } from '@/components/cards/MusicCard';
import { SectionComp } from '@/components/general/SectionComp';
import { SectionEmptyState } from '@/components/general/SectionEmptyState';
import type { TrendingMusicItem } from './TrendingMusicSection';
import { MUSIC_RAIL_ITEM_CLASS } from '@/lib/constants/mediaCardLayout';

interface SimpleMusicRailProps {
  heading: string;
  subtext?: string;
  viewAllLink: string;
  music: TrendingMusicItem[];
}

export function SimpleMusicRail({ heading, subtext, viewAllLink, music }: SimpleMusicRailProps) {
  return (
    <SectionComp
      icon={Disc3}
      iconColor="primary"
      heading={heading}
      subtext={subtext ?? ''}
      viewAllLink={viewAllLink}
      showPrevNext={false}
      contentProps={{ className: '', enableAnimation: false }}>
      {music.length === 0 ? (
        <SectionEmptyState
          title="Nothing here yet"
          description="Check back soon for new releases."
          icon={Disc3}
          actionLabel="View all music"
          actionHref="/music"
        />
      ) : (
        <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory">
          {music.map((track, index) => (
            <motion.div
              key={track._id || index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              className={MUSIC_RAIL_ITEM_CLASS}>
              <MusicCard {...track} />
            </motion.div>
          ))}
        </div>
      )}
    </SectionComp>
  );
}
