'use client';

import { useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Video, Upload } from 'lucide-react';
import { useQueryState, parseAsString } from 'nuqs';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { VideoCard } from '@/components/cards/VideoCard';
import { SectionComp } from '@/components/general/SectionComp';
import { SectionEmptyState } from '@/components/general/SectionEmptyState';
import { motion } from 'motion/react';
import { ALL_CATEGORY_ID } from '@/lib/constants/contentTaxonomy';
import { PUBLIC_URL_KEYS } from '@/lib/constants/publicUrlKeys';
import type { CategoryNavItem } from '@/lib/utils/contentCategoryNav';

export interface TrendingVideoItem {
  _id: string;
  title: string;
  creator: string;
  thumbnail: string;
  views: string;
  duration: string;
  category: string;
}

interface TrendingVideosSectionProps {
  videos: TrendingVideoItem[];
  categoryOptions: CategoryNavItem[];
}

export const TrendingVideosSection = ({
  videos: trendingVideos,
  categoryOptions,
}: TrendingVideosSectionProps) => {
  const router = useRouter();
  const [, setVideoCategory] = useQueryState(
    PUBLIC_URL_KEYS.VIDEO_CATEGORY,
    parseAsString.withDefault(ALL_CATEGORY_ID)
  );
  const scrollRef = useRef<HTMLDivElement>(null);

  const tabs = categoryOptions.map(opt => ({ id: opt.id, label: opt.label }));

  const handleTabChange = async (tabId: string) => {
    await setVideoCategory(tabId === ALL_CATEGORY_ID ? null : tabId);
    router.refresh();
  };

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 340;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  return (
    <SectionComp
      id="videos"
      icon={Video}
      iconColor="secondary"
      heading="Trending Videos"
      subtext="Watch the latest creative content"
      viewAllLink="/videos/trending"
      background="bg-muted/30"
      tabs={tabs}
      tabsQueryKey={PUBLIC_URL_KEYS.VIDEO_CATEGORY}
      defaultTab={ALL_CATEGORY_ID}
      onTabChange={handleTabChange}
      showPrevNext={true}
      onPrev={() => scroll('left')}
      onNext={() => scroll('right')}
      extraButtons={
        <Button variant="accent" size="sm" className="gap-2" asChild>
          <Link href="/community/promote-your-content">
            <Upload className="w-4 h-4" />
            Upload Your Video
          </Link>
        </Button>
      }
      contentProps={{
        className: '',
        enableAnimation: false,
      }}>
      {trendingVideos.length === 0 ? (
        <SectionEmptyState
          title="No trending videos in this category"
          description="Try a different filter or check back later for new content."
          icon={Video}
          actionLabel="View all videos"
          actionHref="/videos/trending"
        />
      ) : (
        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory">
          {trendingVideos.map((video, index) => (
            <motion.div
              key={video._id || index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              className="w-[240px] sm:w-[280px] lg:w-[300px] xl:w-[320px] 2xl:w-[340px] snap-start shrink-0">
              <VideoCard {...video} />
            </motion.div>
          ))}
        </div>
      )}
    </SectionComp>
  );
};
