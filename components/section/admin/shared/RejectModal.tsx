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

export interface RejectModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  confirmText?: string;
  reasonLabel?: string;
  reasonPlaceholder?: string;
  onConfirm: (reason: string) => void | Promise<void>;
  loading?: boolean;
}

export function RejectModal({
  open,
  onOpenChange,
  title,
  description,
  confirmText = 'Reject',
  reasonLabel = 'Reason for rejection',
  reasonPlaceholder = 'Enter the reason...',
  onConfirm,
  loading = false,
}: RejectModalProps) {
  const [reason, setReason] = useState('');

  const handleConfirm = async () => {
    if (!reason.trim()) return;
    await onConfirm(reason.trim());
    setReason('');
    onOpenChange(false);
  };

  const handleOpenChange = (val: boolean) => {
    if (!val) setReason('');
    onOpenChange(val);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-md" showCloseButton={!loading}>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>
        <div className="grid gap-3 py-2">
          <RegularTextarea
            label={reasonLabel}
            placeholder={reasonPlaceholder}
            value={reason}
            onChange={e => setReason(e.target.value)}
            required
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
            text={confirmText}
            variant="destructive"
            onClick={handleConfirm}
            loading={loading}
            disabled={!reason.trim()}
          />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
