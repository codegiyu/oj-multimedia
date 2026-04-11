'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQueryState, parseAsInteger, parseAsString } from 'nuqs';
import { AdminDashboardListLayout } from '@/components/section/admin/AdminDashboardListLayout';
import type { ArtistListItem } from '@/lib/types/community';
import type { PastorListItem } from '@/lib/types/community';
import type { ClickedRowDetails } from '@/components/general/TableRowDetailsDrawer';
import { ArtistsPastorsTableContent } from './ArtistsPastorsTableContent';
import { ArtistsPastorsDetailsDrawer } from './ArtistsPastorsDetailsDrawer';
import { CreateArtistModal } from './CreateArtistModal';
import { CreatePastorModal } from './CreatePastorModal';
import { ApprovalModal } from '@/components/section/admin/shared';
import { callApi } from '@/lib/services/callApi';
import { RegularBtn } from '@/components/atoms/RegularBtn';
import { Plus } from 'lucide-react';

const TAB_ARTISTS = 'artists';
// const TAB_PASTORS = 'pastors';

export interface ArtistsPastorsPageClientProps {
  pageTitle: string;
  pageDescription: string;
  artists: ArtistListItem[];
  pastors: PastorListItem[];
  totalPages: number;
  listError: string | null;
}

export function ArtistsPastorsPageClient({
  pageTitle,
  pageDescription,
  artists,
  pastors,
  totalPages,
  listError,
}: ArtistsPastorsPageClientProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useQueryState('tab', parseAsString.withDefault(TAB_ARTISTS));
  const [page, setPage] = useQueryState('page', parseAsInteger.withDefault(1));
  // const [pageSize] = useQueryState('pagesize', parseAsInteger.withDefault(DEFAULT_PAGE_SIZE));
  const [searchQuery, setSearchQuery] = useQueryState('search', parseAsString.withDefault(''));

  const [clickedRowDetails, setClickedRowDetails] = useState<
    ClickedRowDetails<ArtistListItem | PastorListItem, string> | undefined
  >(undefined);

  const [createArtistOpen, setCreateArtistOpen] = useState(false);
  const [createPastorOpen, setCreatePastorOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<ArtistListItem | PastorListItem | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  const handleRefresh = () => router.refresh();
  const handleRowClick = (row: ArtistListItem | PastorListItem) => {
    setClickedRowDetails({ data: row, index: 0, tab: activeTab });
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setActionLoading(true);
    try {
      const isArtist = '_id' in deleteTarget && 'name' in deleteTarget && 'slug' in deleteTarget;
      if (isArtist) {
        const { error } = await callApi('ADMIN_ARTIST_DELETE', {
          query: `/${deleteTarget._id}` as `/${string}`,
        });
        if (error) throw new Error(error.message);
      } else {
        const { error } = await callApi('ADMIN_PASTOR_DELETE', {
          query: `/${deleteTarget._id}` as `/${string}`,
        });
        if (error) throw new Error(error.message);
      }
      setDeleteTarget(null);
      setClickedRowDetails(undefined);
      handleRefresh();
    } catch (err) {
      console.error('Delete failed:', err);
    } finally {
      setActionLoading(false);
    }
  };

  const handleEdit = (row: ArtistListItem | PastorListItem) => {
    setClickedRowDetails({ data: row, index: -1, tab: activeTab });
  };

  const handleCreateClick = () => {
    if (activeTab === TAB_ARTISTS) setCreateArtistOpen(true);
    else setCreatePastorOpen(true);
  };

  return (
    <AdminDashboardListLayout
      title={pageTitle}
      description={pageDescription}
      pageHeaderActions={
        <RegularBtn
          LeftIcon={Plus}
          text={activeTab === TAB_ARTISTS ? 'Create Artist' : 'Create Pastor'}
          onClick={handleCreateClick}
        />
      }
      listError={listError}
      filterableDataPageProps={{
        searchPlaceholder: activeTab === TAB_ARTISTS ? 'Search artists...' : 'Search pastors...',
        searchValue: searchQuery,
        onSearchChange: setSearchQuery,
        onSearchApply: () => setPage(1),
      }}
      extraContent={
        <>
          <ArtistsPastorsDetailsDrawer
            clickedRowDetails={clickedRowDetails}
            setClickedRowDetails={setClickedRowDetails}
          />

          <CreateArtistModal
            open={createArtistOpen}
            onOpenChange={setCreateArtistOpen}
            onSuccess={handleRefresh}
          />
          <CreatePastorModal
            open={createPastorOpen}
            onOpenChange={setCreatePastorOpen}
            onSuccess={handleRefresh}
          />

          {deleteTarget && (
            <ApprovalModal
              open={!!deleteTarget}
              onOpenChange={val => !val && setDeleteTarget(null)}
              title="Delete"
              description={`Delete "${deleteTarget ? deleteTarget.name : 'this item'}"? This cannot be undone.`}
              confirmText="Delete"
              onConfirm={handleDelete}
              loading={actionLoading}
            />
          )}
        </>
      }>
      <ArtistsPastorsTableContent
        activeTab={activeTab}
        onTabChange={v => {
          setActiveTab(v);
          setPage(1);
        }}
        artists={artists}
        pastors={pastors}
        loading={false}
        onRefresh={handleRefresh}
        onRowClick={handleRowClick}
        page={page}
        totalPages={totalPages}
        onPageChange={setPage}
        onEdit={handleEdit}
        onDelete={setDeleteTarget}
      />
    </AdminDashboardListLayout>
  );
}
