'use client';

import { motion } from 'framer-motion';
import { FileQuestion, Search, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

interface EmptyStateProps {
  title?: string;
  description?: string;
  icon?: React.ReactNode;
  actionLabel?: string;
  actionHref?: string;
  onAction?: () => void;
}

export const EmptyState = ({
  title = 'No items found',
  description = 'Try selecting a different category or check back later.',
  icon,
  actionLabel,
  actionHref,
  onAction,
}: EmptyStateProps) => {
  const defaultIcon = icon || <FileQuestion className="w-12 h-12 text-muted-foreground" />;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col items-center justify-center py-16 px-4">
      <div className="w-20 h-20 rounded-full bg-muted/50 flex items-center justify-center mb-6">
        {defaultIcon}
      </div>
      <h3 className="text-xl font-semibold text-foreground mb-2">{title}</h3>
      <p className="text-muted-foreground text-center max-w-md mb-6">{description}</p>
      {(actionLabel && actionHref) || onAction ? (
        <div className="flex items-center gap-3">
          {actionHref ? (
            <Button asChild variant="outline" className="gap-2">
              <Link href={actionHref}>
                <ArrowLeft className="w-4 h-4" />
                {actionLabel || 'Go back'}
              </Link>
            </Button>
          ) : onAction ? (
            <Button onClick={onAction} variant="outline" className="gap-2">
              {actionLabel}
            </Button>
          ) : null}
          <Button asChild variant="ghost">
            <Link href="?category=all" className="gap-2">
              <Search className="w-4 h-4" />
              View all categories
            </Link>
          </Button>
        </div>
      ) : (
        <Button asChild variant="ghost">
          <Link href="?category=all" className="gap-2">
            <Search className="w-4 h-4" />
            View all categories
          </Link>
        </Button>
      )}
    </motion.div>
  );
};
