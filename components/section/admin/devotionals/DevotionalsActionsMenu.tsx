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
import type { DevotionalListItem } from '@/lib/types/community';

interface DevotionalsActionsMenuProps {
  devotional: DevotionalListItem;
  onApprove: (devotional: DevotionalListItem) => void;
  onReject: (devotional: DevotionalListItem) => void;
  onEdit: (devotional: DevotionalListItem) => void;
  onDelete: (devotional: DevotionalListItem) => void;
}

export function DevotionalsActionsMenu({
  devotional,
  onApprove,
  onReject,
  onEdit,
  onDelete,
}: DevotionalsActionsMenuProps) {
  const status = (devotional as { status?: string }).status;
  const canApprove = status === 'draft' || status === 'archived';

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" onClick={e => e.stopPropagation()}>
          <MoreVertical className="h-4 w-4" />
          <span className="sr-only">Open menu for {devotional.title}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" onClick={e => e.stopPropagation()}>
        {canApprove && (
          <DropdownMenuItem onClick={() => onApprove(devotional)}>Approve</DropdownMenuItem>
        )}
        {canApprove && (
          <DropdownMenuItem onClick={() => onReject(devotional)}>Reject</DropdownMenuItem>
        )}
        <DropdownMenuItem onClick={() => onEdit(devotional)}>Edit</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="text-destructive focus:text-destructive"
          onClick={() => onDelete(devotional)}>
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
