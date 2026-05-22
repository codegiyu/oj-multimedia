'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { RegularBtn } from '@/components/atoms/RegularBtn';
import { RegularTextarea } from '@/components/atoms/RegularTextarea';
import { callApi } from '@/lib/services/callApi';
import type { QuestionListItem } from '@/lib/types/community';

interface RejectAskAPastorModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  question: QuestionListItem | null;
  onSuccess: () => void;
}

export function RejectAskAPastorModal({
  open,
  onOpenChange,
  question,
  onSuccess,
}: RejectAskAPastorModalProps) {
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    if (!question) return;
    setLoading(true);
    try {
      const { error } = await callApi('ADMIN_ASK_PASTOR_REJECT', {
        query: `/${question._id}/reject` as `/${string}`,
        payload: { reason: reason.trim() },
      });
      if (error) throw new Error(error.message);
      setReason('');
      onOpenChange(false);
      onSuccess();
    } catch (err) {
      console.error('Reject question failed:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenChange = (val: boolean) => {
    if (!val) setReason('');
    onOpenChange(val);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-md" showCloseButton={!loading}>
        <DialogHeader>
          <DialogTitle>Reject question</DialogTitle>
          <DialogDescription>
            Optionally provide a reason. The question will not appear as active on the site.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-3 py-2">
          <RegularTextarea
            label="Reason (optional)"
            placeholder="Reason for rejection..."
            value={reason}
            onChange={e => setReason(e.target.value)}
            rows={4}
            disabled={loading}
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
            text="Reject"
            variant="destructive"
            onClick={handleConfirm}
            loading={loading}
          />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
