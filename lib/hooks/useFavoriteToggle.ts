'use client';

import { useState } from 'react';
import type { ContentFavoriteEntityType } from '@/lib/constants/endpoints';
import { useAuthStore } from '@/lib/store/useAuthStore';
import { useFavoritesStore } from '@/lib/store/favoritesStore';
import { toast } from 'sonner';

export function useFavoriteToggle(entityType: ContentFavoriteEntityType, entityId: string) {
  const user = useAuthStore(state => state.user);
  const isFavorite = useFavoritesStore(state => state.actions.isFavorite(entityType, entityId));
  const isPending = useFavoritesStore(state => state.actions.isPending(entityType, entityId));
  const toggleFavorite = useFavoritesStore(state => state.actions.toggleFavorite);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  const toggle = async (event?: { preventDefault: () => void; stopPropagation: () => void }) => {
    event?.preventDefault();
    event?.stopPropagation();

    if (!user) {
      setIsLoginModalOpen(true);
      return;
    }

    const result = await toggleFavorite(entityType, entityId);
    if (result.error) {
      toast.error(result.error);
    }
  };

  return {
    isFavorite,
    isPending,
    toggle,
    isLoginModalOpen,
    setIsLoginModalOpen,
  };
}
