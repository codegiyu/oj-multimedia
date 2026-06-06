'use client';

import { motion } from 'motion/react';
import { Trophy, TrendingUp } from 'lucide-react';
import { ArtistCard } from '@/components/cards/ArtistCard';
import { ChartCard, ChartCardsLegend } from '@/components/cards/ChartCard';
import { SectionHeader } from '@/components/general/SectionHeader';
import { SectionContent } from '@/components/general/SectionContent';
import { SectionEmptyState } from '@/components/general/SectionEmptyState';
import type { ArtistProfile } from '@/lib/types/artist';

export interface ChartItem {
  _id?: string;
  rank: number;
  title: string;
  artist: { _id: string; name: string };
  cover: string;
  plays: string;
  trend: 'up' | 'down' | 'same';
  change?: number;
  chartEntry?: 'new' | 'reentry' | 'peak';
}

/** @deprecated Use ArtistProfile from @/lib/types/artist */
export type RisingArtist = ArtistProfile;

interface TopChartsSectionProps {
  chartData: ChartItem[];
  risingArtists: ArtistProfile[];
}

export function ChartsColumn({ chartData }: { chartData: ChartItem[] }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="bg-card rounded-3xl p-6 shadow-sm overflow-hidden">
      <SectionHeader
        icon={Trophy}
        iconColor="accent"
        heading="Top Songs"
        subtext="This Week"
        viewAllLink="/music/top-charts"
        viewAllLabel="See All"
        className="mb-6"
      />
      {chartData.length === 0 ? (
        <SectionEmptyState
          title="No chart data yet"
          description="Check back later for top songs and chart rankings."
          icon={Trophy}
          actionLabel="View charts"
          actionHref="/music/top-charts"
        />
      ) : (
        <SectionContent className="space-y-2 overflow-hidden" enableAnimation={false}>
          <ChartCardsLegend />
          {chartData.slice(0, 5).map(item => (
            <ChartCard key={item._id ?? item.rank} {...item} />
          ))}
        </SectionContent>
      )}
    </motion.div>
  );
}

export function RisingArtistsColumn({ risingArtists }: { risingArtists: ArtistProfile[] }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="bg-card rounded-3xl p-6 shadow-sm">
      <SectionHeader
        icon={TrendingUp}
        iconColor="primary"
        heading="Rising Artists"
        subtext="New Talents"
        viewAllLink="/music/rising-artists"
        viewAllLabel="See All"
        className="mb-6"
      />
      {risingArtists.length === 0 ? (
        <SectionEmptyState
          title="No rising artists yet"
          description="Discover new talent soon. Check back for featured artists."
          icon={TrendingUp}
          actionLabel="View all artists"
          actionHref="/music/rising-artists"
        />
      ) : (
        <SectionContent
          className="grid grid-cols-1 min-[360px]:grid-cols-2 gap-4"
          enableAnimation={false}>
          {risingArtists.map(artist => (
            <ArtistCard
              key={artist._id}
              _id={artist._id}
              name={artist.name}
              image={artist.image}
              genre={artist.genre}
              followers={artist.followers}
              verified={artist.verified}
            />
          ))}
        </SectionContent>
      )}
    </motion.div>
  );
}

export const TopChartsSection = ({ chartData, risingArtists }: TopChartsSectionProps) => {
  return (
    <section className="py-10 md:py-24 overflow-hidden scroll-mt-header section-content-visibility">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-8">
          <ChartsColumn chartData={chartData} />
          <RisingArtistsColumn risingArtists={risingArtists} />
        </div>
      </div>
    </section>
  );
};
