'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { PastorApplicationForm } from '@/components/section/account/pastor-portal/PastorApplicationForm';
import type { IPastorApplication } from '@/lib/constants/endpoints';

export interface PastorApplicationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialApplication?: IPastorApplication | null;
  onApplied?: () => void;
}

export function PastorApplicationModal({
  open,
  onOpenChange,
  initialApplication,
  onApplied,
}: PastorApplicationModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[min(90vh,720px)] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Become a pastor</DialogTitle>
          <DialogDescription>
            Apply to answer community questions and serve through Ask a Pastor. Our team will review
            your application before your portal unlocks.
          </DialogDescription>
        </DialogHeader>
        <PastorApplicationForm
          bare
          className="pt-2"
          initialApplication={initialApplication}
          onSuccess={() => {
            onOpenChange(false);
            onApplied?.();
          }}
        />
      </DialogContent>
    </Dialog>
  );
}
