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
import { RegularTextarea } from '@/components/atoms/RegularTextarea';
import { RegularBtn } from '@/components/atoms/RegularBtn';
import { callApi } from '@/lib/services/callApi';
import { toast } from 'sonner';
import type { AllEndpoints } from '@/lib/constants/endpoints';

type AppealEndpoint = Extract<
  keyof AllEndpoints,
  'VENDOR_SUBMIT_APPEAL' | 'ARTIST_SUBMIT_APPEAL' | 'PASTOR_SUBMIT_APPEAL'
>;

export interface RoleProfileAppealModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  endpoint: AppealEndpoint;
  onSubmitted: () => void;
}

export function RoleProfileAppealModal({
  open,
  onOpenChange,
  endpoint,
  onSubmitted,
}: RoleProfileAppealModalProps) {
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    const trimmed = message.trim();
    if (!trimmed) {
      toast.error('Please describe why your account should be restored.');
      return;
    }

    setLoading(true);
    const { error } = await callApi(endpoint, { payload: { message: trimmed } });
    setLoading(false);

    if (error) {
      toast.error(error.message ?? 'Failed to submit appeal');
      return;
    }

    toast.success('Appeal submitted. Our team will review it.');
    setMessage('');
    onOpenChange(false);
    onSubmitted();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Appeal to admin</DialogTitle>
          <DialogDescription>
            Explain why your account should be unsuspended. This creates a new appeal record for our
            team.
          </DialogDescription>
        </DialogHeader>

        <RegularTextarea
          label="Your message"
          value={message}
          onChange={e => setMessage(e.target.value)}
          rows={5}
          placeholder="Tell us what happened and why your profile should be restored…"
        />

        <DialogFooter>
          <RegularBtn type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </RegularBtn>
          <RegularBtn type="button" onClick={() => void handleSubmit()} disabled={loading}>
            {loading ? 'Submitting…' : 'Submit appeal'}
          </RegularBtn>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
