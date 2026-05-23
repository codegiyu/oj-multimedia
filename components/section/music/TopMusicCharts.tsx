'use client';

import { motion } from 'motion/react';
import { Trophy } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useQueryState, parseAsString } from 'nuqs';
import { SectionComp } from '@/components/general/SectionComp';
import { ChartCard } from '@/components/cards/ChartCard';
import { EmptyState } from '../news/EmptyState';

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
  const [activePeriod, setActivePeriod] = useQueryState(
    'period',
    parseAsString.withDefault('weekly')
  );

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

  const periodButtons = (
    <div className="flex gap-2">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setActivePeriod('weekly')}
        className={activePeriod === 'weekly' ? 'bg-primary text-primary-foreground' : ''}>
        Weekly
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setActivePeriod('monthly')}
        className={activePeriod === 'monthly' ? 'bg-primary text-primary-foreground' : ''}>
        Monthly
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setActivePeriod('alltime')}
        className={activePeriod === 'alltime' ? 'bg-primary text-primary-foreground' : ''}>
        All Time
      </Button>
    </div>
  );

  if (chartSongs.length === 0) {
    return (
      <SectionComp
        icon={Trophy}
        iconColor="accent"
        heading="Top Charts"
        subtext={getPeriodLabel()}
        extraButtons={periodButtons}
        background="bg-muted/30"
        contentProps={{ enableAnimation: false }}>
        <EmptyState
          title="No chart data"
          description="No chart data for this period or category yet. Try another period or check back later."
          icon={<Trophy className="w-12 h-12 text-muted-foreground" />}
        />
      </SectionComp>
    );
  }

  return (
    <SectionComp
      icon={Trophy}
      iconColor="accent"
      heading="Top Charts"
      subtext={getPeriodLabel()}
      extraButtons={periodButtons}
      background="bg-muted/30"
      sectionClassName="overflow-hidden"
      contentProps={{ enableAnimation: false }}>
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
          <Link href="/music/top-charts">View Full Charts</Link>
        </Button>
      </div>
    </SectionComp>
  );
};
