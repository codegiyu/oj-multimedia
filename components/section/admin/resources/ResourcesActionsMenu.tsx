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
import type { ResourceListItem } from '@/lib/types/community';

interface ResourcesActionsMenuProps {
  resource: ResourceListItem;
  onApprove: (resource: ResourceListItem) => void;
  onReject: (resource: ResourceListItem) => void;
  onEdit: (resource: ResourceListItem) => void;
  onDelete: (resource: ResourceListItem) => void;
}

export function ResourcesActionsMenu({
  resource,
  onApprove,
  onReject,
  onEdit,
  onDelete,
}: ResourcesActionsMenuProps) {
  const status = (resource as ResourceListItem & { status?: string }).status;
  const canApprove = status === 'draft' || status === 'archived';

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" onClick={e => e.stopPropagation()}>
          <MoreVertical className="h-4 w-4" />
          <span className="sr-only">Open menu for {resource.title}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" onClick={e => e.stopPropagation()}>
        {canApprove ? (
          <DropdownMenuActionItem
            icon={actionMenuIcons.approve}
            onClick={() => onApprove(resource)}>
            Approve
          </DropdownMenuActionItem>
        ) : null}
        {canApprove ? (
          <DropdownMenuActionItem icon={actionMenuIcons.reject} onClick={() => onReject(resource)}>
            Reject
          </DropdownMenuActionItem>
        ) : null}
        <DropdownMenuActionItem icon={actionMenuIcons.edit} onClick={() => onEdit(resource)}>
          Edit
        </DropdownMenuActionItem>
        <DropdownMenuSeparator />
        <DropdownMenuActionItem
          icon={actionMenuIcons.delete}
          variant="destructive"
          onClick={() => onDelete(resource)}>
          Delete
        </DropdownMenuActionItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
