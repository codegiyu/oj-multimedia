'use client';

import { FixedImage } from '@/components/general/FillImage';
import { cn } from '@/lib/utils';

type DashboardThumbnailProps = {
  src?: string | null;
  alt: string;
  size?: number;
  className?: string;
  rounded?: 'md' | 'full';
};

/** Compact table-cell thumbnail with dashboard placeholder fallback. */
export function DashboardThumbnail({
  src,
  alt,
  size = 40,
  className,
  rounded = 'md',
}: DashboardThumbnailProps) {
  return (
    <div
      className={cn(
        'relative shrink-0 overflow-hidden bg-muted',
        rounded === 'full' ? 'rounded-full' : 'rounded-md',
        className
      )}
      style={{ width: size, height: size }}>
      <FixedImage
        src={src ?? ''}
        alt={alt}
        width={size}
        height={size}
        imageContext="dashboard"
        className="h-full w-full object-cover"
      />
    </div>
  );
}
