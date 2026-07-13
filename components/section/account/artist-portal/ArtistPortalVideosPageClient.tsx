'use client';

import { useEffect, useRef, useState } from 'react';
import { useQueryState, parseAsInteger, parseAsString } from 'nuqs';
import { DashboardPageHeader } from '@/components/layout/user-dashboard';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { callApi } from '@/lib/services/callApi';
import type { ArtistVideoListItem } from '@/lib/constants/endpoints';
import { Video, Loader2, MessageCircle, Plus, Pencil } from 'lucide-react';
import { ArtistVideoFormModalDynamic } from './ArtistVideoFormModalDynamic';
import { ArtistContentMonetizationBadge } from './ArtistContentMonetizationBadge';
import { DashboardThumbnail } from '@/components/general/DashboardThumbnail';
import { SectionEmptyState } from '@/components/general/SectionEmptyState';
import { FilterableDataPage } from '@/components/general/FilterableDataPage';
import {
  buildAccountArtistContentQuery,
  isAccountListUnfiltered,
} from '@/lib/account/accountListFilters';
import { useAccountListSearch } from '@/lib/hooks/useAccountListSearch';

const STATUS_FILTERS: Array<{ value: '' | 'draft' | 'published' | 'archived'; label: string }> = [
  { value: '', label: 'All' },
  { value: 'draft', label: 'Draft' },
  { value: 'published', label: 'Published' },
  { value: 'archived', label: 'Archived' },
];

export interface ArtistPortalVideosPageClientProps {
  initialVideos: ArtistVideoListItem[];
  initialTotalPages: number;
  initialErrorMessage: string | null;
}

export function ArtistPortalVideosPageClient({
  initialVideos,
  initialTotalPages,
  initialErrorMessage,
}: ArtistPortalVideosPageClientProps) {
  const [videos, setVideos] = useState<ArtistVideoListItem[]>(initialVideos);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(initialErrorMessage);
  const [page, setPage] = useQueryState('page', parseAsInteger.withDefault(1));
  const [pageSize] = useQueryState('pagesize', parseAsInteger.withDefault(10));
  const [status, setStatus] = useQueryState('status', parseAsString.withDefault(''));
  const [searchQuery, setSearchQuery] = useQueryState('search', parseAsString.withDefault(''));
  const { onSearchChange, onSearchCommit } = useAccountListSearch(setSearchQuery, setPage);
  const [totalPages, setTotalPages] = useState(initialTotalPages);
  const [reloadIndex, setReloadIndex] = useState(0);
  const [formOpen, setFormOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const didMountRef = useRef(false);

  const openCreate = () => {
    setEditId(null);
    setFormOpen(true);
  };

  const openEdit = (id: string) => {
    setEditId(id);
    setFormOpen(true);
  };

  const handleFormSuccess = () => {
    setReloadIndex(prev => prev + 1);
  };

  useEffect(() => {
    if (!didMountRef.current) {
      didMountRef.current = true;
      return;
    }

    let cancelled = false;

    const loadVideos = async () => {
      setLoading(true);
      const query = `?${buildAccountArtistContentQuery({
        page,
        pageSize,
        search: searchQuery,
        status,
      }).toString()}` as const;

      const { data, error, message } = await callApi('ARTIST_GET_VIDEOS', {
        query,
      });

      if (cancelled) return;

      if (error || !data) {
        setVideos([]);
        setTotalPages(1);
        setErrorMessage(message || 'Unable to load videos.');
      } else {
        setVideos(data.videos);
        setTotalPages(data.pagination?.totalPages ?? 1);
        setErrorMessage(null);
      }

      setLoading(false);
    };

    void loadVideos();

    return () => {
      cancelled = true;
    };
  }, [page, pageSize, status, searchQuery, reloadIndex]);

  const showOnboardingEmpty = isAccountListUnfiltered(searchQuery, status);

  return (
    <div className="relative space-y-6">
      {loading ? (
        <div className="absolute inset-0 z-10 flex items-start justify-center bg-background/60 pt-24">
          <Loader2 className="h-8 w-8 animate-spin text-primary" aria-hidden />
        </div>
      ) : null}

      <DashboardPageHeader
        title="My videos"
        description="Create drafts here or message the team for help publishing">
        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            className="rounded-full bg-primary hover:bg-primary/90 gap-2"
            onClick={openCreate}>
            <Plus className="h-4 w-4" />
            Add video
          </Button>
          <Button asChild variant="outline" className="rounded-full gap-2">
            <Link href="/account/artist-portal/upload">
              <MessageCircle className="h-4 w-4" />
              Message team
            </Link>
          </Button>
        </div>
      </DashboardPageHeader>

      <ArtistVideoFormModalDynamic
        open={formOpen}
        onOpenChange={setFormOpen}
        editId={editId}
        onSuccess={handleFormSuccess}
      />

      {errorMessage && (
        <div className="rounded-md border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive flex items-center justify-between gap-4">
          <span>{errorMessage}</span>
          <Button
            variant="outline"
            size="sm"
            className="border-destructive text-destructive hover:bg-destructive/10"
            onClick={() => setReloadIndex(prev => prev + 1)}>
            Retry
          </Button>
        </div>
      )}

      <FilterableDataPage
        searchPlaceholder="Search videos..."
        searchValue={searchQuery}
        onSearchChange={onSearchChange}
        onSearchCommit={onSearchCommit}
      />

      <div className="flex flex-wrap gap-2">
        {STATUS_FILTERS.map(f => (
          <Button
            key={f.label}
            variant={status === f.value ? 'default' : 'outline'}
            size="sm"
            onClick={() => {
              setStatus(f.value);
              setPage(1);
            }}>
            {f.label}
          </Button>
        ))}
      </div>

      {videos.length === 0 ? (
        showOnboardingEmpty ? (
          <SectionEmptyState
            title="No videos yet"
            description="Add a draft from this page or message the team on the submit page. Admins publish after review."
            icon={Video}
            actionLabel="Add video"
            onAction={openCreate}
          />
        ) : (
          <Card className="p-8 text-center text-sm text-muted-foreground">
            No videos match your search or filters.
          </Card>
        )
      ) : (
        <div className="space-y-3">
          {videos.map(item => (
            <Card
              key={item._id}
              className="p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center gap-4 min-w-0">
                <DashboardThumbnail src={item.thumbnail} alt={item.title} />
                <div>
                  <p className="font-semibold text-foreground">{item.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {item.createdAt ? new Date(item.createdAt).toLocaleDateString() : ''} · Views{' '}
                    {item.views ?? 0}
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-2 sm:justify-end">
                <ArtistContentMonetizationBadge
                  isMonetizable={item.isMonetizable}
                  price={item.price}
                />
                <span
                  className={`text-xs font-medium px-2 py-1 rounded-full ${
                    item.status === 'published'
                      ? 'bg-primary/10 text-primary'
                      : item.status === 'draft'
                        ? 'bg-muted text-muted-foreground'
                        : 'bg-destructive/10 text-destructive'
                  }`}>
                  {item.status}
                </span>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  className="gap-1"
                  onClick={() => openEdit(item._id)}>
                  <Pencil className="h-3.5 w-3.5" />
                  Edit
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-4">
          <Button
            variant="outline"
            size="sm"
            disabled={page <= 1}
            onClick={() => setPage(Math.max(1, page - 1))}>
            Previous
          </Button>
          <span className="text-sm text-muted-foreground">
            Page {page} of {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            disabled={page >= totalPages}
            onClick={() => setPage(Math.min(totalPages, page + 1))}>
            Next
          </Button>
        </div>
      )}
    </div>
  );
}
