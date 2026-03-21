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
import type { PrayerRequestListItem } from '@/lib/types/community';

interface AnswerPrayerRequestModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  prayerRequest: PrayerRequestListItem | null;
  onSuccess: () => void;
}

export function AnswerPrayerRequestModal({
  open,
  onOpenChange,
  prayerRequest,
  onSuccess,
}: AnswerPrayerRequestModalProps) {
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    if (!prayerRequest || !answer.trim()) return;
    setLoading(true);
    try {
      const { error } = await callApi('ADMIN_PRAYER_REQUEST_ANSWER', {
        query: `/${prayerRequest._id}/answer` as `/${string}`,
        payload: { answer: answer.trim() },
      });
      if (error) throw new Error(error.message);
      setAnswer('');
      onOpenChange(false);
      onSuccess();
    } catch (err) {
      console.error('Answer prayer request failed:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenChange = (val: boolean) => {
    if (!val) setAnswer('');
    onOpenChange(val);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-md" showCloseButton={!loading}>
        <DialogHeader>
          <DialogTitle>Answer Prayer Request</DialogTitle>
          <DialogDescription>
            {prayerRequest ? `Add an answer for "${prayerRequest.title}"` : ''}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-3 py-2">
          <RegularTextarea
            label="Answer"
            placeholder="Enter your answer..."
            value={answer}
            onChange={e => setAnswer(e.target.value)}
            required
            rows={6}
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
            text="Submit Answer"
            variant="default"
            onClick={handleConfirm}
            loading={loading}
            disabled={!answer.trim()}
          />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
