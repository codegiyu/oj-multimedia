'use client';

import { useEffect, useRef, useState } from 'react';
import { toast } from '@/components/atoms/Toast';

export const useClipboard = () => {
  const [state, setState] = useState('');
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const copy = (value: string, options?: { showToast?: boolean; clearAfter?: number }) => {
    const fallbackCopy = (text: string) => {
      const el = document.createElement('textarea');
      el.value = text;
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
    };

    const doCopy = async () => {
      try {
        if (navigator?.clipboard?.writeText) {
          await navigator.clipboard.writeText(value);
        } else {
          fallbackCopy(value);
        }
        setState(value);
        if (options?.showToast) {
          toast({ title: 'Copied', description: 'Copied to clipboard.', variant: 'success' });
        }
        if (typeof options?.clearAfter === 'number') {
          timeoutRef.current = setTimeout(() => setState(''), options.clearAfter);
        }
      } catch (err) {
        console.warn(err);
        fallbackCopy(value);
        setState(value);
      }
    };
    void doCopy();
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  return { copiedValue: state, copy };
};
