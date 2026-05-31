'use client';

import { motion } from 'motion/react';
import { Clapperboard } from 'lucide-react';
import { VideoCard } from '@/components/cards/VideoCard';
import { SectionComp } from '@/components/general/SectionComp';
import { SectionEmptyState } from '@/components/general/SectionEmptyState';
import type { TrendingVideoItem } from './TrendingVideosSection';
import { VIDEO_DEFAULT_RAIL_ITEM_CLASS } from '@/lib/constants/mediaCardLayout';

interface SimpleVideoRailProps {
  heading: string;
  subtext?: string;
  viewAllLink: string;
  videos: TrendingVideoItem[];
}

export function SimpleVideoRail({ heading, subtext, viewAllLink, videos }: SimpleVideoRailProps) {
  return (
    <SectionComp
      icon={Clapperboard}
      iconColor="secondary"
      heading={heading}
      subtext={subtext ?? ''}
      viewAllLink={viewAllLink}
      showPrevNext={false}
      contentProps={{ className: '', enableAnimation: false }}>
      {videos.length === 0 ? (
        <SectionEmptyState
          title="No videos yet"
          description="New videos will appear here."
          icon={Clapperboard}
          actionLabel="Browse videos"
          actionHref="/videos"
        />
      ) : (
        <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory">
          {videos.map((video, index) => (
            <motion.div
              key={video._id || index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              className={VIDEO_DEFAULT_RAIL_ITEM_CLASS}>
              <VideoCard
                _id={video._id}
                title={video.title}
                creator={video.creator}
                thumbnail={video.thumbnail}
                views={video.views}
                duration={video.duration}
                category={video.category}
              />
            </motion.div>
          ))}
        </div>
      )}
    </SectionComp>
  );
}
