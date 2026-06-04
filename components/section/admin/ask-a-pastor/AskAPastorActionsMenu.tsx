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
        {canAnswer ? (
          <>
            <DropdownMenuActionItem
              icon={actionMenuIcons.answer}
              onClick={() => onAnswer(question)}>
              Answer
            </DropdownMenuActionItem>
            <DropdownMenuActionItem
              icon={actionMenuIcons.assignPastor}
              onClick={() => onAssign(question)}>
              Assign pastor
            </DropdownMenuActionItem>
          </>
        ) : null}
        <DropdownMenuActionItem icon={actionMenuIcons.edit} onClick={() => onEdit(question)}>
          Edit
        </DropdownMenuActionItem>
        {canAnswer ? (
          <DropdownMenuActionItem icon={actionMenuIcons.reject} onClick={() => onReject(question)}>
            Reject
          </DropdownMenuActionItem>
        ) : null}
        <DropdownMenuSeparator />
        <DropdownMenuActionItem
          icon={actionMenuIcons.delete}
          variant="destructive"
          onClick={() => onDelete(question)}>
          Delete
        </DropdownMenuActionItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
