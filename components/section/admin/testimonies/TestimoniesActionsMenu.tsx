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
        {canApprove ? (
          <DropdownMenuActionItem
            icon={actionMenuIcons.approve}
            onClick={() => onApprove(testimony)}>
            Approve
          </DropdownMenuActionItem>
        ) : null}
        {canApprove ? (
          <DropdownMenuActionItem icon={actionMenuIcons.reject} onClick={() => onReject(testimony)}>
            Reject
          </DropdownMenuActionItem>
        ) : null}
        <DropdownMenuActionItem icon={actionMenuIcons.edit} onClick={() => onEdit(testimony)}>
          Edit
        </DropdownMenuActionItem>
        <DropdownMenuSeparator />
        <DropdownMenuActionItem
          icon={actionMenuIcons.delete}
          variant="destructive"
          onClick={() => onDelete(testimony)}>
          Delete
        </DropdownMenuActionItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
