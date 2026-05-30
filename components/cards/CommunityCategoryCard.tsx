'use client';

import { motion } from 'motion/react';
import { LucideIcon } from 'lucide-react';
import { AppLink } from '@/components/atoms/AppLink';
import { cn } from '@/lib/utils';

interface CategoryCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  color: 'primary' | 'secondary' | 'accent';
  count?: number;
  href?: string;
  onClick?: () => void;
}

const colorStyles = {
  primary: {
    bg: 'bg-primary/10',
    iconBg: 'bg-primary/20',
    icon: 'text-primary',
    hover: 'hover:bg-primary/15',
    border: 'hover:border-primary/30',
  },
  secondary: {
    bg: 'bg-secondary/10',
    iconBg: 'bg-secondary/20',
    icon: 'text-secondary',
    hover: 'hover:bg-secondary/15',
    border: 'hover:border-secondary/30',
  },
  accent: {
    bg: 'bg-accent/10',
    iconBg: 'bg-accent/20',
    icon: 'text-accent',
    hover: 'hover:bg-accent/15',
    border: 'hover:border-accent/30',
  },
};

export const CategoryCard = ({
  icon: Icon,
  title,
  description,
  color,
  count,
  href,
  onClick,
}: CategoryCardProps) => {
  const styles = colorStyles[color];

  const cardContent = (
    <motion.div
      whileHover={{ scale: 1.02, y: -4 }}
      whileTap={{ scale: 0.98 }}
      className={cn(
        'w-full p-6 rounded-2xl text-left transition-all duration-300',
        'bg-card border border-border/50 shadow-sm',
        styles.hover,
        styles.border,
        href || onClick ? 'cursor-pointer' : ''
      )}>
      <div className="flex items-start gap-4">
        <div
          className={cn(
            'w-12 h-12 rounded-xl flex items-center justify-center shrink-0',
            styles.iconBg
          )}>
          <Icon className={cn('w-6 h-6', styles.icon)} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2 mb-1">
            <h3 className="font-semibold text-lg">{title}</h3>
            {count !== undefined && (
              <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-full">
                {count}
              </span>
            )}
          </div>
          <p className="text-sm text-muted-foreground line-clamp-2">{description}</p>
        </div>
      </div>
    </motion.div>
  );

  if (href) {
    return (
      <AppLink href={href} className="block">
        {cardContent}
      </AppLink>
    );
  }

  if (onClick) {
    return (
      <button onClick={onClick} className="w-full text-left">
        {cardContent}
      </button>
    );
  }

  return cardContent;
};
