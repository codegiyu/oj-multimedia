'use client';

import { useRouter, usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { Trophy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useQueryState, parseAsString } from 'nuqs';
import { ChartCard } from '@/components/cards/ChartCard';

export interface ChartSong {
  _id: string;
  rank: number;
  title: string;
  artist: { _id: string; name: string };
  cover: string;
  plays: string;
  trend: 'up' | 'down' | 'same';
  change: number;
  category?: string;
}

interface TopMusicChartsProps {
  songs: ChartSong[];
}

export const TopMusicCharts = ({ songs: chartSongs }: TopMusicChartsProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const [activePeriod] = useQueryState('period', parseAsString.withDefault('weekly'));

  const handlePeriodChange = (period: string) => {
    const currentUrl = new URL(window.location.href);
    const searchParams = new URLSearchParams(currentUrl.search);

    if (period === 'weekly') {
      searchParams.delete('period');
    } else {
      searchParams.set('period', period);
    }

    const newUrl = searchParams.toString() ? `${pathname}?${searchParams.toString()}` : pathname;
    router.push(newUrl, { scroll: false });
  };

  const getPeriodLabel = () => {
    switch (activePeriod) {
      case 'monthly':
        return "This month's hottest tracks";
      case 'alltime':
        return 'All-time top tracks';
      default:
        return "This week's hottest tracks";
    }
  };

  return (
    <section className="py-12 bg-muted/30">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-accent/20 flex items-center justify-center">
              <Trophy className="w-5 h-5 text-accent-foreground" />
            </div>
            <div>
              <h2 className="text-2xl font-display font-bold">Top Charts</h2>
              <p className="text-sm text-muted-foreground">{getPeriodLabel()}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handlePeriodChange('weekly')}
              className={activePeriod === 'weekly' ? 'bg-primary text-primary-foreground' : ''}>
              Weekly
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handlePeriodChange('monthly')}
              className={activePeriod === 'monthly' ? 'bg-primary text-primary-foreground' : ''}>
              Monthly
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handlePeriodChange('alltime')}
              className={activePeriod === 'alltime' ? 'bg-primary text-primary-foreground' : ''}>
              All Time
            </Button>
          </div>
        </div>

        {/* Charts Grid */}
        <div className="grid md:grid-cols-2 gap-4">
          {chartSongs.map((song, index) => (
            <motion.div
              key={song._id}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}>
              <ChartCard
                _id={song._id}
                rank={song.rank}
                title={song.title}
                artist={song.artist}
                cover={song.cover}
                plays={song.plays}
                trend={song.trend}
                change={song.change}
              />
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-8">
          <Button variant="outline" size="lg" asChild>
            <a href="/music/top-charts">View Full Charts</a>
          </Button>
        </div>
      </div>
    </section>
  );
};
