/* eslint-disable react-hooks/exhaustive-deps */
'use client';

import { useState, useEffect, useRef } from 'react';
import { useQueryState, parseAsInteger, parseAsString } from 'nuqs';
import { FilterableDataPage } from '@/components/general/FilterableDataPage';
import { DEFAULT_PAGE_SIZE } from '@/components/general/DataTable';
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

const SEARCH_DEBOUNCE_MS = 300;

const slotFilterOptions: SelectOption[] = [
  { text: 'All slots', value: 'all' },
  { text: 'After hero', value: 'after_hero' },
  { text: 'Before CTA', value: 'before_cta' },
];

const slotFormOptions = slotFilterOptions.filter(o => o.value !== 'all');

export function HomeAdvertsPageClient() {
  const [page, setPage] = useQueryState('page', parseAsInteger.withDefault(1));
  const [pageSize] = useQueryState('pagesize', parseAsInteger.withDefault(DEFAULT_PAGE_SIZE));
  const [slotFilter, setSlotFilter] = useQueryState('slot', parseAsString.withDefault('all'));
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [refreshKey, setRefreshKey] = useState(0);
  const [adverts, setAdverts] = useState<IHomeAdvertItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<IHomeAdvertItem | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<IHomeAdvertItem | null>(null);
  const [formSlot, setFormSlot] = useState<IHomeAdvertItem['slot']>('after_hero');
  const [formImage, setFormImage] = useState('');
  const [formLink, setFormLink] = useState('');
  const [formOrder, setFormOrder] = useState('0');
  const [formActive, setFormActive] = useState('yes');
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const fetchList = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.append('page', String(page));
      params.append('limit', String(pageSize));
      params.append('sort', 'displayOrder');
      if (slotFilter && slotFilter !== 'all') params.append('slot', slotFilter);
      const res = await callApi('ADMIN_HOME_ADVERTS_LIST', {
        query: `?${params.toString()}` as `?${string}`,
      });
      if (res.type !== 'success') {
        setAdverts([]);
        setTotalPages(1);
        return;
      }
      setAdverts(res.data.adverts ?? []);
      setTotalPages(res.data.pagination?.totalPages ?? 1);
    } catch {
      setAdverts([]);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    debounceRef.current = setTimeout(() => fetchList(), SEARCH_DEBOUNCE_MS);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [refreshKey, page, pageSize, slotFilter]);

  const handleRefresh = () => setRefreshKey(k => k + 1);

  const openCreate = () => {
    setEditTarget(null);
    setFormSlot('after_hero');
    setFormImage('');
    setFormLink('');
    setFormOrder('0');
    setFormActive('yes');
    setDialogOpen(true);
  };

  const openEdit = (a: IHomeAdvertItem) => {
    setEditTarget(a);
    setFormSlot(a.slot);
    setFormImage(a.imageUrl);
    setFormLink(a.linkUrl ?? '');
    setFormOrder(String(a.displayOrder ?? 0));
    setFormActive(a.isActive === false ? 'no' : 'yes');
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!formImage.trim()) return;
    setSaving(true);
    try {
      if (editTarget) {
        const res = await callApi('ADMIN_HOME_ADVERTS_UPDATE', {
          query: `/${editTarget._id}` as `/${string}`,
          payload: {
            slot: formSlot,
            imageUrl: formImage.trim(),
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
            imageUrl: formImage.trim(),
            linkUrl: formLink.trim() || undefined,
            displayOrder: Number(formOrder) || 0,
            isActive: formActive === 'yes',
          },
        });
        if (res.type !== 'success') throw new Error(res.error?.message ?? 'Failed');
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
    <section className="h-full grid grid-rows-[auto_1fr] gap-4 sm:gap-6 overflow-hidden">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex-1 min-w-0">
          <FilterableDataPage
            filters={[
              {
                label: 'Slot',
                value: slotFilter,
                options: slotFilterOptions,
                onChange: v => {
                  setSlotFilter(v);
                  setPage(1);
                },
              },
            ]}
            onApplyFilters={() => setPage(1)}
          />
        </div>
        <RegularBtn LeftIcon={Plus} text="New advert" onClick={openCreate} />
      </div>

      <div className="rounded-lg border border-border overflow-hidden flex flex-col min-h-0">
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
              {loading ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-muted-foreground">
                    Loading…
                  </td>
                </tr>
              ) : adverts.length === 0 ? (
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
                          <img src={a.imageUrl} alt="" className="w-full h-full object-cover" />
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

      <Dialog
        open={dialogOpen}
        onOpenChange={v => !v && (setDialogOpen(false), setEditTarget(null))}>
        <DialogContent className="max-w-md">
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
            <RegularInput
              label="Image URL"
              value={formImage}
              onChange={e => setFormImage(e.target.value)}
              required
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
    </section>
  );
}
