/* eslint-disable react-hooks/exhaustive-deps */
'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { MessageCircle } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { RegularBtn } from '@/components/atoms/RegularBtn';
import { RegularSelect } from '@/components/atoms/RegularSelect';
import type { SelectOption } from '@/lib/types/general';
import { useInitSiteSettingsStore } from '@/lib/store/useSiteSettingsStore';
import {
  buildWhatsAppHref,
  resolveAlbumPublicPageUrl,
  type AlbumWhatsAppRequestType,
} from '@/lib/services/whatsappMessaging.service';

const REQUEST_OPTIONS: SelectOption[] = [
  { text: 'Create a new album', value: 'create' },
  { text: 'Edit this album', value: 'edit' },
  { text: 'Delete this album', value: 'delete' },
];

export interface ManageAlbumWhatsAppModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  artistName: string;
  album?: {
    _id: string;
    title: string;
    slug?: string;
  };
  defaultRequestType?: AlbumWhatsAppRequestType;
}

export function ManageAlbumWhatsAppModal({
  open,
  onOpenChange,
  artistName,
  album,
  defaultRequestType,
}: ManageAlbumWhatsAppModalProps) {
  const settings = useInitSiteSettingsStore(s => s.settings);
  const fetchSettings = useInitSiteSettingsStore(s => s.actions.fetchSettings);

  const initialType: AlbumWhatsAppRequestType = defaultRequestType ?? (album ? 'edit' : 'create');

  const [requestType, setRequestType] = useState<AlbumWhatsAppRequestType>(initialType);

  useEffect(() => {
    if (!open) return;

    setRequestType(defaultRequestType ?? (album ? 'edit' : 'create'));
    void fetchSettings('contactInfo', { force: false });
  }, [open, album, defaultRequestType]);

  const waHref = useMemo(() => {
    const albumPageUrl = album ? resolveAlbumPublicPageUrl(album) : undefined;

    return buildWhatsAppHref(settings?.contactInfo?.whatsapp, {
      type: 'album_request',
      data: {
        requestType,
        artistName,
        albumTitle: album?.title,
        albumId: album?._id,
        albumPageUrl,
      },
    });
  }, [settings?.contactInfo?.whatsapp, requestType, artistName, album]);

  const proceed = () => {
    if (!waHref) return;

    window.open(waHref, '_blank', 'noopener,noreferrer');
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Manage album via WhatsApp</DialogTitle>
          <DialogDescription>
            Album create, edit, and delete requests are handled by our admin team. Choose what you
            need, then continue on WhatsApp to send a pre-filled message.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4">
          <RegularSelect
            label="What do you need?"
            value={requestType}
            onSelectChange={v => setRequestType(v as AlbumWhatsAppRequestType)}
            options={REQUEST_OPTIONS}
          />

          {album ? (
            <div className="rounded-lg border bg-muted/40 p-4 text-sm space-y-1">
              <p className="font-medium text-foreground">{album.title}</p>
              <p className="text-muted-foreground">{artistName}</p>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground rounded-md border border-border px-3 py-2 bg-muted/20">
              You can describe the new album (title, cover, tracks) in WhatsApp after you tap
              Proceed.
            </p>
          )}
        </div>

        <DialogFooter className="flex-col gap-2 sm:flex-col">
          {waHref ? (
            <RegularBtn
              text="Proceed on WhatsApp"
              LeftIcon={MessageCircle}
              className="w-full"
              onClick={proceed}
            />
          ) : (
            <p className="text-sm text-muted-foreground text-center">
              WhatsApp is not configured yet. Please use the{' '}
              <Link href="/contact" className="text-primary underline underline-offset-2">
                contact page
              </Link>{' '}
              to reach the team.
            </p>
          )}
          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
