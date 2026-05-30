'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { VendorApplicationForm } from '@/components/section/marketplace/VendorApplicationForm';

export interface VendorApplicationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onApplied?: () => void;
}

export function VendorApplicationModal({
  open,
  onOpenChange,
  onApplied,
}: VendorApplicationModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[min(90vh,720px)] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Open a store</DialogTitle>
          <DialogDescription>
            Apply to sell on the marketplace. We will review your details and contact you shortly.
          </DialogDescription>
        </DialogHeader>
        <VendorApplicationForm
          bare
          className="pt-2"
          onSuccess={() => {
            onOpenChange(false);
            onApplied?.();
          }}
        />
      </DialogContent>
    </Dialog>
  );
}
