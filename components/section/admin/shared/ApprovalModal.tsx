'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { RegularBtn } from '@/components/atoms/RegularBtn';

export interface ApprovalModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  confirmText?: string;
  onConfirm: () => void | Promise<void>;
  loading?: boolean;
}

export function ApprovalModal({
  open,
  onOpenChange,
  title,
  description,
  confirmText = 'Approve',
  onConfirm,
  loading = false,
}: ApprovalModalProps) {
  const handleConfirm = async () => {
    await onConfirm();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md" showCloseButton={!loading}>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>
        <DialogFooter>
          <RegularBtn
            text="Cancel"
            variant="ghost"
            onClick={() => onOpenChange(false)}
            disabled={loading}
          />
          <RegularBtn
            text={confirmText}
            variant="default"
            onClick={handleConfirm}
            loading={loading}
          />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
