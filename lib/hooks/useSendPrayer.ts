'use client';

import { useState } from 'react';
import { callApi } from '@/lib/services/callApi';
import { getErrorMessage } from '@/lib/utils/general';
import { toast } from '@/components/atoms/Toast';
import { useAuthStore } from '@/lib/store/useAuthStore';

interface UseSendPrayerOptions {
  initialCount?: number;
  onCountChange?: (count: number) => void;
}

export function useSendPrayer(requestId: string, options: UseSendPrayerOptions = {}) {
  const user = useAuthStore(state => state.user);
  const [prayerCount, setPrayerCount] = useState(options.initialCount ?? 0);
  const [isPending, setIsPending] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [hasSent, setHasSent] = useState(false);

  const updateCount = (count: number) => {
    setPrayerCount(count);
    options.onCountChange?.(count);
  };

  const sendPrayer = async (event?: {
    preventDefault?: () => void;
    stopPropagation?: () => void;
  }) => {
    event?.preventDefault?.();
    event?.stopPropagation?.();

    if (!user) {
      setIsLoginModalOpen(true);
      return;
    }

    if (isPending || hasSent) {
      if (hasSent) {
        toast({
          title: 'Already praying',
          description: 'You have already sent a prayer for this request.',
          variant: 'default',
        });
      }
      return;
    }

    const previousCount = prayerCount;
    setIsPending(true);
    updateCount(previousCount + 1);

    const res = await callApi('PUBLIC_PRAYER_REQUEST_PRAY', {
      query: `/${encodeURIComponent(requestId)}/pray`,
    });

    setIsPending(false);

    if (res.error) {
      updateCount(previousCount);

      const isDuplicate = res.error.responseCode === 409;
      toast({
        title: isDuplicate ? 'Already praying' : 'Unable to send prayer',
        description: isDuplicate
          ? 'You have already sent a prayer for this request.'
          : getErrorMessage(res.error),
        variant: 'error',
      });

      if (isDuplicate) {
        setHasSent(true);
      }

      return;
    }

    const prayers = (res.data as { prayers?: number } | undefined)?.prayers;
    if (typeof prayers === 'number') {
      updateCount(prayers);
    }

    setHasSent(true);
    toast({
      title: 'Praying!',
      description: 'Thank you for joining in prayer.',
      variant: 'success',
    });
  };

  return {
    prayerCount,
    isPending,
    hasSent,
    sendPrayer,
    isLoginModalOpen,
    setIsLoginModalOpen,
    formatPrayerCount: (count: number) =>
      `${count.toLocaleString()} prayer${count === 1 ? '' : 's'} sent`,
  };
}
