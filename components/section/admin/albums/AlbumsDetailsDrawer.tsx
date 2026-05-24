'use client';

import { useEffect, useState } from 'react';
import {
  TableRowDetails,
  type ClickedRowDetails,
} from '@/components/general/TableRowDetailsDrawer';
import { format } from 'date-fns';
import { DiscAlbum, User, FileText, Calendar, Hash, ListMusic } from 'lucide-react';
import type { AlbumDetail, AlbumListItem } from '@/lib/types/community';
import { InfoCard } from '@/components/general/InfoCard';
import { DashboardThumbnail } from '@/components/general/DashboardThumbnail';
import { DrawerMediaPreview } from '@/components/general/DrawerMediaPreview';
import { callApi } from '@/lib/services/callApi';

function albumArtistLabel(album: AlbumListItem | AlbumDetail): string {
  const a = album.artist;
  if (!a) return '—';
  if (typeof a === 'string') return a;
  return a.name ?? '—';
}

function DetailsHeader({ rowDetails }: { rowDetails: ClickedRowDetails<AlbumListItem, string> }) {
  const album = rowDetails.data;

  return (
    <div className="flex gap-3 items-start">
      <DashboardThumbnail src={album.coverImage} alt={album.title} size={48} />
      <div className="grid gap-2 flex-1">
        <h2 className="text-[1.125rem] leading-none font-semibold -tracking-[0.36px] text-foreground/90">
          {album.title}
        </h2>
        <p className="text-sm text-muted-foreground">
          {albumArtistLabel(album)} · {album.status ?? '—'} · {album.trackCount ?? 0} track
          {(album.trackCount ?? 0) === 1 ? '' : 's'}
        </p>
      </div>
    </div>
  );
}

function DetailsReadOnly({
  rowDetails,
  detail,
  detailLoading,
}: {
  rowDetails: ClickedRowDetails<AlbumListItem, string>;
  detail: AlbumDetail | null;
  detailLoading: boolean;
}) {
  const album = detail ?? rowDetails.data;
  const tracks = detail?.tracks ?? [];

  return (
    <div className="grid gap-4 p-4">
      <DrawerMediaPreview src={album.coverImage} alt={album.title} />
      <div className="grid gap-3">
        <InfoCard icon={DiscAlbum} label="Title" value={album.title} />
        <InfoCard icon={User} label="Artist" value={albumArtistLabel(album)} />
        <InfoCard icon={FileText} label="Status" value={album.status ?? '—'} />
        <InfoCard
          icon={ListMusic}
          label="Tracks"
          value={String(album.trackCount ?? tracks.length)}
        />
        <InfoCard icon={FileText} label="Views" value={String(album.views ?? 0)} />
        <InfoCard icon={FileText} label="Plays" value={String(album.plays ?? 0)} />
        <InfoCard icon={FileText} label="Featured" value={album.isFeatured ? 'Yes' : 'No'} />
        <InfoCard icon={FileText} label="Display order" value={String(album.displayOrder ?? 0)} />
        <InfoCard icon={FileText} label="Excerpt" value={album.excerpt ?? '—'} preserveParagraphs />
        <InfoCard
          icon={FileText}
          label="Description"
          value={album.description ?? '—'}
          preserveParagraphs
        />
        <InfoCard
          icon={Calendar}
          label="Release date"
          value={album.releaseDate ? format(new Date(album.releaseDate), 'MMM d, yyyy') : '—'}
        />
        <InfoCard
          icon={Calendar}
          label="Created"
          value={album.createdAt ? format(new Date(album.createdAt), 'MMM d, yyyy HH:mm:ss') : '—'}
        />
        <InfoCard icon={Hash} label="ID" value={album._id} hasCopy copyValue={album._id} />
      </div>

      {detailLoading ? (
        <p className="text-sm text-muted-foreground px-1">Loading tracks…</p>
      ) : tracks.length > 0 ? (
        <div className="grid gap-2 border-t border-foreground/7 pt-4">
          <h3 className="text-sm font-medium text-foreground/90">Tracks in this album</h3>
          <ul className="grid gap-2">
            {tracks.map((track, index) => (
              <li
                key={track._id}
                className="flex items-center justify-between gap-2 text-sm rounded-md border border-border px-3 py-2 bg-muted/20">
                <span className="truncate">
                  {index + 1}. {track.title}
                </span>
                <span className="text-muted-foreground shrink-0">{track.plays ?? 0} plays</span>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <p className="text-sm text-muted-foreground px-1 border-t border-foreground/7 pt-4">
          No tracks linked to this album yet. Assign tracks from the Music dashboard.
        </p>
      )}
    </div>
  );
}

interface AlbumsDetailsDrawerProps {
  clickedRowDetails: ClickedRowDetails<AlbumListItem, string> | undefined;
  setClickedRowDetails: (d: ClickedRowDetails<AlbumListItem, string> | undefined) => void;
}

export function AlbumsDetailsDrawer({
  clickedRowDetails,
  setClickedRowDetails,
}: AlbumsDetailsDrawerProps) {
  const [detail, setDetail] = useState<AlbumDetail | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);

  const closeDrawer = () => setClickedRowDetails(undefined);

  useEffect(() => {
    if (!clickedRowDetails?.data._id) {
      setDetail(null);
      return;
    }

    let cancelled = false;
    setDetailLoading(true);
    void (async () => {
      try {
        const res = await callApi('ADMIN_ALBUM_ITEM', {
          query: `/${clickedRowDetails.data._id}` as `/${string}`,
        });
        if (cancelled || res.type !== 'success' || !res.data.album) return;
        setDetail(res.data.album);
      } finally {
        if (!cancelled) setDetailLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [clickedRowDetails?.data._id]);

  if (!clickedRowDetails) return null;

  return (
    <TableRowDetails
      open={!!clickedRowDetails}
      onOpenChange={val => !val && closeDrawer()}
      title="Album details"
      data={clickedRowDetails.data as unknown as Record<string, unknown>}
      dataName="album"
      showMeta={false}
      setShowMeta={() => {}}
      header={<DetailsHeader rowDetails={clickedRowDetails} />}
      footer={
        <div className="flex items-center justify-end gap-2 px-4 py-3 border-t border-foreground/7" />
      }>
      <DetailsReadOnly
        rowDetails={clickedRowDetails}
        detail={detail}
        detailLoading={detailLoading}
      />
    </TableRowDetails>
  );
}
