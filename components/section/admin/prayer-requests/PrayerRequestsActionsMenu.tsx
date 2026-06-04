'use client';

import { MoreVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuActionItem,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { actionMenuIcons } from '@/lib/constants/actionMenuIcons';
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
        {canAnswer ? (
          <DropdownMenuActionItem
            icon={actionMenuIcons.answer}
            onClick={() => onAnswer(prayerRequest)}>
            Answer
          </DropdownMenuActionItem>
        ) : null}
        <DropdownMenuActionItem icon={actionMenuIcons.edit} onClick={() => onEdit(prayerRequest)}>
          Edit
        </DropdownMenuActionItem>
        <DropdownMenuSeparator />
        <DropdownMenuActionItem
          icon={actionMenuIcons.delete}
          variant="destructive"
          onClick={() => onDelete(prayerRequest)}>
          Delete
        </DropdownMenuActionItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
