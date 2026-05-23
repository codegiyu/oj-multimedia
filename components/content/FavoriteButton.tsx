'use client';

import { Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { LoginModal } from '@/components/auth/LoginModal';
import type { ContentFavoriteEntityType } from '@/lib/constants/endpoints';
import { useFavoriteToggle } from '@/lib/hooks/useFavoriteToggle';
import { cn } from '@/lib/utils';

interface FavoriteButtonProps {
  entityType: ContentFavoriteEntityType;
  entityId: string;
  className?: string;
  iconClassName?: string;
  'aria-label'?: string;
}

export function FavoriteButton({
  entityType,
  entityId,
  className,
  iconClassName,
  'aria-label': ariaLabel = 'Add to favorites',
}: FavoriteButtonProps) {
  const { isFavorite, isPending, toggle, isLoginModalOpen, setIsLoginModalOpen } = useFavoriteToggle(
    entityType,
    entityId
  );

  return (
    <>
      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        className={className}
        aria-label={isFavorite ? 'Remove from favorites' : ariaLabel}
        aria-pressed={isFavorite}
        disabled={isPending}
        onClick={e => void toggle(e)}>
        <Heart
          className={cn(
            'w-4 h-4 transition-colors',
            isFavorite && 'fill-primary text-primary',
            iconClassName
          )}
        />
      </Button>
      <LoginModal
        open={isLoginModalOpen}
        onOpenChange={setIsLoginModalOpen}
        title="Sign in to save favorites"
        description="Create an account or sign in to save music and videos to your favorites."
      />
    </>
  );
}
