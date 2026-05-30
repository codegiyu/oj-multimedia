'use client';

import { motion } from 'motion/react';
import { ArrowLeft, type LucideIcon } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { FixedImage } from '@/components/general/FillImage';
import { cn } from '@/lib/utils';
import type { ReactNode } from 'react';

export interface CommunityDetailHeroMetaItem {
  icon: LucideIcon;
  label: string;
}

interface CommunityContentDetailHeroProps {
  backHref: string;
  backLabel: string;
  title: string;
  subtitle?: string;
  badge?: ReactNode;
  metaItems?: CommunityDetailHeroMetaItem[];
  layout?: 'default' | 'avatar';
  avatar?: {
    src: string;
    alt: string;
    imageContext?: 'public' | 'dashboard';
  };
  headerPrefix?: ReactNode;
  children?: ReactNode;
  /** When true, only renders back link and children (for fully custom hero bodies). */
  customContent?: boolean;
  className?: string;
}

export const CommunityContentDetailHero = ({
  backHref,
  backLabel,
  title,
  subtitle,
  badge,
  metaItems = [],
  layout = 'default',
  avatar,
  headerPrefix,
  children,
  customContent = false,
  className,
}: CommunityContentDetailHeroProps) => {
  const titleBlock = (
    <>
      {badge && <div className="mb-4">{badge}</div>}
      <h1 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold mb-4">{title}</h1>
      {subtitle && (
        <p className="text-lg text-muted-foreground font-medium mb-6 italic">{subtitle}</p>
      )}
      {metaItems.length > 0 && (
        <div className="flex items-center gap-4 text-sm text-muted-foreground flex-wrap mb-6">
          {metaItems.map((item, index) => {
            const Icon = item.icon;

            return (
              <span key={`${item.label}-${index}`} className="flex items-center gap-1">
                <Icon className="w-4 h-4" />
                {item.label}
              </span>
            );
          })}
        </div>
      )}
    </>
  );

  return (
    <section
      className={cn(
        'bg-gradient-to-br from-primary/10 via-background to-accent/10 pt-40 pb-20',
        className
      )}>
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <Link href={backHref}>
            <Button variant="ghost" size="sm" className="gap-2 mb-6">
              <ArrowLeft className="w-4 h-4" />
              {backLabel}
            </Button>
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className={
              customContent
                ? undefined
                : cn(
                    layout === 'avatar' && 'flex items-start gap-6',
                    headerPrefix && 'flex items-start gap-4'
                  )
            }>
            {customContent ? (
              children
            ) : (
              <>
                {headerPrefix}
                {layout === 'avatar' && avatar && (
                  <FixedImage
                    src={avatar.src}
                    alt={avatar.alt}
                    width={80}
                    height={80}
                    imageContext={avatar.imageContext ?? 'public'}
                    className="rounded-full shrink-0"
                  />
                )}
                <div className="flex-1 min-w-0">
                  {titleBlock}
                  {children}
                </div>
              </>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
};
