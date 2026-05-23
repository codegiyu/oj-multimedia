'use client';

import { Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { shareContent } from '@/lib/utils/shareContent';
import { cn } from '@/lib/utils';

interface ShareIconButtonProps {
  title: string;
  text?: string;
  url: string;
  className?: string;
  iconClassName?: string;
  'aria-label'?: string;
}

export function ShareIconButton({
  title,
  text,
  url,
  className,
  iconClassName,
  'aria-label': ariaLabel = 'Share',
}: ShareIconButtonProps) {
  return (
    <Button
      type="button"
      variant="ghost"
      size="icon-sm"
      className={className}
      aria-label={ariaLabel}
      onClick={e => {
        e.preventDefault();
        e.stopPropagation();
        void shareContent({ title, text, url });
      }}>
      <Share2 className={cn('w-4 h-4', iconClassName)} />
    </Button>
  );
}
