'use client';

import { motion } from 'framer-motion';
import { Trophy, TrendingUp } from 'lucide-react';
import Link from 'next/link';
import { ChartCard } from '@/components/cards/ChartCard';
import { SectionHeader } from '@/components/general/SectionHeader';
import { SectionContent } from '@/components/general/SectionContent';

export interface ChartItem {
  _id?: string;
  rank: number;
  title: string;
  artist: string;
  cover: string;
  plays: string;
  trend: 'up' | 'down' | 'same';
  change?: number;
}

export interface RisingArtist {
  name: string;
  genre: string;
  image: string;
  followers: string;
}

interface TopChartsSectionProps {
  chartData: ChartItem[];
  risingArtists: RisingArtist[];
}

export const TopChartsSection = ({ chartData, risingArtists }: TopChartsSectionProps) => {
  return (
    <section className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Top Songs Chart */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="bg-card rounded-3xl p-6 shadow-sm">
            <SectionHeader
              icon={Trophy}
              iconColor="accent"
              heading="Top Songs"
              subtext="This Week"
              viewAllLink="/music/top-charts"
              viewAllLabel="See All"
              className="mb-6"
            />
            <SectionContent className="space-y-1" enableAnimation={false}>
              {chartData.slice(0, 5).map(item => (
                <ChartCard key={item._id ?? item.rank} {...item} />
              ))}
            </SectionContent>
          </motion.div>

          {/* Rising Artists */}
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
              viewAllLink="/music/artists"
              viewAllLabel="See All"
              className="mb-6"
            />
            <SectionContent className="grid grid-cols-2 gap-4" enableAnimation={false}>
              {risingArtists.map((artist, index) => (
                <Link key={index} href="/music/artists">
                  <motion.div
                    whileHover={{ y: -4 }}
                    className="group p-4 rounded-2xl bg-muted/50 hover:bg-muted transition-colors cursor-pointer">
                    <div className="w-16 h-16 rounded-full overflow-hidden mx-auto mb-3">
                      <img
                        src={artist.image}
                        alt={artist.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <h4 className="font-semibold text-sm text-center group-hover:text-primary transition-colors">
                      {artist.name}
                    </h4>
                    <p className="text-xs text-muted-foreground text-center">{artist.genre}</p>
                    <p className="text-xs text-center mt-1 text-primary font-medium">
                      {artist.followers} followers
                    </p>
                  </motion.div>
                </Link>
              ))}
            </SectionContent>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
