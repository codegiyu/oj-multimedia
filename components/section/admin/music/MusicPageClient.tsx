/* eslint-disable react-hooks/exhaustive-deps */
'use client';

import { useState, useEffect, useRef } from 'react';
import { useQueryState, parseAsInteger, parseAsString } from 'nuqs';
import { FilterableDataPage } from '@/components/general/FilterableDataPage';
import { DEFAULT_PAGE_SIZE } from '@/components/general/DataTable';
import type { ArtistMusicListItem } from '@/lib/constants/endpoints';
import type { ClickedRowDetails } from '@/components/general/TableRowDetailsDrawer';
import { MusicDetailsDrawer } from './MusicDetailsDrawer';
import { MusicTableContent } from './MusicTableContent';
import { CreateMusicModal } from './CreateMusicModal';
import { ApprovalModal, RejectModal } from '@/components/section/admin/shared';
import { callApi } from '@/lib/services/callApi';
import { RegularBtn } from '@/components/atoms/RegularBtn';
import { Plus } from 'lucide-react';

const SEARCH_DEBOUNCE_MS = 300;

const statusOptions = [
  { text: 'All', value: 'all' },
  { text: 'Draft', value: 'draft' },
  { text: 'Published', value: 'published' },
  { text: 'Archived', value: 'archived' },
];

export function MusicPageClient() {
  const [page, setPage] = useQueryState('page', parseAsInteger.withDefault(1));
  const [pageSize] = useQueryState('pagesize', parseAsInteger.withDefault(DEFAULT_PAGE_SIZE));
  const [searchQuery, setSearchQuery] = useQueryState('search', parseAsString.withDefault(''));
  const [filterStatus, setFilterStatus] = useQueryState('status', parseAsString.withDefault('all'));
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [refreshKey, setRefreshKey] = useState(0);
  const [clickedRowDetails, setClickedRowDetails] = useState<
    ClickedRowDetails<ArtistMusicListItem, string> | undefined
  >(undefined);

  const [music, setMusic] = useState<ArtistMusicListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);

  const [createOpen, setCreateOpen] = useState(false);
  const [approveTarget, setApproveTarget] = useState<ArtistMusicListItem | null>(null);
  const [rejectTarget, setRejectTarget] = useState<ArtistMusicListItem | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<ArtistMusicListItem | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchMusic = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.append('page', String(page));
      params.append('limit', String(pageSize));
      params.append('sort', '-createdAt');
      if (searchQuery.trim()) params.append('search', searchQuery.trim());
      if (filterStatus && filterStatus !== 'all') params.append('status', filterStatus);
      const { data, error } = await callApi('ADMIN_MUSIC_LIST', {
        query: `?${params.toString()}` as `?${string}`,
      });
      if (error) {
        setMusic([]);
        setTotalPages(1);
        return;
      }
      const items = (data as { music?: ArtistMusicListItem[] })?.music ?? [];
      const pagination = (data as { pagination?: { totalPages?: number } })?.pagination;
      setMusic(items);
      setTotalPages(pagination?.totalPages ?? 1);
    } catch {
      setMusic([]);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    debounceRef.current = setTimeout(() => fetchMusic(), SEARCH_DEBOUNCE_MS);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [refreshKey]);

  const handleRefresh = () => setRefreshKey(k => k + 1);
  const handleRowClick = (row: ArtistMusicListItem, index: number) => {
    setClickedRowDetails({ data: row, index, tab: undefined });
  };

  const handleApprove = async () => {
    if (!approveTarget) return;
    setActionLoading(true);
    try {
      const { error } = await callApi('ADMIN_MUSIC_APPROVE', {
        query: `/${approveTarget._id}/approve` as `/${string}`,
      });
      if (error) throw new Error(error.message);
      setApproveTarget(null);
      handleRefresh();
    } catch (err) {
      console.error('Approve failed:', err);
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async (reason: string) => {
    if (!rejectTarget) return;
    setActionLoading(true);
    try {
      const { error } = await callApi('ADMIN_MUSIC_REJECT', {
        query: `/${rejectTarget._id}/reject` as `/${string}`,
        payload: { reason },
      });
      if (error) throw new Error(error.message);
      setRejectTarget(null);
      handleRefresh();
    } catch (err) {
      console.error('Reject failed:', err);
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setActionLoading(true);
    try {
      const { error } = await callApi('ADMIN_MUSIC_DELETE', {
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

  const handleEdit = (m: ArtistMusicListItem) => {
    setClickedRowDetails({ data: m, index: -1, tab: undefined });
  };

  return (
    <section className="h-full grid grid-rows-[auto_1fr] gap-4 sm:gap-6 overflow-hidden">
      <section className="grid gap-4 sm:gap-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex-1 min-w-0">
            <FilterableDataPage
              searchPlaceholder="Search music..."
              searchValue={searchQuery}
              onSearchChange={setSearchQuery}
              onSearchApply={() => setPage(1)}
              filters={[
                {
                  label: 'Status',
                  value: filterStatus,
                  options: statusOptions,
                  onChange: v => {
                    setFilterStatus(v);
                    setPage(1);
                  },
                },
              ]}
              onApplyFilters={() => setPage(1)}
            />
          </div>
          <RegularBtn LeftIcon={Plus} text="Create Music" onClick={() => setCreateOpen(true)} />
        </div>
      </section>

      <MusicTableContent
        music={music}
        loading={loading}
        onRefresh={handleRefresh}
        onRowClick={handleRowClick}
        page={page}
        totalPages={totalPages}
        onPageChange={setPage}
        onApprove={m => setApproveTarget(m)}
        onReject={m => setRejectTarget(m)}
        onEdit={handleEdit}
        onDelete={m => setDeleteTarget(m)}
      />

      <MusicDetailsDrawer
        clickedRowDetails={clickedRowDetails}
        setClickedRowDetails={setClickedRowDetails}
      />

      <CreateMusicModal open={createOpen} onOpenChange={setCreateOpen} onSuccess={handleRefresh} />

      <ApprovalModal
        open={!!approveTarget}
        onOpenChange={val => !val && setApproveTarget(null)}
        title="Approve music"
        description={approveTarget ? `Publish "${approveTarget.title}"?` : ''}
        confirmText="Approve"
        onConfirm={handleApprove}
        loading={actionLoading}
      />

      <RejectModal
        open={!!rejectTarget}
        onOpenChange={val => !val && setRejectTarget(null)}
        title="Reject music"
        description={rejectTarget ? `Reject "${rejectTarget.title}"?` : ''}
        onConfirm={handleReject}
        loading={actionLoading}
      />

      {deleteTarget && (
        <ApprovalModal
          open={!!deleteTarget}
          onOpenChange={val => !val && setDeleteTarget(null)}
          title="Delete music"
          description={deleteTarget ? `Delete "${deleteTarget.title}"? This cannot be undone.` : ''}
          confirmText="Delete"
          onConfirm={handleDelete}
          loading={actionLoading}
        />
      )}
    </section>
  );
}
