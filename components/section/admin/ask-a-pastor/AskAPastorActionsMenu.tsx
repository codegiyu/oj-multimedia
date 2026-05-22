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
import type { QuestionListItem } from '@/lib/types/community';

interface AskAPastorActionsMenuProps {
  question: QuestionListItem;
  onAnswer: (question: QuestionListItem) => void;
  onAssign: (question: QuestionListItem) => void;
  onEdit: (question: QuestionListItem) => void;
  onReject: (question: QuestionListItem) => void;
  onDelete: (question: QuestionListItem) => void;
}

export function AskAPastorActionsMenu({
  question,
  onAnswer,
  onAssign,
  onEdit,
  onReject,
  onDelete,
}: AskAPastorActionsMenuProps) {
  const status = (question as QuestionListItem & { status?: string }).status;
  const canAnswer = status !== 'answered';

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" onClick={e => e.stopPropagation()}>
          <MoreVertical className="h-4 w-4" />
          <span className="sr-only">Open menu for question</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" onClick={e => e.stopPropagation()}>
        {canAnswer && (
          <>
            <DropdownMenuItem onClick={() => onAnswer(question)}>Answer</DropdownMenuItem>
            <DropdownMenuItem onClick={() => onAssign(question)}>Assign pastor</DropdownMenuItem>
          </>
        )}
        <DropdownMenuItem onClick={() => onEdit(question)}>Edit</DropdownMenuItem>
        {canAnswer && (
          <DropdownMenuItem onClick={() => onReject(question)}>Reject</DropdownMenuItem>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="text-destructive focus:text-destructive"
          onClick={() => onDelete(question)}>
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
