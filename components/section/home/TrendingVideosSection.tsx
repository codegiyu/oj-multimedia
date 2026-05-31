'use client';

import { useRef } from 'react';
import { Video, Upload } from 'lucide-react';
import { useQueryState, parseAsString } from 'nuqs';
import { Button } from '@/components/ui/button';
import { VideoCard } from '@/components/cards/VideoCard';
import { SectionComp } from '@/components/general/SectionComp';
import { SectionEmptyState } from '@/components/general/SectionEmptyState';
import { motion } from 'motion/react';
import { ALL_CATEGORY_ID } from '@/lib/constants/contentTaxonomy';
import { PUBLIC_URL_KEYS } from '@/lib/constants/publicUrlKeys';
import type { CategoryNavItem } from '@/lib/utils/contentCategoryNav';
import { useHomeTrendingVideoRail } from '@/lib/hooks/useHomeTrendingRail';
import { useContentSubmitWhatsApp } from '@/components/section/shared/ContentSubmitWhatsAppTrigger';
import { cn } from '@/lib/utils';
import {
  VIDEO_DEFAULT_RAIL_ITEM_CLASS,
  VIDEO_RAIL_SCROLL_PX,
} from '@/lib/constants/mediaCardLayout';

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
  videos: initialVideos,
  categoryOptions,
}: TrendingVideosSectionProps) => {
  const videoSubmit = useContentSubmitWhatsApp('video');
  const [, setVideoCategory] = useQueryState(
    PUBLIC_URL_KEYS.VIDEO_CATEGORY,
    parseAsString.withDefault(ALL_CATEGORY_ID).withOptions({ shallow: true, history: 'replace' })
  );
  const {
    items: trendingVideos,
    isLoading,
    loadCategory,
  } = useHomeTrendingVideoRail(initialVideos);
  const scrollRef = useRef<HTMLDivElement>(null);

  const tabs = categoryOptions.map(opt => ({ id: opt.id, label: opt.label }));

  const handleTabChange = async (tabId: string) => {
    await setVideoCategory(tabId === ALL_CATEGORY_ID ? null : tabId);
    loadCategory(tabId);
  };

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = VIDEO_RAIL_SCROLL_PX;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  return (
    <>
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
          <Button
            type="button"
            variant="accent"
            size="sm"
            className="gap-2"
            onClick={videoSubmit.openSubmitModal}>
            <Upload className="w-4 h-4" />
            Upload Your Video
          </Button>
        }
        contentProps={{
          className: '',
          enableAnimation: false,
        }}>
        {trendingVideos.length === 0 && !isLoading ? (
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
            className={cn(
              'flex gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory transition-opacity',
              isLoading && 'opacity-60 pointer-events-none'
            )}>
            {trendingVideos.map((video, index) => (
              <motion.div
                key={video._id || index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className={VIDEO_DEFAULT_RAIL_ITEM_CLASS}>
                <VideoCard {...video} />
              </motion.div>
            ))}
          </div>
        )}
      </SectionComp>
      {videoSubmit.modal}
    </>
  );
};
