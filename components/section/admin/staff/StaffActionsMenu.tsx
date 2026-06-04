'use client';

import { MoreVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuActionItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { actionMenuIcons } from '@/lib/constants/actionMenuIcons';
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
          <DropdownMenuActionItem
            icon={actionMenuIcons.resendInvite}
            onClick={() => onReinvite!(item)}>
            Resend invitation
          </DropdownMenuActionItem>
        ) : null}
        */}
        <DropdownMenuActionItem icon={actionMenuIcons.rowDetailsHint} disabled>
          Row click for details
        </DropdownMenuActionItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
