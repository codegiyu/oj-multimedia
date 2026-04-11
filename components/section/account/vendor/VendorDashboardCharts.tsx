'use client';

import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

const WEEK_HEIGHTS = [45, 62, 38, 71, 55, 80, 48];
const LINE_POINTS = '0,42 80,28 160,35 240,18 320,22';

/** CSS/SVG-only visuals — no chart library. Heights normalized for layout. */
export function VendorDashboardCharts({
  revenueHint,
  className,
}: {
  /** Optional label derived from stats (e.g. formatted revenue) */
  revenueHint?: string;
  className?: string;
}) {
  return (
    <div className={cn('grid gap-6 lg:grid-cols-5', className)}>
      <Card className="border-border/80 p-5 shadow-sm lg:col-span-3">
        <h3 className="mb-4 text-base font-semibold text-foreground">Weekly sales</h3>
        <div className="flex h-48 items-end justify-between gap-2 border-b border-dotted border-border pb-1">
          {WEEK_HEIGHTS.map((h, i) => (
            <div key={i} className="flex flex-1 flex-col items-center gap-2">
              <div
                className="w-full max-w-[2rem] rounded-t-md bg-primary/90 transition-all"
                style={{ height: `${h}%` }}
                title={`Day ${i + 1}`}
              />
              <span className="text-[10px] text-muted-foreground">
                {['M', 'T', 'W', 'T', 'F', 'S', 'S'][i]}
              </span>
            </div>
          ))}
        </div>
        {revenueHint ? (
          <p className="mt-2 text-xs text-muted-foreground">Spotlight: {revenueHint}</p>
        ) : null}
      </Card>

      <Card className="border-border/80 p-5 shadow-sm lg:col-span-2">
        <h3 className="mb-4 text-base font-semibold text-foreground">Orders trend</h3>
        <svg viewBox="0 0 320 56" className="h-36 w-full text-muted-foreground/50" aria-hidden>
          <defs>
            <linearGradient id="vendorTrendFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="currentColor" stopOpacity="0.18" />
              <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
            </linearGradient>
          </defs>
          <polygon fill="url(#vendorTrendFill)" points={`0,56 ${LINE_POINTS} 320,56`} />
          <polyline
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            points={LINE_POINTS}
          />
        </svg>
        <div className="mt-2 flex justify-between text-[10px] text-muted-foreground">
          <span>W1</span>
          <span>W2</span>
          <span>W3</span>
          <span>W4</span>
        </div>
      </Card>

      <Card className="border-border/80 p-5 shadow-sm lg:col-span-5">
        <h3 className="mb-4 text-base font-semibold text-foreground">Sales by category</h3>
        <div className="flex flex-col items-center gap-6 md:flex-row md:items-center md:justify-center md:gap-12">
          <div
            className="h-40 w-40 shrink-0 rounded-full"
            style={{
              background:
                'conic-gradient(hsl(var(--primary)) 0deg 162deg, hsl(var(--muted)) 162deg 252deg, hsl(var(--border)) 252deg 306deg, hsl(var(--muted-foreground) / 0.25) 306deg 360deg)',
            }}
            role="img"
            aria-label="Category mix chart"
          />
          <ul className="w-full max-w-sm space-y-2 text-sm">
            {[
              { label: 'Fashion & apparel', pct: '45%', dot: 'bg-primary' },
              { label: 'Accessories', pct: '25%', dot: 'bg-muted-foreground/40' },
              { label: 'Home & gifts', pct: '20%', dot: 'bg-border' },
              { label: 'Other', pct: '10%', dot: 'bg-muted-foreground/25' },
            ].map(row => (
              <li key={row.label} className="flex items-center justify-between gap-4">
                <span className="flex items-center gap-2 text-muted-foreground">
                  <span className={cn('h-2.5 w-2.5 rounded-full', row.dot)} />
                  {row.label}
                </span>
                <span className="font-medium text-foreground">{row.pct}</span>
              </li>
            ))}
          </ul>
        </div>
      </Card>
    </div>
  );
}
