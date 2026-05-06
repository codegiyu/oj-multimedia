'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQueryState, parseAsInteger, parseAsString } from 'nuqs';
import { AdminDashboardListLayout } from '@/components/section/admin/AdminDashboardListLayout';
import { callApi } from '@/lib/services/callApi';
import type { IHomeAdvertItem } from '@/lib/constants/endpoints';
import { RegularBtn } from '@/components/atoms/RegularBtn';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { RegularInput } from '@/components/atoms/RegularInput';
import { RegularSelect } from '@/components/atoms/RegularSelect';
import type { SelectOption } from '@/lib/types/general';
import { Badge } from '@/components/ui/badge';
import { ApprovalModal } from '@/components/section/admin/shared';
import { MediaUrlOrUploadField } from '@/components/general/MediaUrlOrUploadField';
import { useFileUpload } from '@/lib/hooks/use-file-upload';

const slotFilterOptions: SelectOption[] = [
  { text: 'All slots', value: 'all' },
  { text: 'After hero', value: 'after_hero' },
  { text: 'Before CTA', value: 'before_cta' },
];

const slotFormOptions = slotFilterOptions.filter(o => o.value !== 'all');

export interface HomeAdvertsPageClientProps {
  pageTitle: string;
  pageDescription: string;
  adverts: IHomeAdvertItem[];
  totalPages: number;
  listError: string | null;
}

