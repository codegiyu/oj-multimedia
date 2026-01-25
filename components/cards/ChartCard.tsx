'use client';

import { motion } from 'framer-motion';
import { Play, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ChartCardProps {
  rank: number;
  title: string;
  artist: string;
  cover: string;
  plays: string;
  trend: 'up' | 'down' | 'same';
  change?: number;
}

export const ChartCard = ({ rank, title, artist, cover, plays, trend, change }: ChartCardProps) => {
  const TrendIcon = trend === 'up' ? TrendingUp : trend === 'down' ? TrendingDown : Minus;
  const trendColor =
    trend === 'up'
      ? 'text-secondary'
      : trend === 'down'
        ? 'text-destructive'
        : 'text-muted-foreground';

  return (
    <motion.div
      whileHover={{ x: 4 }}
      transition={{ duration: 0.2 }}
      className="group flex items-center gap-4 p-3 rounded-xl hover:bg-muted/50 transition-colors">
      {/* Rank */}
      <div className="w-8 text-center">
        <span
          className={`font-display font-bold text-lg ${rank <= 3 ? 'text-primary' : 'text-muted-foreground'}`}>
          {rank}
        </span>
      </div>

      {/* Trend */}
      <div className={`w-6 flex items-center justify-center ${trendColor}`}>
        <TrendIcon className="w-4 h-4" />
      </div>

      {/* Cover */}
      <div className="relative w-12 h-12 rounded-lg overflow-hidden shrink-0">
        <img src={cover} alt={title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-foreground/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <Play className="w-4 h-4 text-primary-foreground fill-current" />
        </div>
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <h4 className="font-medium truncate group-hover:text-primary transition-colors">{title}</h4>
        <p className="text-sm text-muted-foreground truncate">{artist}</p>
      </div>

      {/* Stats */}
      <div className="text-right hidden sm:block">
        <p className="text-sm font-medium">{plays}</p>
        {change && (
          <p className={`text-xs ${trendColor}`}>
            {trend === 'up' ? '+' : trend === 'down' ? '-' : ''}
            {change}%
          </p>
        )}
      </div>

      {/* Play Button */}
      <Button
        variant="play"
        size="icon-sm"
        className="opacity-0 group-hover:opacity-100 transition-opacity">
        <Play className="w-4 h-4 fill-current ml-0.5" />
      </Button>
    </motion.div>
  );
};
