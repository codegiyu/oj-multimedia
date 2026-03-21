/* eslint-disable react-hooks/exhaustive-deps */
'use client';

import { useState, useEffect, useRef } from 'react';
import { useQueryState, parseAsInteger, parseAsString } from 'nuqs';
import { FilterableDataPage } from '@/components/general/FilterableDataPage';
import { DEFAULT_PAGE_SIZE } from '@/components/general/DataTable';
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
import { Tabs, TabsList } from '@/components/ui/tabs';

const SEARCH_DEBOUNCE_MS = 300;

const TAB_ARTISTS = 'artists';
const TAB_PASTORS = 'pastors';

export function ArtistsPastorsPageClient() {
  const [activeTab, setActiveTab] = useQueryState('tab', parseAsString.withDefault(TAB_ARTISTS));
  const [page, setPage] = useQueryState('page', parseAsInteger.withDefault(1));
  const [pageSize] = useQueryState('pagesize', parseAsInteger.withDefault(DEFAULT_PAGE_SIZE));
  const [searchQuery, setSearchQuery] = useQueryState('search', parseAsString.withDefault(''));
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [refreshKey, setRefreshKey] = useState(0);
  const [clickedRowDetails, setClickedRowDetails] = useState<
    ClickedRowDetails<ArtistListItem | PastorListItem, string> | undefined
  >(undefined);

  const [artists, setArtists] = useState<ArtistListItem[]>([]);
  const [pastors, setPastors] = useState<PastorListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);

  const [createArtistOpen, setCreateArtistOpen] = useState(false);
  const [createPastorOpen, setCreatePastorOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<ArtistListItem | PastorListItem | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchArtists = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.append('page', String(page));
      params.append('limit', String(pageSize));
      params.append('sort', '-createdAt');
      if (searchQuery.trim()) params.append('search', searchQuery.trim());
      const { data, error } = await callApi('ADMIN_ARTISTS_LIST', {
        query: `?${params.toString()}` as `?${string}`,
      });
      if (error) {
        setArtists([]);
        setTotalPages(1);
        return;
      }
      const items = (data as { artists?: ArtistListItem[] })?.artists ?? [];
      const pagination = (data as { pagination?: { totalPages?: number } })?.pagination;
      setArtists(items);
      setTotalPages(pagination?.totalPages ?? 1);
    } catch {
      setArtists([]);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };

  const fetchPastors = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.append('page', String(page));
      params.append('limit', String(pageSize));
      params.append('sort', '-createdAt');
      if (searchQuery.trim()) params.append('search', searchQuery.trim());
      const { data, error } = await callApi('ADMIN_PASTORS_LIST', {
        query: `?${params.toString()}` as `?${string}`,
      });
      if (error) {
        setPastors([]);
        setTotalPages(1);
        return;
      }
      const items = (data as { pastors?: PastorListItem[] })?.pastors ?? [];
      const pagination = (data as { pagination?: { totalPages?: number } })?.pagination;
      setPastors(items);
      setTotalPages(pagination?.totalPages ?? 1);
    } catch {
      setPastors([]);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    debounceRef.current = setTimeout(() => {
      if (activeTab === TAB_ARTISTS) fetchArtists();
      else fetchPastors();
    }, SEARCH_DEBOUNCE_MS);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [activeTab, refreshKey]);

  const handleRefresh = () => setRefreshKey(k => k + 1);
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
    <section className="h-full grid grid-rows-[auto_1fr] gap-4 sm:gap-6 overflow-hidden">
      <section className="grid gap-4 sm:gap-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex-1 min-w-0 space-y-4">
            <Tabs
              value={activeTab}
              onValueChange={v => {
                setActiveTab(v);
                setPage(1);
              }}>
              <TabsList
                tabs={[
                  { value: TAB_ARTISTS, label: 'Artists' },
                  { value: TAB_PASTORS, label: 'Pastors' },
                ]}
                showNavigation={false}
              />
            </Tabs>
            <FilterableDataPage
              searchPlaceholder={
                activeTab === TAB_ARTISTS ? 'Search artists...' : 'Search pastors...'
              }
              searchValue={searchQuery}
              onSearchChange={setSearchQuery}
              onSearchApply={() => setPage(1)}
            />
          </div>
          <RegularBtn
            LeftIcon={Plus}
            text={activeTab === TAB_ARTISTS ? 'Create Artist' : 'Create Pastor'}
            onClick={handleCreateClick}
          />
        </div>
      </section>

      <ArtistsPastorsTableContent
        activeTab={activeTab}
        artists={artists}
        pastors={pastors}
        loading={loading}
        onRefresh={handleRefresh}
        onRowClick={handleRowClick}
        page={page}
        totalPages={totalPages}
        onPageChange={setPage}
        onEdit={handleEdit}
        onDelete={setDeleteTarget}
      />

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
    </section>
  );
}
