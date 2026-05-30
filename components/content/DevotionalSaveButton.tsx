'use client';

import { Bookmark } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { LoginModal } from '@/components/auth/LoginModal';
import { useFavoriteToggle } from '@/lib/hooks/useFavoriteToggle';
import { cn } from '@/lib/utils';

interface DevotionalSaveButtonProps {
  entityId: string;
  variant?: 'icon' | 'labeled';
  className?: string;
  iconClassName?: string;
}

export function DevotionalSaveButton({
  entityId,
  variant = 'icon',
  className,
  iconClassName,
}: DevotionalSaveButtonProps) {
  const { isFavorite, isPending, toggle, isLoginModalOpen, setIsLoginModalOpen } =
    useFavoriteToggle('devotional', entityId);

  if (variant === 'labeled') {
    return (
      <>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className={cn('gap-2', className)}
          disabled={isPending}
          aria-pressed={isFavorite}
          onClick={e => void toggle(e)}>
          <Bookmark className={cn('w-4 h-4', isFavorite && 'fill-primary text-primary')} />
          {isFavorite ? 'Saved' : 'Save'}
        </Button>
        <LoginModal
          open={isLoginModalOpen}
          onOpenChange={setIsLoginModalOpen}
          title="Sign in to save devotionals"
          description="Create an account or sign in to save devotionals to your favorites."
        />
      </>
    );
  }

  return (
    <>
      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        className={cn('p-2 rounded-lg hover:bg-muted shrink-0', className)}
        aria-label={isFavorite ? 'Remove from saved devotionals' : 'Save devotional'}
        aria-pressed={isFavorite}
        disabled={isPending}
        onClick={e => void toggle(e)}>
        <Bookmark
          className={cn(
            'w-4 h-4 text-muted-foreground transition-colors',
            isFavorite && 'fill-primary text-primary',
            iconClassName
          )}
        />
      </Button>
      <LoginModal
        open={isLoginModalOpen}
        onOpenChange={setIsLoginModalOpen}
        title="Sign in to save devotionals"
        description="Create an account or sign in to save devotionals to your favorites."
      />
    </>
  );
}
