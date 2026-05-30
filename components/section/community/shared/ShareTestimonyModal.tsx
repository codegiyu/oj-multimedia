'use client';

import { Heart } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ShareTestimonyForm } from '../testimonies/ShareTestimonyForm';

interface ShareTestimonyModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ShareTestimonyModal({ open, onOpenChange }: ShareTestimonyModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="mx-auto mb-2 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
            <Heart className="h-7 w-7 text-primary" />
          </div>
          <DialogTitle className="text-center">Share Your Testimony</DialogTitle>
          <DialogDescription className="text-center">
            Your story matters. Share how God has worked in your life and inspire others in the
            community.
          </DialogDescription>
        </DialogHeader>
        <ShareTestimonyForm onSuccess={() => onOpenChange(false)} />
      </DialogContent>
    </Dialog>
  );
}
