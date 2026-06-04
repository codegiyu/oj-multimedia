import Link from 'next/link';
import { FixedImage } from '@/components/general/FillImage';
import { cn } from '@/lib/utils';

const LOGO_SRC = '/images/logo-badge.png';

export type DashboardBrandVariant = 'compact' | 'drawer' | 'sidebar';

interface DashboardBrandBlockProps {
  title: string;
  subtitle?: string;
  href?: string;
  variant?: DashboardBrandVariant;
  className?: string;
  collapsed?: boolean;
}

export function DashboardBrandBlock({
  title,
  subtitle,
  href,
  variant = 'drawer',
  className,
  collapsed = false,
}: DashboardBrandBlockProps) {
  const logo = (
    <FixedImage
      src={LOGO_SRC}
      alt="OJ Multimedia"
      width={36}
      height={36}
      className={cn('h-9 w-auto shrink-0', variant === 'compact' && 'h-8')}
    />
  );

  const logoNode = href ? (
    <Link
      href={href}
      className="flex shrink-0 items-center rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2">
      {logo}
    </Link>
  ) : (
    <span className="flex shrink-0 items-center">{logo}</span>
  );

  if (collapsed) {
    return <div className={cn('flex justify-center', className)}>{logoNode}</div>;
  }

  if (variant === 'compact') {
    return (
      <div className={cn('flex min-w-0 items-center gap-2', className)}>
        {logoNode}
        <div className="min-w-0 hidden sm:block">
          <p className="truncate text-sm font-semibold text-foreground">{title}</p>
          {subtitle ? <p className="truncate text-xs text-muted-foreground">{subtitle}</p> : null}
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        'flex items-center gap-3',
        variant === 'sidebar' && 'gap-3',
        variant === 'drawer' && 'gap-3',
        className
      )}>
      {logoNode}
      <div className="min-w-0 flex-1">
        <p
          className={cn(
            'font-semibold text-foreground',
            variant === 'sidebar' ? 'text-lg' : 'text-base'
          )}>
          {title}
        </p>
        {subtitle ? <p className="text-xs text-muted-foreground line-clamp-2">{subtitle}</p> : null}
      </div>
    </div>
  );
}

export function DashboardLogoLink({ href, className }: { href: string; className?: string }) {
  return (
    <Link
      href={href}
      className={cn(
        'flex shrink-0 items-center rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2',
        className
      )}>
      <FixedImage
        src={LOGO_SRC}
        alt="OJ Multimedia"
        width={36}
        height={36}
        className="h-9 w-auto"
      />
    </Link>
  );
}
