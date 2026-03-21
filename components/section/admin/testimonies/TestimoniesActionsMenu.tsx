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
import type { TestimonyListItem } from '@/lib/types/community';

interface TestimoniesActionsMenuProps {
  testimony: TestimonyListItem;
  onApprove: (testimony: TestimonyListItem) => void;
  onReject: (testimony: TestimonyListItem) => void;
  onEdit: (testimony: TestimonyListItem) => void;
  onDelete: (testimony: TestimonyListItem) => void;
}

export function TestimoniesActionsMenu({
  testimony,
  onApprove,
  onReject,
  onEdit,
  onDelete,
}: TestimoniesActionsMenuProps) {
  const status = (testimony as { status?: string }).status;
  const canApprove = status === 'draft' || status === 'archived';

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" onClick={e => e.stopPropagation()}>
          <MoreVertical className="h-4 w-4" />
          <span className="sr-only">Open menu for testimony by {testimony.author}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" onClick={e => e.stopPropagation()}>
        {canApprove && (
          <DropdownMenuItem onClick={() => onApprove(testimony)}>Approve</DropdownMenuItem>
        )}
        {canApprove && (
          <DropdownMenuItem onClick={() => onReject(testimony)}>Reject</DropdownMenuItem>
        )}
        <DropdownMenuItem onClick={() => onEdit(testimony)}>Edit</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="text-destructive focus:text-destructive"
          onClick={() => onDelete(testimony)}>
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