export function HomeAdvertsPageClient({
  pageTitle,
  pageDescription,
  adverts,
  totalPages,
  listError,
}: HomeAdvertsPageClientProps) {
  const router = useRouter();
  const [page, setPage] = useQueryState('page', parseAsInteger.withDefault(1));
  // const [pageSize] = useQueryState('pagesize', parseAsInteger.withDefault(DEFAULT_PAGE_SIZE));
  const [slotFilter, setSlotFilter] = useQueryState('slot', parseAsString.withDefault('all'));

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<IHomeAdvertItem | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<IHomeAdvertItem | null>(null);
  const [formSlot, setFormSlot] = useState<IHomeAdvertItem['slot']>('after_hero');
  const [formImage, setFormImage] = useState('');
  const [formLink, setFormLink] = useState('');
  const [formOrder, setFormOrder] = useState('0');
  const [formActive, setFormActive] = useState('yes');
  const [pendingImageFile, setPendingImageFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const advertImageUpload = useFileUpload({
    entityType: 'resource',
    entityId: editTarget?._id ?? 'home-advert-pending',
    intent: 'image',
  });

  const handleRefresh = () => router.refresh();

  const openCreate = () => {
    setEditTarget(null);
    setFormSlot('after_hero');
    setFormImage('');
    setFormLink('');
    setFormOrder('0');
    setFormActive('yes');
    setPendingImageFile(null);
    setDialogOpen(true);
  };

  const openEdit = (a: IHomeAdvertItem) => {
    setEditTarget(a);
    setFormSlot(a.slot);
    setFormImage(a.imageUrl);
    setFormLink(a.linkUrl ?? '');
    setFormOrder(String(a.displayOrder ?? 0));
    setFormActive(a.isActive === false ? 'no' : 'yes');
    setPendingImageFile(null);
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!formImage.trim()) return;
    setSaving(true);
    try {
      if (editTarget) {
        let finalImageUrl = formImage.trim();
        if (pendingImageFile) {
          const upload = await advertImageUpload.uploadFile({
            file: pendingImageFile,
            entityId: editTarget._id,
          });
          if (!upload?.url) throw new Error('Image upload failed');
          finalImageUrl = upload.url;
        }
        const res = await callApi('ADMIN_HOME_ADVERTS_UPDATE', {
          query: `/${editTarget._id}` as `/${string}`,
          payload: {
            slot: formSlot,
            imageUrl: finalImageUrl,
            linkUrl: formLink.trim() || undefined,
            displayOrder: Number(formOrder) || 0,
            isActive: formActive === 'yes',
          },
        });
        if (res.type !== 'success') throw new Error(res.error?.message ?? 'Failed');
      } else {
        const res = await callApi('ADMIN_HOME_ADVERTS_CREATE', {
          payload: {
            slot: formSlot,
            imageUrl: formImage.trim() || '',
            linkUrl: formLink.trim() || undefined,
            displayOrder: Number(formOrder) || 0,
            isActive: formActive === 'yes',
          },
        });
        if (res.type !== 'success') throw new Error(res.error?.message ?? 'Failed');
        const createdId =
          (res.data as { advert?: { _id?: string }; _id?: string } | undefined)?.advert?._id ??
          (res.data as { _id?: string } | undefined)?._id;
        if (createdId && pendingImageFile) {
          const upload = await advertImageUpload.uploadFile({
            file: pendingImageFile,
            entityId: createdId,
          });
          if (!upload?.url) throw new Error('Image upload failed');
          const patch = await callApi('ADMIN_HOME_ADVERTS_UPDATE', {
            query: `/${createdId}` as `/${string}`,
            payload: { imageUrl: upload.url },
          });
          if (patch.type !== 'success')
            throw new Error(patch.error?.message ?? 'Failed to update image');
        }
      }
      setDialogOpen(false);
      setEditTarget(null);
      handleRefresh();
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      const res = await callApi('ADMIN_HOME_ADVERTS_DELETE', {
        query: `/${deleteTarget._id}` as `/${string}`,
      });
      if (res.type !== 'success') throw new Error(res.error?.message ?? 'Failed');
      setDeleteTarget(null);
      handleRefresh();
    } catch (e) {
      console.error(e);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <AdminDashboardListLayout
      title={pageTitle}
      description={pageDescription}
      onRefresh={handleRefresh}
      pageHeaderActions={<RegularBtn LeftIcon={Plus} text="New advert" onClick={openCreate} />}
      listError={listError}
      filterableDataPageProps={{
        filters: [
          {
            label: 'Slot',
            value: slotFilter,
            options: slotFilterOptions,
            onChange: v => {
              setSlotFilter(v);
              setPage(1);
            },
          },
        ],
        onApplyFilters: () => setPage(1),
      }}
      mainClassName="rounded-lg border border-border overflow-hidden flex flex-col min-h-0"
      extraContent={
        <>
          <Dialog
            open={dialogOpen}
            onOpenChange={v => !v && (setDialogOpen(false), setEditTarget(null))}>
            <DialogContent className="max-w-xl">
              <DialogHeader>
                <DialogTitle>{editTarget ? 'Edit home advert' : 'New home advert'}</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-2">
                <RegularSelect
                  label="Slot"
                  value={formSlot}
                  onSelectChange={v => setFormSlot(v as IHomeAdvertItem['slot'])}
                  options={slotFormOptions}
                />
                <MediaUrlOrUploadField
                  label="Image URL"
                  value={formImage}
                  onChange={setFormImage}
                  entityType="resource"
                  entityId={editTarget?._id ?? null}
                  fallbackEntityIdPrefix="home-advert-image"
                  intent="image"
                  accept="image/*"
                  defaultMode="upload"
                  required
                  onPendingFileChange={setPendingImageFile}
                />
                <RegularInput
                  label="Link URL (optional)"
                  value={formLink}
                  onChange={e => setFormLink(e.target.value)}
                />
                <RegularInput
                  label="Display order"
                  value={formOrder}
                  onChange={e => setFormOrder(e.target.value)}
                />
                <RegularSelect
                  label="Active"
                  value={formActive}
                  onSelectChange={setFormActive}
                  options={[
                    { text: 'Yes', value: 'yes' },
                    { text: 'No', value: 'no' },
                  ]}
                />
              </div>
              <DialogFooter>
                <RegularBtn
                  type="button"
                  variant="ghost"
                  text="Cancel"
                  onClick={() => setDialogOpen(false)}
                />
                <RegularBtn
                  type="button"
                  text="Save"
                  loading={saving}
                  disabled={saving || !formImage.trim()}
                  onClick={() => void handleSave()}
                />
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {deleteTarget && (
            <ApprovalModal
              open={!!deleteTarget}
              onOpenChange={v => !v && setDeleteTarget(null)}
              title="Delete advert"
              description="Remove this home banner?"
              confirmText="Delete"
              onConfirm={() => void handleDelete()}
              loading={deleting}
            />
          )}
        </>
      }>
      <div className="flex flex-col min-h-0 flex-1">
        <div className="overflow-auto sleek-scrollbar flex-1">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 sticky top-0">
              <tr className="text-left border-b border-border">
                <th className="p-3 font-medium w-24">Preview</th>
                <th className="p-3 font-medium">Slot</th>
                <th className="p-3 font-medium">Link</th>
                <th className="p-3 font-medium">Order</th>
                <th className="p-3 font-medium">Active</th>
                <th className="p-3 w-24" />
              </tr>
            </thead>
            <tbody>
              {adverts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-muted-foreground">
                    No home adverts yet.
                  </td>
                </tr>
              ) : (
                adverts.map(a => (
                  <tr key={a._id} className="border-b border-border/60 hover:bg-muted/30">
                    <td className="p-3">
                      <div className="w-16 h-10 rounded overflow-hidden bg-muted">
                        {a.imageUrl ? (
                          <img
                            src={a.imageUrl}
                            alt={`Home advert preview (${a.slot})`}
                            className="w-full h-full object-cover"
                          />
                        ) : null}
                      </div>
                    </td>
                    <td className="p-3">
                      <Badge variant="secondary">{a.slot}</Badge>
                    </td>
                    <td className="p-3 max-w-[200px] truncate font-mono text-xs">
                      {a.linkUrl || '—'}
                    </td>
                    <td className="p-3">{a.displayOrder ?? 0}</td>
                    <td className="p-3">{a.isActive === false ? 'No' : 'Yes'}</td>
                    <td className="p-3">
                      <div className="flex gap-1">
                        <RegularBtn
                          type="button"
                          variant="ghost"
                          LeftIcon={Pencil}
                          onClick={() => openEdit(a)}
                        />
                        <RegularBtn
                          type="button"
                          variant="ghost"
                          LeftIcon={Trash2}
                          onClick={() => setDeleteTarget(a)}
                        />
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        {totalPages > 1 && (
          <div className="flex items-center justify-end gap-2 p-3 border-t border-border">
            <RegularBtn
              type="button"
              variant="outline"
              text="Previous"
              disabled={page <= 1}
              onClick={() => setPage(p => Math.max(1, p - 1))}
            />
            <span className="text-sm text-muted-foreground">
              Page {page} / {totalPages}
            </span>
            <RegularBtn
              type="button"
              variant="outline"
              text="Next"
              disabled={page >= totalPages}
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            />
          </div>
        )}
      </div>
    </AdminDashboardListLayout>
  );
}
