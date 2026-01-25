'use client';

import { motion } from 'framer-motion';
import { Trophy, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ChartCard } from '@/components/cards/ChartCard';

export interface ChartItem {
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
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-accent/20 flex items-center justify-center">
                  <Trophy className="w-5 h-5 text-accent-foreground" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-xl">Top Songs</h3>
                  <p className="text-sm text-muted-foreground">This Week</p>
                </div>
              </div>
              <Button variant="ghost" size="sm">
                See All
              </Button>
            </div>

            <div className="space-y-1">
              {chartData.slice(0, 5).map(item => (
                <ChartCard key={item.rank} {...item} />
              ))}
            </div>
          </motion.div>

          {/* Rising Artists */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="bg-card rounded-3xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-xl">Rising Artists</h3>
                  <p className="text-sm text-muted-foreground">New Talents</p>
                </div>
              </div>
              <Button variant="ghost" size="sm">
                See All
              </Button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {risingArtists.map((artist, index) => (
                <motion.div
                  key={index}
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
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
