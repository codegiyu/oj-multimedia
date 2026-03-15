'use client';

import { useEffect, useRef, useState } from 'react';
import { useQueryState, parseAsInteger, parseAsString } from 'nuqs';
import { SectionContainer } from '@/components/general/SectionContainer';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { callApi } from '@/lib/services/callApi';
import type { ArtistVideoListItem } from '@/lib/constants/endpoints';
import type { ApiErrorResponse } from '@/lib/types/http';
import { toast } from 'sonner';
import { Video, Trash2 } from 'lucide-react';

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

function ArtistVideosLoadingState() {
  return (
    <SectionContainer>
      <div className="max-w-3xl mx-auto text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto">
          <Video className="w-8 h-8 text-muted-foreground animate-pulse" />
        </div>
        <h1 className="text-2xl md:text-3xl font-bold text-foreground">Loading videos</h1>
        <p className="text-sm text-muted-foreground">Please wait while we fetch your videos.</p>
      </div>
    </SectionContainer>
  );
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

  if (loading) {
    return <ArtistVideosLoadingState />;
  }

  if (hasArtistProfile === false) {
    return (
      <SectionContainer>
        <Card className="p-8 text-center">
          <p className="text-muted-foreground">
            Complete your artist profile to manage your videos.
          </p>
          <Button asChild className="mt-4" variant="outline">
            <Link href="/account/artist-portal/settings">Go to settings</Link>
          </Button>
        </Card>
      </SectionContainer>
    );
  }

  return (
    <SectionContainer>
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">
              Artist Portal – Videos
            </h1>
            <p className="text-sm text-muted-foreground">Manage your video content.</p>
          </div>
          <Button asChild className="bg-primary hover:bg-primary/90">
            <Link href="/account/artist-portal/upload">Upload new video</Link>
          </Button>
        </div>

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
          <Card className="p-8 text-center">
            <p className="text-muted-foreground">
              You do not have any videos yet. Use the upload button to add your first video.
            </p>
            <Button asChild variant="outline" className="mt-4">
              <Link href="/account/artist-portal/upload">Upload new video</Link>
            </Button>
          </Card>
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
                    <Link href={`/account/artist-portal/upload?id=${item._id}&type=video`}>
                      Edit
                    </Link>
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
    </SectionContainer>
  );
}
