'use client';

import Link from 'next/link';
import { cn } from '@/lib/utils';
import {
  buildAdminContentCategorySearchHref,
  buildAdminDocumentEntityHref,
  resolveEntityId,
} from '@/lib/admin/entityRoutes';
import {
  musicAlbumLabel,
  musicAlbumRecordId,
  resolveContentArtistId,
} from '@/lib/utils/adminMusicAlbumSelect';
import type { ArtistMusicListItem } from '@/lib/constants/endpoints';
import type { QuestionListItem } from '@/lib/types/community';
import { AdminEntityLink } from './AdminEntityLink';

const searchLinkClassName =
  'underline-offset-2 hover:underline hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm';

type ArtistRef = string | { _id?: string; name?: string } | null | undefined;

type VendorRef = string | { _id?: string; storeName?: string; name?: string } | null | undefined;

export function artistDisplayLabel(artist: ArtistRef): string {
  if (!artist) return '—';
  if (typeof artist === 'string') return artist.trim() || '—';

  return artist.name?.trim() || '—';
}

export function resolveMarketplaceVendorId(vendor: VendorRef): string | null {
  if (!vendor) return null;
  if (typeof vendor === 'string') return resolveEntityId(vendor);

  return resolveEntityId(vendor);
}

export function marketplaceVendorLabel(vendor: VendorRef): string {
  if (!vendor) return '—';
  if (typeof vendor === 'string') return vendor.trim() || '—';

  return vendor.storeName?.trim() || vendor.name?.trim() || '—';
}

export function resolveQuestionPastorId(pastor: QuestionListItem['pastor']): string | null {
  if (!pastor || typeof pastor !== 'object') return null;

  return resolveEntityId(pastor);
}

export function questionPastorLabel(pastor: QuestionListItem['pastor']): string {
  if (!pastor) return '—';

  return pastor.name?.trim() || '—';
}

export function AdminArtistFieldLink({
  artist,
  className,
}: {
  artist: ArtistRef;
  className?: string;
}) {
  const id = resolveContentArtistId(artist as ArtistMusicListItem['artist']);
  const label = artistDisplayLabel(artist);

  return (
    <AdminEntityLink entityType="artist" entityId={id} className={className}>
      {label}
    </AdminEntityLink>
  );
}

export function AdminMusicAlbumFieldLink({
  music,
  className,
}: {
  music: Pick<ArtistMusicListItem, 'album' | 'albumId'>;
  className?: string;
}) {
  const id = musicAlbumRecordId(music);
  const label = musicAlbumLabel(music);

  return (
    <AdminEntityLink entityType="album" entityId={id} className={className}>
      {label}
    </AdminEntityLink>
  );
}

export function AdminContentCategoryFieldLink({
  category,
  className,
}: {
  category?: string | null;
  className?: string;
}) {
  const label = category?.trim() || '—';

  if (!label || label === '—') {
    return <span className={className}>{label}</span>;
  }

  const href = buildAdminContentCategorySearchHref(label);

  return (
    <Link
      href={href}
      className={cn(searchLinkClassName, className)}
      onClick={event => event.stopPropagation()}>
      {label}
    </Link>
  );
}

export function AdminVendorFieldLink({
  vendor,
  vendorName,
  className,
}: {
  vendor: VendorRef;
  vendorName?: string | null;
  className?: string;
}) {
  const id = resolveMarketplaceVendorId(vendor);
  const label = vendorName?.trim() || marketplaceVendorLabel(vendor);

  return (
    <AdminEntityLink entityType="vendor" entityId={id} className={className}>
      {label}
    </AdminEntityLink>
  );
}

export function AdminProductFieldLink({
  productId,
  productName,
  className,
}: {
  productId: string | null | undefined;
  productName: string;
  className?: string;
}) {
  const id = productId?.trim() ?? '';

  return (
    <AdminEntityLink entityType="product" entityId={id || null} className={className}>
      {productName}
    </AdminEntityLink>
  );
}

export function AdminPastorFieldLink({
  pastor,
  className,
}: {
  pastor: QuestionListItem['pastor'];
  className?: string;
}) {
  const id = resolveQuestionPastorId(pastor);
  const label = questionPastorLabel(pastor);

  return (
    <AdminEntityLink entityType="pastor" entityId={id} className={className}>
      {label}
    </AdminEntityLink>
  );
}

export function AdminDocumentEntityFieldLink({
  entityType,
  entityId,
  className,
}: {
  entityType?: string | null;
  entityId?: string | null;
  className?: string;
}) {
  const type = entityType?.trim() ?? '';
  const id = entityId?.trim() ?? '';
  const href = type && id ? buildAdminDocumentEntityHref(type, id) : null;

  if (!href) {
    return <span className={className}>{id || '—'}</span>;
  }

  return (
    <Link
      href={href}
      className={cn(searchLinkClassName, className)}
      onClick={event => event.stopPropagation()}>
      {id}
    </Link>
  );
}

export function AdminUserLinkedArtistFieldLink({
  artistId,
  artistName: name,
  className,
}: {
  artistId?: string | null;
  artistName?: string | null;
  className?: string;
}) {
  const label = name?.trim() || 'Not linked';

  return (
    <AdminEntityLink entityType="artist" entityId={artistId} className={className}>
      {label}
    </AdminEntityLink>
  );
}

export function AdminUserLinkedVendorFieldLink({
  vendorId,
  vendorName,
  className,
}: {
  vendorId?: string | null;
  vendorName?: string | null;
  className?: string;
}) {
  const label = vendorName?.trim() || 'Not linked';

  return (
    <AdminEntityLink entityType="vendor" entityId={vendorId} className={className}>
      {label}
    </AdminEntityLink>
  );
}
