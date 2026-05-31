'use client';

import { motion } from 'motion/react';
import { Play, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AppLink } from '@/components/atoms/AppLink';
import { FillImage } from '@/components/general/FillImage';
import {
  chartTrendAriaLabel,
  formatChartChangePercent,
  type ChartTrend,
} from '@/lib/utils/chartCardDisplay';

interface ChartCardProps {
  _id?: string;
  rank: number;
  title: string;
  artist: string | { _id: string; name: string };
  cover: string;
  plays: string;
  trend: ChartTrend;
  change?: number;
}

function ChartRankCell({ rank }: { rank: number }) {
  return (
    <div className="flex w-10 shrink-0 flex-col items-center gap-0.5">
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

function ChartTrendCell({ trend }: { trend: ChartTrend }) {
  const TrendIcon = trend === 'up' ? TrendingUp : trend === 'down' ? TrendingDown : Minus;
  const trendColor =
    trend === 'up'
      ? 'text-secondary'
      : trend === 'down'
        ? 'text-destructive'
        : 'text-muted-foreground';

  return (
    <div className="flex w-10 shrink-0 flex-col items-center gap-0.5">
      <span className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
        Trend
      </span>
      <div
        className={`flex h-8 w-8 items-center justify-center rounded-md bg-muted/40 ${trendColor}`}
        title={chartTrendAriaLabel(trend)}
        aria-label={chartTrendAriaLabel(trend)}>
        <TrendIcon className="h-4 w-4" aria-hidden />
      </div>
    </div>
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
  const trendColor =
    trend === 'up'
      ? 'text-secondary'
      : trend === 'down'
        ? 'text-destructive'
        : 'text-muted-foreground';

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
            Change
          </p>
          <p className={`text-xs font-medium tabular-nums ${trendColor}`}>
            {formatChartChangePercent(trend, change)}
          </p>
        </div>
      ) : null}
    </div>
  );
}

function ChartCardBody({
  rank,
  title,
  artistName,
  cover,
  plays,
  trend,
  change,
  detailHref,
}: {
  rank: number;
  title: string;
  artistName: string;
  cover: string;
  plays: string;
  trend: ChartTrend;
  change?: number;
  detailHref?: string;
}) {
  const coverBlock = (
    <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg">
      <FillImage imageContext="public" src={cover} alt="" sizes="48px" />
      {detailHref ? (
        <div className="absolute inset-0 flex items-center justify-center bg-foreground/30 opacity-0 transition-opacity group-hover:opacity-100">
          <Play className="h-4 w-4 fill-current text-primary-foreground" aria-hidden />
        </div>
      ) : null}
    </div>
  );

  const metaBlock = (
    <div className="min-w-0 flex-1">
      <h4
        className={`truncate font-medium ${detailHref ? 'transition-colors group-hover:text-primary' : ''}`}>
        {title}
      </h4>
      <p className="truncate text-sm text-muted-foreground">{artistName}</p>
      <div className="mt-1 flex gap-3 text-xs text-muted-foreground sm:hidden">
        <span>
          <span className="font-medium text-foreground/80">{plays}</span> plays
        </span>
        {change != null ? (
          <span
            className={
              trend === 'up' ? 'text-secondary' : trend === 'down' ? 'text-destructive' : ''
            }>
            {formatChartChangePercent(trend, change)}
          </span>
        ) : null}
      </div>
    </div>
  );

  return (
    <>
      <ChartRankCell rank={rank} />
      <ChartTrendCell trend={trend} />
      {coverBlock}
      {metaBlock}
      <ChartStatsCell plays={plays} trend={trend} change={change} />
    </>
  );
}

export function ChartCardsLegend({ className = '' }: { className?: string }) {
  return (
    <div
      className={`mb-3 hidden grid-cols-[2.5rem_2.5rem_3rem_1fr_5.5rem] items-end gap-4 px-4 text-[10px] font-medium uppercase tracking-wide text-muted-foreground sm:grid ${className}`}
      aria-hidden>
      <span>Rank</span>
      <span>Trend</span>
      <span className="col-span-1">Track</span>
      <span />
      <span className="text-right">Plays / Change</span>
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
}: ChartCardProps) => {
  const artistName = typeof artist === 'string' ? artist : artist.name;
  const detailHref = _id ? `/music/${_id}` : undefined;

  return (
    <motion.article
      whileHover={{ x: 4 }}
      transition={{ duration: 0.2 }}
      className="group flex items-center gap-3 rounded-xl border border-border/70 bg-card p-3 shadow-sm transition-colors hover:border-border hover:bg-muted/30">
      {detailHref ? (
        <>
          <AppLink
            href={detailHref}
            className="flex min-w-0 flex-1 items-center gap-3"
            aria-label={`View ${title} by ${artistName}`}>
            <ChartCardBody
              rank={rank}
              title={title}
              artistName={artistName}
              cover={cover}
              plays={plays}
              trend={trend}
              change={change}
              detailHref={detailHref}
            />
          </AppLink>
          <Button
            variant="play"
            size="icon-sm"
            className="shrink-0 opacity-0 transition-opacity group-hover:opacity-100"
            asChild>
            <AppLink href={detailHref} aria-label={`Play ${title}`}>
              <Play className="ml-0.5 h-4 w-4 fill-current" />
            </AppLink>
          </Button>
        </>
      ) : (
        <div className="flex min-w-0 flex-1 items-center gap-3">
          <ChartCardBody
            rank={rank}
            title={title}
            artistName={artistName}
            cover={cover}
            plays={plays}
            trend={trend}
            change={change}
          />
        </div>
      )}
    </motion.article>
  );
};
