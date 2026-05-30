'use client';

import { useState } from 'react';
import { Star, Info } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

const PRIORITY_HELP: Record<number, string> = {
  1: 'Standard coverage — appears in regular news feeds.',
  2: 'Notable story — highlighted with a priority marker.',
  3: 'High interest — stronger visibility in listings.',
  4: 'Breaking news — eligible for the Breaking News rail (about 7 days).',
  5: 'Urgent breaking — top placement in Breaking News.',
};

export function priorityLabel(priority: number): string {
  if (priority >= 5) return 'Urgent breaking';
  if (priority >= 4) return 'Breaking news';
  if (priority >= 3) return 'High priority';
  if (priority >= 2) return 'Elevated';
  return 'Standard';
}

interface NewsPriorityIndicatorProps {
  priority?: number;
  className?: string;
  /** Use dialog instead of tooltip (e.g. touch-first layouts). */
  preferDialog?: boolean;
}

export function NewsPriorityIndicator({
  priority = 1,
  className,
  preferDialog = false,
}: NewsPriorityIndicatorProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const level = Math.min(5, Math.max(1, Math.round(priority) || 1));

  if (level < 2) return null;

  const starCount = Math.min(level - 1, 4);
  const helpText = PRIORITY_HELP[level] ?? PRIORITY_HELP[2];

  const trigger = (
    <button
      type="button"
      className={cn(
        'inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium',
        'bg-destructive/10 text-destructive hover:bg-destructive/15 transition-colors',
        className
      )}
      aria-label={`News priority ${level}: ${priorityLabel(level)}. More info`}
      onClick={preferDialog ? () => setDialogOpen(true) : undefined}>
      {Array.from({ length: starCount }).map((_, i) => (
        <Star key={i} className="w-3.5 h-3.5 fill-current" aria-hidden />
      ))}
      <span className="sr-only">{priorityLabel(level)}</span>
      <Info className="w-3.5 h-3.5 opacity-80" aria-hidden />
    </button>
  );

  if (preferDialog) {
    return (
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogTrigger asChild>{trigger}</DialogTrigger>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Story priority ({level}/5)</DialogTitle>
            <DialogDescription>{helpText}</DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <TooltipProvider delayDuration={200}>
      <Tooltip>
        <TooltipTrigger asChild>{trigger}</TooltipTrigger>
        <TooltipContent side="bottom" className="max-w-xs text-left">
          <p className="font-medium">{priorityLabel(level)}</p>
          <p className="text-primary-foreground/90 mt-1">{helpText}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
