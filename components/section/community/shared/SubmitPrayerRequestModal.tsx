'use client';

import { HandHeart } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { SubmitPrayerRequestForm } from '../prayer-requests/SubmitPrayerRequestForm';

interface SubmitPrayerRequestModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SubmitPrayerRequestModal({ open, onOpenChange }: SubmitPrayerRequestModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="mx-auto mb-2 flex h-14 w-14 items-center justify-center rounded-full bg-accent/10">
            <HandHeart className="h-7 w-7 text-accent" />
          </div>
          <DialogTitle className="text-center">Submit a Prayer Request</DialogTitle>
          <DialogDescription className="text-center">
            Share your prayer need with our community. We will join you in prayer.
          </DialogDescription>
        </DialogHeader>
        <SubmitPrayerRequestForm onSuccess={() => onOpenChange(false)} />
      </DialogContent>
    </Dialog>
  );
}
