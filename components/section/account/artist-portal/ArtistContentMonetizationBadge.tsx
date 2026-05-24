'use client';

import { cn } from '@/lib/utils';

interface ArtistContentMonetizationBadgeProps {
  isMonetizable?: boolean;
  price?: number;
  className?: string;
}

export function ArtistContentMonetizationBadge({
  isMonetizable,
  price,
  className,
}: ArtistContentMonetizationBadgeProps) {
  if (!isMonetizable) return null;

  const label =
    typeof price === 'number' && price > 0 ? `Premium · ₦${price.toLocaleString()}` : 'Premium';

  return (
    <span
      className={cn(
        'text-xs font-medium px-2 py-1 rounded-full bg-amber-500/15 text-amber-800 dark:text-amber-400',
        className
      )}>
      {label}
    </span>
  );
}
