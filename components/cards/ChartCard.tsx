'use client';

import { motion } from 'motion/react';
import { Play, TrendingUp, TrendingDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AppLink } from '@/components/atoms/AppLink';
import { FillImage } from '@/components/general/FillImage';
import { cn } from '@/lib/utils';
import { ArtistNameLine } from '@/components/general/ArtistNameLine';
import type { ArtistRef } from '@/lib/utils/artistDisplay';
import {
  chartEntryBadgeLabel,
  chartMovementAriaLabel,
  formatChartRankChangeValue,
  type ChartEntry,
  type ChartTrend,
} from '@/lib/utils/chartCardDisplay';

interface ChartCardProps {
  _id?: string;
  rank: number;
  title: string;
  artist: ArtistRef;
  cover: string;
  plays: string;
  trend: ChartTrend;
  change?: number;
  chartEntry?: ChartEntry;
}

function ChartRankCell({ rank, className }: { rank: number; className?: string }) {
  return (
    <div className={cn('flex w-10 shrink-0 flex-col items-center gap-0.5', className)}>
      <span className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
        Rank
      </span>
      <span
        className={`font-display text-lg font-bold tabular-nums ${rank <= 3 ? 'text-primary' : 'text-muted-foreground'}`}
        aria-label={`Chart position ${rank}`}>
        {rank}
      </span>
    </div>
  );
}

function ChartMovementDisplay({ trend, change }: { trend: ChartTrend; change?: number }) {
  if (change == null) return null;

  const ariaLabel = chartMovementAriaLabel(trend, change);
  const value = formatChartRankChangeValue(change);

  if (value == null) {
    return (
      <span
        className="text-xs font-medium tabular-nums text-muted-foreground"
        aria-label={ariaLabel}>
        —
      </span>
    );
  }

  if (trend !== 'up' && trend !== 'down') {
    return (
      <span
        className="text-xs font-medium tabular-nums text-muted-foreground"
        aria-label={ariaLabel}>
        {value}
      </span>
    );
  }

  const Icon = trend === 'up' ? TrendingUp : TrendingDown;
  const colorClass = trend === 'up' ? 'text-secondary' : 'text-destructive';

  return (
    <span
      className={`inline-flex items-center gap-0.5 text-xs font-medium tabular-nums ${colorClass}`}
      aria-label={ariaLabel}>
      <Icon className="h-3.5 w-3.5 shrink-0" aria-hidden />
      {value}
    </span>
  );
}

function ChartEntryBadge({ chartEntry }: { chartEntry?: ChartEntry }) {
  if (!chartEntry) return null;

  const { label, variant, ariaLabel } = chartEntryBadgeLabel(chartEntry);

  return (
    <Badge variant={variant} className="h-5 shrink-0 px-1.5 text-[10px] font-medium uppercase">
      <span aria-label={ariaLabel}>{label}</span>
    </Badge>
  );
}

function ChartStatsCell({
  plays,
  trend,
  change,
}: {
  plays: string;
  trend: ChartTrend;
  change?: number;
}) {
  return (
    <div className="hidden shrink-0 flex-col items-end gap-2 text-right sm:flex">
      <div>
        <p className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
          Plays
        </p>
        <p className="text-sm font-medium tabular-nums">{plays}</p>
      </div>
      {change != null ? (
        <div>
          <p className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
            Movement
          </p>
          <ChartMovementDisplay trend={trend} change={change} />
        </div>
      ) : null}
    </div>
  );
}

function ChartPlayButton({
  detailHref,
  title,
  className,
}: {
  detailHref: string;
  title: string;
  className?: string;
}) {
  return (
    <Button variant="play" size="icon-sm" className={cn('shrink-0 touch-hit', className)} asChild>
      <AppLink href={detailHref} aria-label={`Play ${title}`}>
        <Play className="ml-0.5 h-4 w-4 fill-current" />
      </AppLink>
    </Button>
  );
}

