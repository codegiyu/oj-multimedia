'use client';

import { Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { LoginModal } from '@/components/auth/LoginModal';
import { useContentFavoriteStub } from '@/lib/hooks/useContentFavoriteStub';
import { cn } from '@/lib/utils';

interface ContentFavoriteStubButtonProps {
  className?: string;
  iconClassName?: string;
  'aria-label'?: string;
}

export function ContentFavoriteStubButton({
  className,
  iconClassName,
  'aria-label': ariaLabel = 'Add to favorites',
}: ContentFavoriteStubButtonProps) {
  const { requestFavorite, isLoginModalOpen, setIsLoginModalOpen } = useContentFavoriteStub();

  return (
    <>
      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        className={className}
        aria-label={ariaLabel}
        onClick={requestFavorite}>
        <Heart className={cn('w-4 h-4', iconClassName)} />
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
