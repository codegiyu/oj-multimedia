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
import type { PastorListItem } from '@/lib/types/community';

interface PastorsActionsMenuProps {
  item: PastorListItem;
  onEdit: (item: PastorListItem) => void;
  onDelete: (item: PastorListItem) => void;
  onToggleActive: (item: PastorListItem) => void;
  onToggleFeatured: (item: PastorListItem) => void;
  onSuspend?: (item: PastorListItem) => void;
  onUnsuspend?: (item: PastorListItem) => void;
}

export function PastorsActionsMenu({
  item,
  onEdit,
  onDelete,
  onToggleActive,
  onToggleFeatured,
  onSuspend,
  onUnsuspend,
}: PastorsActionsMenuProps) {
  const isActive = item.isActive !== false;
  const isFeatured = item.isFeatured === true;
  const isSuspended = item.profileStatus === 'suspended';
  const canSuspend = item.profileStatus === 'active' || (isActive && !isSuspended);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" onClick={e => e.stopPropagation()}>
          <MoreVertical className="h-4 w-4" />
          <span className="sr-only">Open menu for {item.name}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" onClick={e => e.stopPropagation()}>
        <DropdownMenuActionItem icon={actionMenuIcons.edit} onClick={() => onEdit(item)}>
          Edit
        </DropdownMenuActionItem>
        <DropdownMenuActionItem
          icon={actionMenuIcons.toggleActive}
          onClick={() => onToggleActive(item)}>
          {isActive ? 'Mark inactive' : 'Mark active'}
        </DropdownMenuActionItem>
        <DropdownMenuActionItem
          icon={isFeatured ? actionMenuIcons.unfeature : actionMenuIcons.toggleFeatured}
          onClick={() => onToggleFeatured(item)}>
          {isFeatured ? 'Remove featured' : 'Mark featured'}
        </DropdownMenuActionItem>
        {canSuspend && onSuspend ? (
          <DropdownMenuActionItem icon={actionMenuIcons.suspend} onClick={() => onSuspend(item)}>
            Suspend
          </DropdownMenuActionItem>
        ) : null}
        {isSuspended && onUnsuspend ? (
          <DropdownMenuActionItem
            icon={actionMenuIcons.unsuspend}
            onClick={() => onUnsuspend(item)}>
            Unsuspend
          </DropdownMenuActionItem>
        ) : null}
        <DropdownMenuSeparator />
        <DropdownMenuActionItem
          icon={actionMenuIcons.delete}
          variant="destructive"
          onClick={() => onDelete(item)}>
          Delete
        </DropdownMenuActionItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
