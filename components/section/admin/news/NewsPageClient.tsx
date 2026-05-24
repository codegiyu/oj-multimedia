'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQueryState, parseAsInteger, parseAsString } from 'nuqs';
import { AdminDashboardListLayout } from '@/components/section/admin/AdminDashboardListLayout';
import type { PublicNewsListItem } from '@/lib/constants/endpoints';
import type { ClickedRowDetails } from '@/components/general/TableRowDetailsDrawer';
import { NewsDetailsDrawer } from './NewsDetailsDrawer';
import { NewsTableContent } from './NewsTableContent';
import { CreateNewsModal } from './CreateNewsModal';
import { ApprovalModal } from '@/components/section/admin/shared';
import { callApi } from '@/lib/services/callApi';
import { RegularBtn } from '@/components/atoms/RegularBtn';
import { Plus } from 'lucide-react';
import { PUBLISHABLE_STATUS_FILTER_SELECT_OPTIONS } from '@/lib/constants/adminSelectOptions';
import type { SelectOption } from '@/lib/types/general';
import { loadAdminContentCategorySelectOptions } from '@/lib/utils/adminContentCategorySelect';
import { useAdminListSearch } from '@/lib/hooks/useAdminListSearch';

export interface NewsPageClientProps {
  pageTitle: string;
  pageDescription: string;
  news: PublicNewsListItem[];
  totalPages: number;
  listError: string | null;
}

export function NewsPageClient({
  pageTitle,
  pageDescription,
  news,
  totalPages,
  listError,
}: NewsPageClientProps) {
  const router = useRouter();
  const [page, setPage] = useQueryState('page', parseAsInteger.withDefault(1));
  // const [pageSize] = useQueryState('pagesize', parseAsInteger.withDefault(DEFAULT_PAGE_SIZE));
  const [searchQuery, setSearchQuery] = useQueryState('search', parseAsString.withDefault(''));
  const [filterStatus, setFilterStatus] = useQueryState('status', parseAsString.withDefault('all'));
  const [filterCategory, setFilterCategory] = useQueryState(
    'category',
    parseAsString.withDefault('all')
  );
  const [categoryOptions, setCategoryOptions] = useState<SelectOption[]>([
    { text: 'All', value: 'all' },
  ]);

  useEffect(() => {
    void loadAdminContentCategorySelectOptions('news').then(options => {
      setCategoryOptions([{ text: 'All', value: 'all' }, ...options.filter(o => o.value)]);
    });
  }, []);

  const [clickedRowDetails, setClickedRowDetails] = useState<
    ClickedRowDetails<PublicNewsListItem, string> | undefined
  >(undefined);

  const [createOpen, setCreateOpen] = useState(false);
  const [editNewsId, setEditNewsId] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<PublicNewsListItem | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const { onSearchChange, onSearchCommit } = useAdminListSearch(setSearchQuery, setPage);

  const handleRefresh = () => router.refresh();

  const handleRowClick = (row: PublicNewsListItem, index: number) => {
    setClickedRowDetails({ data: row, index, tab: undefined });
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setActionLoading(true);
    try {
      const { error } = await callApi('ADMIN_NEWS_DELETE', {
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

  const handleEdit = (n: PublicNewsListItem) => {
    setEditNewsId(n._id);
    setCreateOpen(true);
  };

  return (
    <AdminDashboardListLayout
      title={pageTitle}
      description={pageDescription}
      onRefresh={handleRefresh}
      pageHeaderActions={
        <RegularBtn
          LeftIcon={Plus}
          text="Create News"
          onClick={() => {
            setEditNewsId(null);
            setCreateOpen(true);
          }}
        />
      }
      listError={listError}
      filterableDataPageProps={{
        searchPlaceholder: 'Search news...',
        searchValue: searchQuery,
        onSearchChange,
        onSearchCommit,
        filters: [
          {
            label: 'Status',
            value: filterStatus,
            options: [...PUBLISHABLE_STATUS_FILTER_SELECT_OPTIONS],
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
        onApplyFilters: () => setPage(1),
      }}
      extraContent={
        <>
          <NewsDetailsDrawer
            clickedRowDetails={clickedRowDetails}
            setClickedRowDetails={setClickedRowDetails}
          />

          <CreateNewsModal
            open={createOpen}
            onOpenChange={open => {
              if (!open) setEditNewsId(null);
              setCreateOpen(open);
            }}
            editId={editNewsId}
            onSuccess={handleRefresh}
          />

          {deleteTarget && (
            <ApprovalModal
              open={!!deleteTarget}
              onOpenChange={val => !val && setDeleteTarget(null)}
              title="Delete news article"
              description={
                deleteTarget ? `Delete "${deleteTarget.title}"? This cannot be undone.` : ''
              }
              confirmText="Delete"
              onConfirm={handleDelete}
              loading={actionLoading}
            />
          )}
        </>
      }>
      <NewsTableContent
        news={news}
        loading={false}
        onRefresh={handleRefresh}
        onRowClick={handleRowClick}
        page={page}
        totalPages={totalPages}
        onPageChange={setPage}
        onEdit={handleEdit}
        onDelete={m => setDeleteTarget(m)}
      />
    </AdminDashboardListLayout>
  );
}
