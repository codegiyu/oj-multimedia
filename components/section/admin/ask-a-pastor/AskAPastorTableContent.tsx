'use client';

import { useMemo } from 'react';
import {
  DataTable,
  DataTableCellWrapper,
  DataTableColumnHeader,
  type DataTableColumn,
} from '@/components/general/DataTable';
import { Badge } from '@/components/ui/badge';
import type { QuestionListItem } from '@/lib/types/community';
import { AskAPastorActionsMenu } from './AskAPastorActionsMenu';

function truncate(str: string, maxLen: number) {
  if (str.length <= maxLen) return str;
  return str.slice(0, maxLen).trim() + '…';
}

function StatusBadge({ status }: { status?: string }) {
  const variant = status === 'answered' ? 'default' : 'secondary';
  return <Badge variant={variant}>{status ?? '—'}</Badge>;
}

interface AskAPastorTableContentProps {
  questions: QuestionListItem[];
  loading: boolean;
  onRefresh: () => void;
  onRowClick: (row: QuestionListItem, index: number) => void;
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onAnswer: (question: QuestionListItem) => void;
  onAssign: (question: QuestionListItem) => void;
  onEdit: (question: QuestionListItem) => void;
  onReject: (question: QuestionListItem) => void;
  onDelete: (question: QuestionListItem) => void;
}

export function AskAPastorTableContent({
  questions,
  loading,
  onRefresh,
  onRowClick,
  page,
  totalPages,
  onPageChange,
  onAnswer,
  onAssign,
  onEdit,
  onReject,
  onDelete,
}: AskAPastorTableContentProps) {
  const columns = useMemo<DataTableColumn<QuestionListItem, unknown>[]>(
    () => [
      {
        id: 'question',
        header: <DataTableColumnHeader title="Question" />,
        meta: { width: '28%' },
        cell: row => (
          <DataTableCellWrapper text={row.question}>
            {truncate(row.question, 48)}
          </DataTableCellWrapper>
        ),
      },
      {
        id: 'author',
        header: <DataTableColumnHeader title="Author" />,
        meta: { width: '14%' },
        cell: row => (
          <DataTableCellWrapper text={row.author}>{truncate(row.author, 22)}</DataTableCellWrapper>
        ),
      },
      {
        id: 'status',
        header: <DataTableColumnHeader title="Status" />,
        meta: { width: '10%' },
        cell: row => (
          <DataTableCellWrapper>
            <StatusBadge status={(row as QuestionListItem & { status?: string }).status} />
          </DataTableCellWrapper>
        ),
      },
      {
        id: 'pastor',
        header: <DataTableColumnHeader title="Pastor" />,
        meta: { width: '14%' },
        cell: row => {
          const pastorName =
            typeof row.pastor === 'object' && row.pastor && 'name' in row.pastor
              ? String((row.pastor as { name?: string }).name ?? '')
              : typeof row.pastor === 'string'
                ? row.pastor
                : '—';

          return <DataTableCellWrapper text={pastorName}>{pastorName || '—'}</DataTableCellWrapper>;
        },
      },
      {
        id: 'timeAgo',
        header: <DataTableColumnHeader title="Posted" />,
        meta: { width: '10rem' },
        cell: row => <DataTableCellWrapper text={row.timeAgo}>{row.timeAgo}</DataTableCellWrapper>,
      },
      {
        id: 'actions',
        header: null,
        meta: { width: '3rem' },
        cell: row => (
          <AskAPastorActionsMenu
            question={row}
            onAnswer={onAnswer}
            onAssign={onAssign}
            onEdit={onEdit}
            onReject={onReject}
            onDelete={onDelete}
          />
        ),
      },
    ],
    [onAnswer, onAssign, onEdit, onReject, onDelete]
  );

  return (
    <DataTable<QuestionListItem>
      data={questions}
      columns={columns}
      loading={loading}
      onRefresh={onRefresh}
      showRefreshButton={false}
      emptyStateWord="questions"
      pagination={{
        currentPage: page,
        totalPages: totalPages || 1,
        onPageChange,
      }}
      getRowId={row => row._id}
      onRowClick={onRowClick}
    />
  );
}
