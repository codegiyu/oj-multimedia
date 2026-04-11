/* eslint-disable react-hooks/exhaustive-deps */
'use client';

import { useState, useEffect, useRef } from 'react';
import { useQueryState, parseAsInteger, parseAsString } from 'nuqs';
import { FilterableDataPage } from '@/components/general/FilterableDataPage';
import { DEFAULT_PAGE_SIZE } from '@/components/general/DataTable';
import { callApi } from '@/lib/services/callApi';
import type { IContentCategoryItem } from '@/lib/constants/endpoints';
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

const scopeOptions: SelectOption[] = [
  { text: 'All scopes', value: 'all' },
  { text: 'Music', value: 'music' },
  { text: 'Video', value: 'video' },
  { text: 'News', value: 'news' },
  { text: 'Devotional', value: 'devotional' },
];

const scopeFormOptions: SelectOption[] = scopeOptions.filter(o => o.value !== 'all');

export function ContentCategoriesPageClient() {
  const [page, setPage] = useQueryState('page', parseAsInteger.withDefault(1));
  const [pageSize] = useQueryState('pagesize', parseAsInteger.withDefault(DEFAULT_PAGE_SIZE));
  const [searchQuery, setSearchQuery] = useQueryState('search', parseAsString.withDefault(''));
  const [scopeFilter, setScopeFilter] = useQueryState('scope', parseAsString.withDefault('all'));
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [refreshKey, setRefreshKey] = useState(0);
  const [categories, setCategories] = useState<IContentCategoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);

  const [createOpen, setCreateOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<IContentCategoryItem | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<IContentCategoryItem | null>(null);
  const [formName, setFormName] = useState('');
  const [formScope, setFormScope] = useState('music');
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
      if (searchQuery.trim()) params.append('search', searchQuery.trim());
      if (scopeFilter && scopeFilter !== 'all') params.append('scope', scopeFilter);
      const res = await callApi('ADMIN_CONTENT_CATEGORIES_LIST', {
        query: `?${params.toString()}` as `?${string}`,
      });
      if (res.type !== 'success') {
        setCategories([]);
        setTotalPages(1);
        return;
      }
      setCategories(res.data.categories ?? []);
      setTotalPages(res.data.pagination?.totalPages ?? 1);
    } catch {
      setCategories([]);
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
  }, [refreshKey, page, pageSize, searchQuery, scopeFilter]);

  const handleRefresh = () => setRefreshKey(k => k + 1);

  const openCreate = () => {
    setFormName('');
    setFormScope('music');
    setFormOrder('0');
    setFormActive('yes');
    setEditTarget(null);
    setCreateOpen(true);
  };

  const openEdit = (c: IContentCategoryItem) => {
    setEditTarget(c);
    setFormName(c.name);
    setFormScope(c.scope);
    setFormOrder(String(c.displayOrder ?? 0));
    setFormActive(c.isActive === false ? 'no' : 'yes');
    setCreateOpen(true);
  };

  const handleSave = async () => {
    if (!formName.trim()) return;
    setSaving(true);
    try {
      if (editTarget) {
        const res = await callApi('ADMIN_CONTENT_CATEGORIES_UPDATE', {
          query: `/${editTarget._id}` as `/${string}`,
          payload: {
            name: formName.trim(),
            scope: formScope as IContentCategoryItem['scope'],
            displayOrder: Number(formOrder) || 0,
            isActive: formActive === 'yes',
          },
        });
        if (res.type !== 'success') throw new Error(res.error?.message ?? 'Failed');
      } else {
        const res = await callApi('ADMIN_CONTENT_CATEGORIES_CREATE', {
          payload: {
            name: formName.trim(),
            scope: formScope as IContentCategoryItem['scope'],
            displayOrder: Number(formOrder) || 0,
            isActive: formActive === 'yes',
          },
        });
        if (res.type !== 'success') throw new Error(res.error?.message ?? 'Failed');
      }
      setCreateOpen(false);
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
      const res = await callApi('ADMIN_CONTENT_CATEGORIES_DELETE', {
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
            searchPlaceholder="Search categories..."
            searchValue={searchQuery}
            onSearchChange={setSearchQuery}
            onSearchApply={() => setPage(1)}
            filters={[
              {
                label: 'Scope',
                value: scopeFilter,
                options: scopeOptions,
                onChange: v => {
                  setScopeFilter(v);
                  setPage(1);
                },
              },
            ]}
            onApplyFilters={() => setPage(1)}
          />
        </div>
        <RegularBtn LeftIcon={Plus} text="New category" onClick={openCreate} />
      </div>

      <div className="rounded-lg border border-border overflow-hidden flex flex-col min-h-0">
        <div className="overflow-auto sleek-scrollbar flex-1">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 sticky top-0">
              <tr className="text-left border-b border-border">
                <th className="p-3 font-medium">Name</th>
                <th className="p-3 font-medium">Slug</th>
                <th className="p-3 font-medium">Scope</th>
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
              ) : categories.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-muted-foreground">
                    No categories yet.
                  </td>
                </tr>
              ) : (
                categories.map(c => (
                  <tr key={c._id} className="border-b border-border/60 hover:bg-muted/30">
                    <td className="p-3">{c.name}</td>
                    <td className="p-3 font-mono text-xs">{c.slug}</td>
                    <td className="p-3">
                      <Badge variant="secondary">{c.scope}</Badge>
                    </td>
                    <td className="p-3">{c.displayOrder ?? 0}</td>
                    <td className="p-3">{c.isActive === false ? 'No' : 'Yes'}</td>
                    <td className="p-3">
                      <div className="flex gap-1">
                        <RegularBtn
                          type="button"
                          variant="ghost"
                          LeftIcon={Pencil}
                          onClick={() => openEdit(c)}
                        />
                        <RegularBtn
                          type="button"
                          variant="ghost"
                          LeftIcon={Trash2}
                          onClick={() => setDeleteTarget(c)}
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
        open={createOpen}
        onOpenChange={v => !v && (setCreateOpen(false), setEditTarget(null))}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{editTarget ? 'Edit category' : 'New content category'}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-2">
            <RegularInput
              label="Name"
              value={formName}
              onChange={e => setFormName(e.target.value)}
              required
            />
            <RegularSelect
              label="Scope"
              value={formScope}
              onSelectChange={setFormScope}
              options={scopeFormOptions}
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
              onClick={() => setCreateOpen(false)}
            />
            <RegularBtn
              type="button"
              text="Save"
              loading={saving}
              disabled={saving || !formName.trim()}
              onClick={() => void handleSave()}
            />
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {deleteTarget && (
        <ApprovalModal
          open={!!deleteTarget}
          onOpenChange={v => !v && setDeleteTarget(null)}
          title="Delete category"
          description={`Delete "${deleteTarget.name}"?`}
          confirmText="Delete"
          onConfirm={() => void handleDelete()}
          loading={deleting}
        />
      )}
    </section>
  );
}
