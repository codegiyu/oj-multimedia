'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQueryState, parseAsInteger, parseAsString } from 'nuqs';
import { AdminDashboardListLayout } from '@/components/section/admin/AdminDashboardListLayout';
import type { QuestionListItem } from '@/lib/types/community';
import type { ClickedRowDetails } from '@/components/general/TableRowDetailsDrawer';
import { AskAPastorDetailsDrawer } from './AskAPastorDetailsDrawer';
import { AskAPastorTableContent } from './AskAPastorTableContent';
import { AnswerAskAPastorModal } from './AnswerAskAPastorModal';
import { AssignPastorModal } from './AssignPastorModal';
import { RejectAskAPastorModal } from './RejectAskAPastorModal';
import { AskAPastorQuestionEditModal } from './AskAPastorQuestionEditModal';
import { ApprovalModal } from '@/components/section/admin/shared';
import { callApi } from '@/lib/services/callApi';
import { ASK_A_PASTOR_STATUS_FILTER_SELECT_OPTIONS } from '@/lib/constants/adminSelectOptions';
import { useAdminListSearch } from '@/lib/hooks/useAdminListSearch';
import { serializeAdminListUrlKey } from '@/lib/admin/adminListUrl';
import { useAdminListUrlRefresh } from '@/lib/hooks/useAdminListUrlRefresh';
import { useAdminCategoryFilterOptions } from '@/lib/hooks/useAdminCategoryFilterOptions';

export interface AskAPastorPageClientProps {
  pageTitle: string;
  pageDescription: string;
  questions: QuestionListItem[];
  totalPages: number;
  listError: string | null;
}

export function AskAPastorPageClient({
  pageTitle,
  pageDescription,
  questions,
  totalPages,
  listError,
}: AskAPastorPageClientProps) {
  const router = useRouter();
  const [page, setPage] = useQueryState('page', parseAsInteger.withDefault(1));
  const [searchQuery, setSearchQuery] = useQueryState('search', parseAsString.withDefault(''));
  const [filterStatus, setFilterStatus] = useQueryState('status', parseAsString.withDefault('all'));
  const [filterCategory, setFilterCategory] = useQueryState(
    'category',
    parseAsString.withDefault('all')
  );
  const categoryOptions = useAdminCategoryFilterOptions('question');
  const { onSearchChange, onSearchCommit } = useAdminListSearch(setSearchQuery, setPage);
  useAdminListUrlRefresh(
    serializeAdminListUrlKey({
      page,
      search: searchQuery,
      status: filterStatus,
      category: filterCategory,
    })
  );

  const [clickedRowDetails, setClickedRowDetails] = useState<
    ClickedRowDetails<QuestionListItem, string> | undefined
  >(undefined);

  const [answerTarget, setAnswerTarget] = useState<QuestionListItem | null>(null);
  const [assignTarget, setAssignTarget] = useState<QuestionListItem | null>(null);
  const [rejectTarget, setRejectTarget] = useState<QuestionListItem | null>(null);
  const [editQuestionId, setEditQuestionId] = useState<string | null>(null);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<QuestionListItem | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  const handleRefresh = () => router.refresh();

  const handleRowClick = (row: QuestionListItem, index: number) => {
    setClickedRowDetails({ data: row, index, tab: undefined });
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setActionLoading(true);
    try {
      const { error } = await callApi('ADMIN_ASK_PASTOR_DELETE', {
        query: `/${deleteTarget._id}` as `/${string}`,
      });
      if (error) throw new Error(error.message);
      setDeleteTarget(null);
      setClickedRowDetails(undefined);
      handleRefresh();
    } catch (err) {
      console.error('Delete failed:', err);
    } finally {
      setActionLoading(false);
    }
  };

  const handleEdit = (q: QuestionListItem) => {
    setEditQuestionId(q._id);
    setEditOpen(true);
  };

  return (
    <AdminDashboardListLayout
      title={pageTitle}
      description={pageDescription}
      onRefresh={handleRefresh}
      listError={listError}
      filterableDataPageProps={{
        searchPlaceholder: 'Search questions...',
        searchValue: searchQuery,
        onSearchChange,
        onSearchCommit,
        filters: [
          {
            label: 'Status',
            value: filterStatus,
            options: [...ASK_A_PASTOR_STATUS_FILTER_SELECT_OPTIONS],
            onChange: v => {
              setFilterStatus(v);
              setPage(1);
            },
          },
          {
            label: 'Category',
            value: filterCategory,
            options: categoryOptions,
            onChange: v => {
              setFilterCategory(v);
              setPage(1);
            },
          },
        ],
      }}
      extraContent={
        <>
          <AskAPastorDetailsDrawer
            clickedRowDetails={clickedRowDetails}
            setClickedRowDetails={setClickedRowDetails}
          />

          <AnswerAskAPastorModal
            open={!!answerTarget}
            onOpenChange={val => !val && setAnswerTarget(null)}
            question={answerTarget}
            onSuccess={handleRefresh}
          />

          <AssignPastorModal
            open={!!assignTarget}
            onOpenChange={val => !val && setAssignTarget(null)}
            question={assignTarget}
            onSuccess={handleRefresh}
          />

          <RejectAskAPastorModal
            open={!!rejectTarget}
            onOpenChange={val => !val && setRejectTarget(null)}
            question={rejectTarget}
            onSuccess={handleRefresh}
          />

          <AskAPastorQuestionEditModal
            open={editOpen}
            onOpenChange={open => {
              if (!open) setEditQuestionId(null);
              setEditOpen(open);
            }}
            questionId={editQuestionId}
            onSuccess={handleRefresh}
          />

          {deleteTarget && (
            <ApprovalModal
              open={!!deleteTarget}
              onOpenChange={val => !val && setDeleteTarget(null)}
              title="Delete question"
              description="Delete this question? This cannot be undone."
              confirmText="Delete"
              onConfirm={handleDelete}
              loading={actionLoading}
            />
          )}
        </>
      }>
      <AskAPastorTableContent
        questions={questions}
        loading={false}
        onRefresh={handleRefresh}
        onRowClick={handleRowClick}
        page={page}
        totalPages={totalPages}
        onPageChange={setPage}
        onAnswer={q => setAnswerTarget(q)}
        onAssign={q => setAssignTarget(q)}
        onEdit={handleEdit}
        onReject={q => setRejectTarget(q)}
        onDelete={q => setDeleteTarget(q)}
      />
    </AdminDashboardListLayout>
  );
}
