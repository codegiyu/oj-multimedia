'use client';

import { useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Flame } from 'lucide-react';
import { useQueryState, parseAsString } from 'nuqs';
import { MusicCard } from '@/components/cards/MusicCard';
import { SectionComp } from '@/components/general/SectionComp';
import { SectionEmptyState } from '@/components/general/SectionEmptyState';
import { motion } from 'motion/react';
import { ALL_CATEGORY_ID } from '@/lib/constants/contentTaxonomy';
import { PUBLIC_URL_KEYS } from '@/lib/constants/publicUrlKeys';
import type { CategoryNavItem } from '@/lib/utils/contentCategoryNav';

export interface TrendingMusicItem {
  _id: string;
  title: string;
  artist: { _id: string; name: string };
  cover: string;
  plays: string;
  genre: string;
  isNew: boolean;
}

interface TrendingMusicSectionProps {
  music: TrendingMusicItem[];
  categoryOptions: CategoryNavItem[];
}

export const TrendingMusicSection = ({
  music: trendingMusic,
  categoryOptions,
}: TrendingMusicSectionProps) => {
  const router = useRouter();
  const [, setMusicCategory] = useQueryState(
    PUBLIC_URL_KEYS.MUSIC_CATEGORY,
    parseAsString.withDefault(ALL_CATEGORY_ID)
  );
  const scrollRef = useRef<HTMLDivElement>(null);

  const tabs = categoryOptions.map(opt => ({ id: opt.id, label: opt.label }));

  const handleTabChange = async (tabId: string) => {
    await setMusicCategory(tabId === ALL_CATEGORY_ID ? null : tabId);
    router.refresh();
  };

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 280;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  return (
    <SectionComp
      id="music"
      icon={Flame}
      iconColor="primary"
      heading="Trending Music"
      subtext="Discover what's hot right now"
      viewAllLink="/music/trending"
      tabs={tabs}
      tabsQueryKey={PUBLIC_URL_KEYS.MUSIC_CATEGORY}
      defaultTab={ALL_CATEGORY_ID}
      onTabChange={handleTabChange}
      showPrevNext={true}
      onPrev={() => scroll('left')}
      onNext={() => scroll('right')}
      contentProps={{
        className: '',
        enableAnimation: false,
      }}>
      {trendingMusic.length === 0 ? (
        <SectionEmptyState
          title="No trending music in this genre"
          description="Try a different genre or check back soon for new releases."
          icon={Flame}
          actionLabel="View all music"
          actionHref="/music/trending"
        />
      ) : (
        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory">
          {trendingMusic.map((track, index) => (
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
};
