'use client';

import { MoreVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import type { PrayerRequestListItem } from '@/lib/types/community';

interface PrayerRequestsActionsMenuProps {
  prayerRequest: PrayerRequestListItem;
  onAnswer: (prayerRequest: PrayerRequestListItem) => void;
  onEdit: (prayerRequest: PrayerRequestListItem) => void;
  onDelete: (prayerRequest: PrayerRequestListItem) => void;
}

export function PrayerRequestsActionsMenu({
  prayerRequest,
  onAnswer,
  onEdit,
  onDelete,
}: PrayerRequestsActionsMenuProps) {
  const status = (prayerRequest as PrayerRequestListItem & { status?: string }).status;
  const canAnswer = status !== 'answered';

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" onClick={e => e.stopPropagation()}>
          <MoreVertical className="h-4 w-4" />
          <span className="sr-only">Open menu for {prayerRequest.title}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" onClick={e => e.stopPropagation()}>
        {canAnswer && (
          <DropdownMenuItem onClick={() => onAnswer(prayerRequest)}>Answer</DropdownMenuItem>
        )}
        <DropdownMenuItem onClick={() => onEdit(prayerRequest)}>Edit</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="text-destructive focus:text-destructive"
          onClick={() => onDelete(prayerRequest)}>
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
