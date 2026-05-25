'use client';

import { useRouter } from 'next/navigation';
import { useQueryState, parseAsInteger, parseAsString } from 'nuqs';
import { AdminDashboardListLayout } from '@/components/section/admin/AdminDashboardListLayout';
import type { IGospelVerse } from '@/lib/types/server-models';
import { GospelVerseDetailsDrawer } from './GospelVerseDetailsDrawer';
import { GospelVersesTableContent } from './GospelVersesTableContent';
import { GOSPEL_VERSE_STATUS_FILTER_SELECT_OPTIONS } from '@/lib/constants/adminSelectOptions';
import { useAdminListSearch } from '@/lib/hooks/useAdminListSearch';
import { serializeAdminListUrlKey } from '@/lib/admin/adminListUrl';
import { useAdminListUrlRefresh } from '@/lib/hooks/useAdminListUrlRefresh';
import { useAdminListRecordId } from '@/lib/hooks/useAdminListRecordId';
import { useAdminRecordIdDrawer } from '@/lib/hooks/useAdminRecordIdDrawer';

export interface GospelVersesPageClientProps {
  pageTitle: string;
  pageDescription: string;
  gospelVerses: IGospelVerse[];
  totalPages: number;
  listError: string | null;
}

export function GospelVersesPageClient({
  pageTitle,
  pageDescription,
  gospelVerses,
  totalPages,
  listError,
}: GospelVersesPageClientProps) {
  const router = useRouter();
  const [page, setPage] = useQueryState('page', parseAsInteger.withDefault(1));
  const [searchQuery, setSearchQuery] = useQueryState('search', parseAsString.withDefault(''));
  const [filterStatus, setFilterStatus] = useQueryState('status', parseAsString.withDefault('all'));
  const { onSearchChange, onSearchCommit } = useAdminListSearch(setSearchQuery, setPage);
  useAdminListUrlRefresh(
    serializeAdminListUrlKey({ page, search: searchQuery, status: filterStatus })
  );
  const { recordId, setRecordId, clearRecordId } = useAdminListRecordId();
  const { clickedRowDetails, setClickedRowDetails, handleRowClick } = useAdminRecordIdDrawer({
    rows: gospelVerses,
    recordId,
    setRecordId,
    clearRecordId,
  });

  const handleRefresh = () => router.refresh();

  return (
    <AdminDashboardListLayout
      title={pageTitle}
      description={pageDescription}
      onRefresh={handleRefresh}
      listError={listError}
      filterableDataPageProps={{
        searchPlaceholder: 'Search by reference or verse text...',
        searchValue: searchQuery,
        onSearchChange,
        onSearchCommit,
        filters: [
          {
            label: 'Status',
            value: filterStatus,
            options: [...GOSPEL_VERSE_STATUS_FILTER_SELECT_OPTIONS],
            onChange: v => {
              setFilterStatus(v);
              setPage(1);
            },
          },
        ],
        onApplyFilters: () => setPage(1),
      }}
      extraContent={
        <GospelVerseDetailsDrawer
          clickedRowDetails={clickedRowDetails}
          setClickedRowDetails={setClickedRowDetails}
        />
      }>
      <GospelVersesTableContent
        gospelVerses={gospelVerses}
        loading={false}
        onRefresh={handleRefresh}
        onRowClick={handleRowClick}
        page={page}
        totalPages={totalPages}
        onPageChange={setPage}
      />
    </AdminDashboardListLayout>
  );
}