function ChartCardMainRow({
  rank,
  title,
  artist,
  cover,
  plays,
  trend,
  change,
  chartEntry,
  detailHref,
}: {
  rank: number;
  title: string;
  artist: ArtistRef;
  cover: string;
  plays: string;
  trend: ChartTrend;
  change?: number;
  chartEntry?: ChartEntry;
  detailHref?: string;
}) {
  const coverBlock = (
    <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg">
      <FillImage imageContext="public" src={cover} alt="" sizes="48px" />
      {detailHref ? (
        <div className="absolute inset-0 flex items-center justify-center bg-foreground/30 opacity-0 transition-opacity group-hover:opacity-100 pointer-events-none">
          <Play className="h-4 w-4 fill-current text-primary-foreground" aria-hidden />
        </div>
      ) : null}
    </div>
  );

  const titleBlock = detailHref ? (
    <AppLink href={detailHref} className="min-w-0 flex-1 overflow-hidden block">
      <div className="flex min-w-0 items-center gap-2 overflow-hidden">
        <h4 className="truncate font-medium min-w-0 transition-colors group-hover:text-primary">
          {title}
        </h4>
        <ChartEntryBadge chartEntry={chartEntry} />
      </div>
    </AppLink>
  ) : (
    <div className="flex min-w-0 items-center gap-2 overflow-hidden">
      <h4 className="truncate font-medium min-w-0">{title}</h4>
      <ChartEntryBadge chartEntry={chartEntry} />
    </div>
  );

  const metaBlock = (
    <div className="min-w-0 flex-1 overflow-hidden">
      {titleBlock}
      <ArtistNameLine artist={artist} />
      <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-muted-foreground sm:hidden">
        <span>
          <span className="font-medium text-foreground/80">{plays}</span> plays
        </span>
        {change != null ? <ChartMovementDisplay trend={trend} change={change} /> : null}
      </div>
    </div>
  );

  const linkedCover = detailHref ? (
    <AppLink
      href={detailHref}
      className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg block"
      aria-label={`View ${title}`}>
      <FillImage imageContext="public" src={cover} alt="" sizes="48px" />
      <div className="absolute inset-0 flex items-center justify-center bg-foreground/30 opacity-0 transition-opacity group-hover:opacity-100 pointer-events-none">
        <Play className="h-4 w-4 fill-current text-primary-foreground" aria-hidden />
      </div>
    </AppLink>
  ) : (
    coverBlock
  );

  return (
    <div className="flex min-w-0 flex-1 items-center gap-3 overflow-hidden">
      <ChartRankCell rank={rank} className="hidden sm:flex" />
      {linkedCover}
      {metaBlock}
      <ChartStatsCell plays={plays} trend={trend} change={change} />
    </div>
  );
}

export function ChartCardsLegend({ className = '' }: { className?: string }) {
  return (
    <div
      className={cn(
        'mb-3 hidden grid-cols-[2.5rem_3rem_1fr_5.5rem] items-end gap-4 px-4 text-[10px] font-medium uppercase tracking-wide text-muted-foreground sm:grid',
        className
      )}
      aria-hidden>
      <span>Rank</span>
      <span className="col-span-1">Track</span>
      <span />
      <span className="text-right">Plays / Movement</span>
    </div>
  );
}

export const ChartCard = ({
  _id,
  rank,
  title,
  artist,
  cover,
  plays,
  trend,
  change,
  chartEntry,
}: ChartCardProps) => {
  const detailHref = _id ? `/music/${_id}` : undefined;

  const mainRow = (
    <ChartCardMainRow
      rank={rank}
      title={title}
      artist={artist}
      cover={cover}
      plays={plays}
      trend={trend}
      change={change}
      chartEntry={chartEntry}
      detailHref={detailHref}
    />
  );

  return (
    <motion.article
      whileHover={{ x: 4 }}
      transition={{ duration: 0.2 }}
      className="group flex flex-col gap-2 rounded-xl border border-border/70 bg-card p-3 shadow-sm transition-colors hover:border-border hover:bg-muted/30 sm:flex-row sm:items-center sm:gap-3 overflow-hidden">
      {detailHref ? (
        <div className="flex items-center justify-between gap-3 sm:hidden overflow-hidden">
          <ChartRankCell rank={rank} />
          <ChartPlayButton detailHref={detailHref} title={title} />
        </div>
      ) : (
        <div className="flex items-center justify-between gap-3 sm:hidden overflow-hidden">
          <ChartRankCell rank={rank} />
        </div>
      )}

      <div className="flex min-w-0 flex-1 overflow-hidden">{mainRow}</div>
      {detailHref ? (
        <ChartPlayButton
          detailHref={detailHref}
          title={title}
          className="hidden shrink-0 opacity-0 transition-opacity group-hover:opacity-100 sm:inline-flex"
        />
      ) : null}
    </motion.article>
  );
};

export type { ChartEntry, ChartTrend };
