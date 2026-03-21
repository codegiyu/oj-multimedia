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
        {canApprove && (
          <DropdownMenuItem onClick={() => onApprove(resource)}>Approve</DropdownMenuItem>
        )}
        {canApprove && (
          <DropdownMenuItem onClick={() => onReject(resource)}>Reject</DropdownMenuItem>
        )}
        <DropdownMenuItem onClick={() => onEdit(resource)}>Edit</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="text-destructive focus:text-destructive"
          onClick={() => onDelete(resource)}>
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
