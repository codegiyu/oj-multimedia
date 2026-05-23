'use client';

import { useCallback, useState } from 'react';
import { toast } from 'sonner';
import { useAuthStore } from '@/lib/store/useAuthStore';

export function useContentFavoriteStub() {
  const user = useAuthStore(state => state.user);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  const requestFavorite = useCallback(
    (event?: { preventDefault: () => void; stopPropagation: () => void }) => {
      event?.preventDefault();
      event?.stopPropagation();

      if (!user) {
        setIsLoginModalOpen(true);
        return;
      }

      toast.info('Favorites are coming soon. You will be able to save music and videos here.');
    },
    [user]
  );

  return {
    requestFavorite,
    isLoginModalOpen,
    setIsLoginModalOpen,
  };
}
