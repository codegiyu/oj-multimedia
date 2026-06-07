'use client';

import { useState } from 'react';
import { UserCheck, UserPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { LoginModal } from '@/components/auth/LoginModal';
import { callApi } from '@/lib/services/callApi';
import { useAuthStore } from '@/lib/store/useAuthStore';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

export interface ArtistFollowState {
  isFollowing: boolean;
  followerCount: number;
}

interface ArtistFollowButtonProps {
  artistId: string;
  initialIsFollowing?: boolean;
  initialFollowerCount?: number;
  onFollowChange?: (state: ArtistFollowState) => void;
  variant?: 'compact' | 'prominent';
  className?: string;
}

export function ArtistFollowButton({
  artistId,
  initialIsFollowing = false,
  initialFollowerCount = 0,
  onFollowChange,
  variant = 'compact',
  className,
}: ArtistFollowButtonProps) {
  const user = useAuthStore(state => state.user);
  const [isFollowing, setIsFollowing] = useState(initialIsFollowing);
  const [followerCount, setFollowerCount] = useState(initialFollowerCount);
  const [isPending, setIsPending] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  const applyState = (next: ArtistFollowState) => {
    setIsFollowing(next.isFollowing);
    setFollowerCount(next.followerCount);
    onFollowChange?.(next);
  };

  const handleClick = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();

    if (!user) {
      setIsLoginModalOpen(true);
      return;
    }

    if (isPending) return;

    const nextFollowing = !isFollowing;
    const previous = { isFollowing, followerCount };
    const optimisticCount = nextFollowing ? followerCount + 1 : Math.max(0, followerCount - 1);

    applyState({ isFollowing: nextFollowing, followerCount: optimisticCount });
    setIsPending(true);

    try {
      if (nextFollowing) {
        const { data, error, message } = await callApi('USER_FOLLOW_ARTIST', {
          query: `/${artistId}`,
        });

        if (error) {
          throw new Error(message || 'Could not follow artist');
        }

        const resolvedCount =
          typeof data?.follow?.followers === 'number' ? data.follow.followers : optimisticCount;

        applyState({ isFollowing: true, followerCount: resolvedCount });
        return;
      }

      const { error, message } = await callApi('USER_UNFOLLOW_ARTIST', {
        query: `/${artistId}`,
      });

      if (error) {
        throw new Error(message || 'Could not unfollow artist');
      }

      applyState({ isFollowing: false, followerCount: optimisticCount });
    } catch (err) {
      applyState(previous);
      toast.error(err instanceof Error ? err.message : 'Could not update follow status');
    } finally {
      setIsPending(false);
    }
  };

  const isProminent = variant === 'prominent';
  const Icon = isFollowing ? UserCheck : UserPlus;
  const label = isFollowing ? 'Following' : 'Follow';

  return (
    <>
      <Button
        type="button"
        variant={isFollowing ? 'outline' : 'default'}
        size={isProminent ? 'default' : 'sm'}
        className={cn(isProminent ? 'min-w-[120px]' : 'h-8 px-3 text-xs', className)}
        aria-pressed={isFollowing}
        disabled={isPending}
        onClick={event => void handleClick(event)}>
        <Icon className={cn('shrink-0', isProminent ? 'w-4 h-4' : 'w-3.5 h-3.5')} />
        {label}
      </Button>
      <LoginModal
        open={isLoginModalOpen}
        onOpenChange={setIsLoginModalOpen}
        title="Sign in to follow artists"
        description="Create an account or sign in to follow your favorite artists and creators."
      />
    </>
  );
}
