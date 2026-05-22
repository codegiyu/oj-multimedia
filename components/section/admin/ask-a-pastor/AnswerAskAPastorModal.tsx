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

interface AnswerAskAPastorModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  question: QuestionListItem | null;
  onSuccess: () => void;
}

export function AnswerAskAPastorModal({
  open,
  onOpenChange,
  question,
  onSuccess,
}: AnswerAskAPastorModalProps) {
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    if (!question || !answer.trim()) return;
    setLoading(true);
    try {
      const { error } = await callApi('ADMIN_ASK_PASTOR_UPDATE', {
        query: `/${question._id}` as `/${string}`,
        payload: { answer: answer.trim(), status: 'answered' },
      });
      if (error) throw new Error(error.message);
      setAnswer('');
      onOpenChange(false);
      onSuccess();
    } catch (err) {
      console.error('Answer question failed:', err);
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
          <DialogTitle>Answer question</DialogTitle>
          <DialogDescription>
            {question ? `Publish an answer for this community question.` : ''}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-3 py-2">
          <RegularTextarea
            label="Answer"
            placeholder="Enter the pastor's answer..."
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
            text="Publish answer"
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
