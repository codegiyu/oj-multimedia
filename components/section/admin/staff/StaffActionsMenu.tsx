'use client';

import { MoreVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import type { StaffListItem } from '@/lib/types/adminStaff';

interface StaffActionsMenuProps {
  item: StaffListItem;
  onReinvite?: (item: StaffListItem) => void;
}

export function StaffActionsMenu({ item }: StaffActionsMenuProps) {
  const displayName =
    [item.firstName, item.lastName].filter(Boolean).join(' ').trim() || item.email;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" onClick={e => e.stopPropagation()}>
          <MoreVertical className="h-4 w-4" />
          <span className="sr-only">Open menu for {displayName}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" onClick={e => e.stopPropagation()}>
        {/* CLIENT-HIDDEN: Reinvite — uncomment when invite feature is enabled.
        {canReinvite ? (
          <DropdownMenuItem onClick={() => onReinvite!(item)}>Resend invitation</DropdownMenuItem>
        ) : null}
        */}
        <DropdownMenuItem disabled>Row click for details</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
