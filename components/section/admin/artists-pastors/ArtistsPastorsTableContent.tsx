/* eslint-disable react-hooks/exhaustive-deps */
'use client';

import { useMemo } from 'react';
import {
  DataTable,
  DataTableCellWrapper,
  DataTableColumnHeader,
  type DataTableColumn,
  type DataTableTab,
} from '@/components/general/DataTable';
import type { ArtistListItem } from '@/lib/types/community';
import type { PastorListItem } from '@/lib/types/community';
import { ArtistsPastorsActionsMenu } from './ArtistsPastorsActionsMenu';
import { dashboardThumbnailColumn } from '@/components/general/dashboardTableThumbnailColumn';

function truncate(str: string, maxLen: number) {
  if (str.length <= maxLen) return str;
  return str.slice(0, maxLen).trim() + '…';
}

const TAB_ARTISTS = 'artists';
const TAB_PASTORS = 'pastors';

const ARTISTS_PASTORS_TABLE_TABS: DataTableTab[] = [
  { value: TAB_ARTISTS, label: 'Artists' },
  { value: TAB_PASTORS, label: 'Pastors' },
];

interface ArtistsPastorsTableContentProps {
  activeTab: string;
  onTabChange: (value: string) => void;
  artists: ArtistListItem[];
  pastors: PastorListItem[];
  loading: boolean;
  onRefresh: () => void;
  onRowClick: (row: ArtistListItem | PastorListItem) => void;
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onEdit: (row: ArtistListItem | PastorListItem) => void;
  onDelete: (row: ArtistListItem | PastorListItem) => void;
}

export function ArtistsPastorsTableContent(props: ArtistsPastorsTableContentProps) {
  const {
    activeTab,
    onTabChange,
    artists,
    pastors,
    loading,
    onRefresh,
    onRowClick,
    page,
    totalPages,
    onPageChange,
    onEdit,
    onDelete,
  } = props;

  const isArtists = activeTab === 'artists';
  const data = useMemo(() => (isArtists ? artists : pastors), [isArtists, artists, pastors]);

  const artistColumns = useMemo<DataTableColumn<ArtistListItem, unknown>[]>(
    () => [
      dashboardThumbnailColumn(
        row => row.image,
        row => row.name,
        {
          header: 'Photo',
          rounded: 'full',
        }
      ),
      {
        id: 'name',
        header: <DataTableColumnHeader title="Name" />,
        meta: { width: '25%' },
        cell: row => (
          <DataTableCellWrapper text={row.name}>{truncate(row.name, 30)}</DataTableCellWrapper>
        ),
      },
      {
        id: 'genre',
        header: <DataTableColumnHeader title="Genre" />,
        meta: { width: '20%' },
        cell: row => (
          <DataTableCellWrapper text={row.genre ?? '—'}>{row.genre ?? '—'}</DataTableCellWrapper>
        ),
      },
      {
        id: 'slug',
        header: <DataTableColumnHeader title="Slug" />,
        meta: { width: '25%' },
        cell: row => (
          <DataTableCellWrapper text={row.slug}>{truncate(row.slug, 25)}</DataTableCellWrapper>
        ),
      },
      {
        id: 'actions',
        header: null,
        meta: { width: '3rem' },
        cell: row => <ArtistsPastorsActionsMenu item={row} onEdit={onEdit} onDelete={onDelete} />,
      },
    ],
    []
  );

  const pastorColumns = useMemo<DataTableColumn<PastorListItem, unknown>[]>(
    () => [
      dashboardThumbnailColumn(
        row => row.image,
        row => row.name,
        {
          header: 'Photo',
          rounded: 'full',
        }
      ),
      {
        id: 'name',
        header: <DataTableColumnHeader title="Name" />,
        meta: { width: '22%' },
        cell: row => (
          <DataTableCellWrapper text={row.name}>{truncate(row.name, 28)}</DataTableCellWrapper>
        ),
      },
      {
        id: 'title',
        header: <DataTableColumnHeader title="Title" />,
        meta: { width: '18%' },
        cell: row => (
          <DataTableCellWrapper text={row.title ?? '—'}>{row.title ?? '—'}</DataTableCellWrapper>
        ),
      },
      {
        id: 'church',
        header: <DataTableColumnHeader title="Church" />,
        meta: { width: '22%' },
        cell: row => (
          <DataTableCellWrapper text={row.church ?? '—'}>
            {truncate(row.church ?? '—', 25)}
          </DataTableCellWrapper>
        ),
      },
      {
        id: 'actions',
        header: null,
        meta: { width: '3rem' },
        cell: row => <ArtistsPastorsActionsMenu item={row} onEdit={onEdit} onDelete={onDelete} />,
      },
    ],
    []
  );

  const columns = (isArtists ? artistColumns : pastorColumns) as DataTableColumn<
    ArtistListItem | PastorListItem,
    unknown
  >[];

  return (
    <DataTable<ArtistListItem | PastorListItem>
      tabs={ARTISTS_PASTORS_TABLE_TABS}
      activeTab={activeTab}
      onTabChange={onTabChange}
      tabsShowNavigation={false}
      data={data}
      columns={columns}
      loading={loading}
      onRefresh={onRefresh}
      showRefreshButton={false}
      emptyStateWord={isArtists ? 'artists' : 'pastors'}
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
