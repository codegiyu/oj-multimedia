'use client';

import { motion } from 'motion/react';
import { Disc3 } from 'lucide-react';
import { MusicCard } from '@/components/cards/MusicCard';
import { SectionComp } from '@/components/general/SectionComp';
import { EmptyState } from '@/components/section/news/EmptyState';
import type { TrendingMusicItem } from './TrendingMusicSection';

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
        <EmptyState
          title="Nothing here yet"
          description="Check back soon for new releases."
          icon={<Disc3 className="w-12 h-12 text-muted-foreground" />}
          actionLabel="View all music"
          actionHref="/music"
          showDefaultActions={false}
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
              className="w-[160px] sm:w-[180px] md:w-[200px] lg:w-[220px] xl:w-[240px] 2xl:w-[260px] snap-start shrink-0">
              <MusicCard {...track} />
            </motion.div>
          ))}
        </div>
      )}
    </SectionComp>
  );
}
