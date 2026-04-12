'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQueryState, parseAsInteger, parseAsString } from 'nuqs';
import { AdminDashboardListLayout } from '@/components/section/admin/AdminDashboardListLayout';
import type { IGospelVerse } from '@/lib/types/server-models';
import type { ClickedRowDetails } from '@/components/general/TableRowDetailsDrawer';
import { GospelVerseDetailsDrawer } from './GospelVerseDetailsDrawer';
import { GospelVersesTableContent } from './GospelVersesTableContent';

const statusOptions = [
  { text: 'All', value: 'all' },
  { text: 'Active', value: 'active' },
  { text: 'Inactive', value: 'inactive' },
];

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

  const [clickedRowDetails, setClickedRowDetails] = useState<
    ClickedRowDetails<IGospelVerse, string> | undefined
  >(undefined);

  const handleRefresh = () => router.refresh();

  const handleRowClick = (row: IGospelVerse, index: number) => {
    setClickedRowDetails({ data: row, index, tab: undefined });
  };

  return (
    <AdminDashboardListLayout
      title={pageTitle}
      description={pageDescription}
      listError={listError}
      filterableDataPageProps={{
        searchPlaceholder: 'Search by reference or verse text...',
        searchValue: searchQuery,
        onSearchChange: setSearchQuery,
        onSearchApply: () => setPage(1),
        filters: [
          {
            label: 'Status',
            value: filterStatus,
            options: statusOptions,
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
