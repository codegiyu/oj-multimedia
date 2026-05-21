'use client';

import { useMemo, useRef } from 'react';
import { Video, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { VideoCard } from '@/components/cards/VideoCard';
import { SectionComp } from '@/components/general/SectionComp';
import { EmptyState } from '@/components/section/news/EmptyState';
import { useQueryState, parseAsString } from 'nuqs';
import { motion } from 'motion/react';

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
}

const categories = [
  { id: 'All', label: 'All' },
  { id: 'Music Videos', label: 'Music Videos' },
  { id: 'Short Clips', label: 'Short Clips' },
  { id: 'Talks', label: 'Talks' },
  { id: 'Dance', label: 'Dance' },
  { id: 'Creative', label: 'Creative' },
];

export const TrendingVideosSection = ({ videos: trendingVideos }: TrendingVideosSectionProps) => {
  const [selectedCategory] = useQueryState('category', parseAsString.withDefault('All'));
  const scrollRef = useRef<HTMLDivElement>(null);

  const filteredVideos = useMemo(
    () =>
      selectedCategory === 'All'
        ? trendingVideos
        : trendingVideos.filter(video => video.category === selectedCategory),
    [trendingVideos, selectedCategory]
  );

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
      tabs={categories}
      tabsQueryKey="category"
      defaultTab="All"
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
      {filteredVideos.length === 0 ? (
        <EmptyState
          title="No trending videos in this category"
          description="Try a different filter or check back later for new content."
          icon={<Video className="w-12 h-12 text-muted-foreground" />}
          actionLabel="View all videos"
          actionHref="/videos/trending"
          showDefaultActions={false}
        />
      ) : (
        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory">
          {filteredVideos.map((video, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              className="max-w-[240px] sm:max-w-[280px] lg:max-w-[300px] xl:max-w-[320px] 2xl:max-w-[340px] snap-start shrink-0">
              <VideoCard {...video} />
            </motion.div>
          ))}
        </div>
      )}
    </SectionComp>
  );
};
