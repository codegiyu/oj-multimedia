'use client';

import { useRouter, usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { Play, TrendingUp, TrendingDown, Minus, Trophy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { useQueryState, parseAsString } from 'nuqs';
import Link from 'next/link';
import { MusicCardOptions } from './MusicCardOptions';
import { MUSIC_ITEMS } from '@/lib/constants/music';

export interface ChartSong {
  id?: number;
  rank: number;
  title: string;
  artist: string;
  cover: string;
  plays: string;
  trend: 'up' | 'down' | 'same';
  change: number;
  category?: string;
}

interface TopMusicChartsProps {
  songs: ChartSong[];
}

const TrendIcon = ({ trend }: { trend: string }) => {
  if (trend === 'up') return <TrendingUp className="w-4 h-4 text-emerald-500" />;
  if (trend === 'down') return <TrendingDown className="w-4 h-4 text-destructive" />;
  return <Minus className="w-4 h-4 text-muted-foreground" />;
};

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
          {chartSongs.map((song, index) => {
            const musicItem = MUSIC_ITEMS.find(
              item => item.title === song.title && item.artist === song.artist
            );
            return (
              <motion.div
                key={song.id || song.rank}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ scale: 1.01 }}
                className="group">
                <Link
                  href={`/music/${song.id || song.rank}`}
                  className="flex items-center gap-4 p-3 bg-card rounded-xl hover:bg-muted/50 transition-colors cursor-pointer">
                  {/* Rank */}
                  <div
                    className={`
                w-8 h-8 flex items-center justify-center font-bold text-lg
                ${song.rank <= 3 ? 'text-primary' : 'text-muted-foreground'}
              `}>
                    {song.rank}
                  </div>

                  {/* Cover */}
                  <div className="relative w-14 h-14 rounded-lg overflow-hidden shrink-0">
                    <Image
                      src={song.cover}
                      alt={song.title}
                      className="w-full h-full object-cover"
                      fill
                    />
                    <div className="absolute inset-0 bg-foreground/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <Play className="w-5 h-5 text-background fill-current" />
                    </div>
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold truncate group-hover:text-primary transition-colors">
                      {song.title}
                    </h3>
                    <p className="text-sm text-muted-foreground truncate">{song.artist}</p>
                  </div>

                  {/* Stats */}
                  <div className="hidden sm:flex items-center gap-4">
                    <span className="text-sm text-muted-foreground">{song.plays}</span>
                    <div className="flex items-center gap-1">
                      <TrendIcon trend={song.trend} />
                      {song.change > 0 && (
                        <span
                          className={`text-xs ${song.trend === 'up' ? 'text-emerald-500' : song.trend === 'down' ? 'text-destructive' : 'text-muted-foreground'}`}>
                          {song.change}%
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Options Menu */}
                  <div
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={e => e.preventDefault()}>
                    {musicItem && <MusicCardOptions musicItem={musicItem} />}
                  </div>
                </Link>
              </motion.div>
            );
          })}
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
