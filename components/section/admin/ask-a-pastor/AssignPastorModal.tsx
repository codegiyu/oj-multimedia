'use client';

import { useEffect, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { RegularBtn } from '@/components/atoms/RegularBtn';
import { RegularSelect } from '@/components/atoms/RegularSelect';
import { callApi } from '@/lib/services/callApi';
import type { QuestionListItem, PastorListItem } from '@/lib/types/community';
import type { SelectOption } from '@/lib/types/general';

interface AssignPastorModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  question: QuestionListItem | null;
  onSuccess: () => void;
}

export function AssignPastorModal({
  open,
  onOpenChange,
  question,
  onSuccess,
}: AssignPastorModalProps) {
  const [pastorId, setPastorId] = useState('');
  const [pastorOptions, setPastorOptions] = useState<SelectOption[]>([]);
  const [loading, setLoading] = useState(false);
  const [optionsLoading, setOptionsLoading] = useState(false);

  useEffect(() => {
    if (!open) {
      setPastorId('');
      return;
    }

    let cancelled = false;
    setOptionsLoading(true);

    void (async () => {
      const res = await callApi('ADMIN_PASTORS_LIST', {
        query: '?limit=100&page=1' as `?${string}`,
      });

      if (cancelled) return;

      if (res.type === 'success' && res.data.pastors) {
        setPastorOptions(
          res.data.pastors.map((p: PastorListItem) => ({
            text: p.name,
            value: p._id,
          }))
        );
      } else {
        setPastorOptions([]);
      }

      setOptionsLoading(false);
    })();

    return () => {
      cancelled = true;
    };
  }, [open]);

  const handleConfirm = async () => {
    if (!question || !pastorId) return;
    setLoading(true);
    try {
      const { error } = await callApi('ADMIN_ASK_PASTOR_ASSIGN_PASTOR', {
        query: `/${question._id}/assign-pastor` as `/${string}`,
        payload: { pastorId },
      });
      if (error) throw new Error(error.message);
      setPastorId('');
      onOpenChange(false);
      onSuccess();
    } catch (err) {
      console.error('Assign pastor failed:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenChange = (val: boolean) => {
    if (!val) setPastorId('');
    onOpenChange(val);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-md" showCloseButton={!loading}>
        <DialogHeader>
          <DialogTitle>Assign pastor</DialogTitle>
          <DialogDescription>
            Link a pastor to this question before publishing an answer.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-3 py-2">
          <RegularSelect
            label="Pastor"
            placeholder={optionsLoading ? 'Loading pastors...' : 'Select a pastor'}
            value={pastorId}
            onSelectChange={v => setPastorId(v)}
            options={pastorOptions}
            disabled={loading || optionsLoading || pastorOptions.length === 0}
            required
          />
        </div>
        <DialogFooter>
          <RegularBtn
            text="Cancel"
            variant="ghost"
            onClick={() => handleOpenChange(false)}
            disabled={loading}
          />
          <RegularBtn
            text="Assign"
            variant="default"
            onClick={handleConfirm}
            loading={loading}
            disabled={!pastorId}
          />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
