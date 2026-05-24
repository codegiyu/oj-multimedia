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
import type { PastorListItem } from '@/lib/types/community';

interface PastorsActionsMenuProps {
  item: PastorListItem;
  onEdit: (item: PastorListItem) => void;
  onDelete: (item: PastorListItem) => void;
  onToggleActive: (item: PastorListItem) => void;
  onToggleFeatured: (item: PastorListItem) => void;
}

export function PastorsActionsMenu({
  item,
  onEdit,
  onDelete,
  onToggleActive,
  onToggleFeatured,
}: PastorsActionsMenuProps) {
  const isActive = item.isActive !== false;
  const isFeatured = item.isFeatured === true;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" onClick={e => e.stopPropagation()}>
          <MoreVertical className="h-4 w-4" />
          <span className="sr-only">Open menu for {item.name}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" onClick={e => e.stopPropagation()}>
        <DropdownMenuItem onClick={() => onEdit(item)}>Edit</DropdownMenuItem>
        <DropdownMenuItem onClick={() => onToggleActive(item)}>
          {isActive ? 'Mark inactive' : 'Mark active'}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onToggleFeatured(item)}>
          {isFeatured ? 'Remove featured' : 'Mark featured'}
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="text-destructive focus:text-destructive"
          onClick={() => onDelete(item)}>
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
