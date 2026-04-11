'use client';

import { useEffect, useRef, useState } from 'react';
import { useQueryState, parseAsInteger, parseAsString } from 'nuqs';
import { DashboardPageHeader } from '@/components/layout/user-dashboard';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { callApi } from '@/lib/services/callApi';
import type { ArtistVideoListItem } from '@/lib/constants/endpoints';
import type { ApiErrorResponse } from '@/lib/types/http';
import { toast } from 'sonner';
import { Video, Trash2, Loader2, MessageCircle } from 'lucide-react';
import { EmptyState } from '@/components/section/news/EmptyState';

const STATUS_FILTERS: Array<{ value: '' | 'draft' | 'published' | 'archived'; label: string }> = [
  { value: '', label: 'All' },
  { value: 'draft', label: 'Draft' },
  { value: 'published', label: 'Published' },
  { value: 'archived', label: 'Archived' },
];

export interface ArtistPortalVideosPageClientProps {
  initialVideos: ArtistVideoListItem[];
  initialTotalPages: number;
  initialHasArtistProfile: boolean;
  initialErrorMessage: string | null;
}

export function ArtistPortalVideosPageClient({
  initialVideos,
  initialTotalPages,
  initialHasArtistProfile,
  initialErrorMessage,
}: ArtistPortalVideosPageClientProps) {
  const [videos, setVideos] = useState<ArtistVideoListItem[]>(initialVideos);
  const [loading, setLoading] = useState(false);
  const [hasArtistProfile, setHasArtistProfile] = useState<boolean | null>(initialHasArtistProfile);
  const [errorMessage, setErrorMessage] = useState<string | null>(initialErrorMessage);
  const [page, setPage] = useQueryState('page', parseAsInteger.withDefault(1));
  const [pageSize] = useQueryState('pagesize', parseAsInteger.withDefault(10));
  const [status, setStatus] = useQueryState('status', parseAsString.withDefault(''));
  const [totalPages, setTotalPages] = useState(initialTotalPages);
  const [reloadIndex, setReloadIndex] = useState(0);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const didMountRef = useRef(false);

  const handleDelete = async (item: ArtistVideoListItem) => {
    if (!window.confirm(`Delete "${item.title}"? This cannot be undone.`)) return;
    setDeletingId(item._id);
    const { error, message } = await callApi('ARTIST_DELETE_VIDEO', { query: `/${item._id}` });
    setDeletingId(null);
    if (error) {
      toast.error(message || 'Failed to delete video.');
      return;
    }
    toast.success('Video deleted.');
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
      const params = new URLSearchParams();
      params.set('page', String(page));
      params.set('limit', String(pageSize));
      if (status) params.set('status', status);
      const query = `?${params.toString()}` as const;

      const { data, error, message } = await callApi('ARTIST_GET_VIDEOS', {
        query,
      });

      if (cancelled) return;

      if (error || !data) {
        setVideos([]);
        setTotalPages(1);
        const responseCode = (error as ApiErrorResponse | undefined)?.responseCode;
        if (responseCode === 403 || responseCode === 404) {
          setHasArtistProfile(false);
          setErrorMessage(null);
        } else {
          setHasArtistProfile(true);
          setErrorMessage(message || 'Unable to load videos.');
        }
      } else {
        setHasArtistProfile(true);
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
  }, [page, pageSize, status, reloadIndex]);

  if (hasArtistProfile === false) {
    return (
      <div className="space-y-6">
        <DashboardPageHeader title="My videos" description="Manage your video content" />
        <Card className="border-border/80 p-8 text-center shadow-sm">
          <p className="text-muted-foreground">
            Complete your artist profile to manage your videos.
          </p>
          <Button asChild className="mt-4 rounded-full" variant="outline">
            <Link href="/account/artist-portal/settings">Go to settings</Link>
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="relative space-y-6">
      {loading ? (
        <div className="absolute inset-0 z-10 flex items-start justify-center bg-background/60 pt-24">
          <Loader2 className="h-8 w-8 animate-spin text-primary" aria-hidden />
        </div>
      ) : null}

      <DashboardPageHeader
        title="My videos"
        description="Videos go live after admins publish—submit files via the submit page">
        <Button asChild className="rounded-full bg-primary hover:bg-primary/90 gap-2">
          <Link href="/account/artist-portal/upload">
            <MessageCircle className="h-4 w-4" />
            Submit new video
          </Link>
        </Button>
      </DashboardPageHeader>

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

      <div className="flex flex-wrap gap-2">
        {STATUS_FILTERS.map(f => (
          <Button
            key={f.label}
            variant={status === f.value ? 'default' : 'outline'}
            size="sm"
            onClick={() => setStatus(f.value)}>
            {f.label}
          </Button>
        ))}
      </div>

      {videos.length === 0 ? (
        <EmptyState
          title="No videos yet"
          description="Send your video files to our team on the submit page (WhatsApp or contact). Admins publish after review."
          icon={<Video className="w-12 h-12 text-muted-foreground" />}
          actionLabel="Submit a video"
          actionHref="/account/artist-portal/upload"
          showDefaultActions={false}
        />
      ) : (
        <div className="space-y-3">
          {videos.map(item => (
            <Card
              key={item._id}
              className="p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <p className="font-semibold text-foreground">{item.title}</p>
                <p className="text-xs text-muted-foreground">
                  {item.createdAt ? new Date(item.createdAt).toLocaleDateString() : ''} · Views{' '}
                  {item.views ?? 0}
                </p>
              </div>
              <div className="flex items-center gap-3">
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
                <Button asChild size="sm" variant="outline">
                  <Link href="/account/artist-portal/upload">Request updates</Link>
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="border-destructive text-destructive hover:bg-destructive/10"
                  disabled={deletingId === item._id}
                  onClick={() => handleDelete(item)}>
                  {deletingId === item._id ? 'Deleting…' : <Trash2 className="w-4 h-4" />}
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
