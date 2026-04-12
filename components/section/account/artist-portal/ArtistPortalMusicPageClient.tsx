'use client';

import { useEffect, useRef, useState } from 'react';
import { useQueryState, parseAsInteger, parseAsString } from 'nuqs';
import { DashboardPageHeader } from '@/components/layout/user-dashboard';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { callApi } from '@/lib/services/callApi';
import type { ArtistMusicListItem } from '@/lib/constants/endpoints';
import type { ApiErrorResponse } from '@/lib/types/http';
import { Trash2, Loader2, MessageCircle } from 'lucide-react';
import { toast } from '@/components/atoms/Toast';

const STATUS_FILTERS: Array<{ value: '' | 'draft' | 'published' | 'archived'; label: string }> = [
  { value: '', label: 'All' },
  { value: 'draft', label: 'Draft' },
  { value: 'published', label: 'Published' },
  { value: 'archived', label: 'Archived' },
];

export interface ArtistPortalMusicPageClientProps {
  initialMusic: ArtistMusicListItem[];
  initialTotalPages: number;
  initialErrorMessage: string | null;
}

export function ArtistPortalMusicPageClient({
  initialMusic,
  initialTotalPages,
  initialErrorMessage,
}: ArtistPortalMusicPageClientProps) {
  const [music, setMusic] = useState<ArtistMusicListItem[]>(initialMusic);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(initialErrorMessage);
  const [page, setPage] = useQueryState('page', parseAsInteger.withDefault(1));
  const [pageSize] = useQueryState('pagesize', parseAsInteger.withDefault(10));
  const [status, setStatus] = useQueryState('status', parseAsString.withDefault(''));
  const [totalPages, setTotalPages] = useState(initialTotalPages);
  const [reloadIndex, setReloadIndex] = useState(0);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const didMountRef = useRef(false);

  const handleDelete = async (item: ArtistMusicListItem) => {
    if (!window.confirm(`Delete "${item.title}"? This cannot be undone.`)) return;
    setDeletingId(item._id);
    const { error, message } = await callApi('ARTIST_DELETE_MUSIC', { query: `/${item._id}` });
    setDeletingId(null);
    if (error) {
      toast({ title: message || 'Failed to delete track.', variant: 'error' });
      return;
    }
    toast({ title: 'Track deleted.', variant: 'success' });
    setReloadIndex(prev => prev + 1);
  };

  useEffect(() => {
    if (!didMountRef.current) {
      didMountRef.current = true;
      return;
    }

    let cancelled = false;

    const loadMusic = async () => {
      setLoading(true);
      const params = new URLSearchParams();
      params.set('page', String(page));
      params.set('limit', String(pageSize));
      if (status) params.set('status', status);
      const query = `?${params.toString()}` as const;

      const { data, error, message } = await callApi('ARTIST_GET_MUSIC', {
        query,
      });

      if (cancelled) return;

      if (error || !data) {
        setMusic([]);
        setTotalPages(1);
        const responseCode = (error as ApiErrorResponse | undefined)?.responseCode;
        if (responseCode === 403 || responseCode === 404) {
          setErrorMessage(null);
        } else {
          setErrorMessage(message || 'Unable to load music.');
        }
      } else {
        setMusic(data.music);
        setTotalPages(data.pagination?.totalPages ?? 1);
        setErrorMessage(null);
      }

      setLoading(false);
    };

    void loadMusic();

    return () => {
      cancelled = true;
    };
  }, [page, pageSize, status, reloadIndex]);

  const playsLabel = (item: ArtistMusicListItem) =>
    'views' in item && typeof item.views === 'number'
      ? item.views
      : 'plays' in item && typeof (item as { plays?: number }).plays === 'number'
        ? (item as { plays: number }).plays
        : 0;

  return (
    <div className="relative space-y-6">
      {loading ? (
        <div className="absolute inset-0 z-10 flex items-start justify-center bg-background/60 pt-24">
          <Loader2 className="h-8 w-8 animate-spin text-primary" aria-hidden />
        </div>
      ) : null}

      <DashboardPageHeader
        title="My music"
        description="Tracks published by our team after you submit via WhatsApp or contact">
        <Button asChild className="rounded-full bg-primary hover:bg-primary/90 gap-2">
          <Link href="/account/artist-portal/upload">
            <MessageCircle className="h-4 w-4" />
            Submit new track
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

      {music.length === 0 ? (
        <Card className="p-8 text-center">
          <p className="text-muted-foreground">
            You do not have any tracks yet. Message our team on the submit page to send files for
            admin publishing.
          </p>
          <Button asChild variant="outline" className="mt-4 gap-2">
            <Link href="/account/artist-portal/upload">
              <MessageCircle className="h-4 w-4" />
              Submit a track
            </Link>
          </Button>
        </Card>
      ) : (
        <div className="space-y-3">
          {music.map(item => (
            <Card
              key={item._id}
              className="p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <p className="font-semibold text-foreground">{item.title}</p>
                <p className="text-xs text-muted-foreground">
                  {item.createdAt ? new Date(item.createdAt).toLocaleDateString() : ''} · Plays{' '}
                  {playsLabel(item)} · Downloads{' '}
                  {'downloads' in item && typeof item.downloads === 'number' ? item.downloads : 0}
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
