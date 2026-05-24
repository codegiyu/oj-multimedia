'use client';

import { useEffect, useState } from 'react';
import { Settings2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { callApi } from '@/lib/services/callApi';
import { ManageAlbumWhatsAppModal } from '@/components/section/shared/ManageAlbumWhatsAppModal';
import type { AlbumWhatsAppRequestType } from '@/lib/services/buildAlbumRequestWhatsApp';

interface AlbumManageButtonProps {
  albumArtistId: string;
  album: {
    _id: string;
    title: string;
    slug?: string;
  };
  artistName: string;
  defaultRequestType?: AlbumWhatsAppRequestType;
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'default' | 'sm' | 'lg';
  className?: string;
}

export function AlbumManageButton({
  albumArtistId,
  album,
  artistName,
  defaultRequestType,
  variant = 'outline',
  size = 'sm',
  className,
}: AlbumManageButtonProps) {
  const [canManage, setCanManage] = useState(false);
  const [checked, setChecked] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    let cancelled = false;

    void callApi('ARTIST_GET_ME', {})
      .then(res => {
        if (cancelled || res.type !== 'success' || !res.data?.artist) return;

        const me = res.data.artist;
        const myId = typeof me === 'object' && me && '_id' in me ? String(me._id) : '';

        setCanManage(Boolean(myId && myId === albumArtistId));
      })
      .finally(() => {
        if (!cancelled) setChecked(true);
      });

    return () => {
      cancelled = true;
    };
  }, [albumArtistId]);

  if (!checked || !canManage) return null;

  return (
    <>
      <Button
        type="button"
        variant={variant}
        size={size}
        className={className}
        onClick={() => setModalOpen(true)}>
        <Settings2 className="w-4 h-4 mr-2" />
        Manage album
      </Button>
      <ManageAlbumWhatsAppModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        artistName={artistName}
        album={album}
        defaultRequestType={defaultRequestType}
      />
    </>
  );
}
