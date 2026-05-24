'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { DashboardPageHeader } from '@/components/layout/user-dashboard';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import type {
  ContentFavoriteEntityType,
  IUserContentFavoriteItem,
} from '@/lib/constants/endpoints';
import { useInitFavoritesStore, useFavoritesStore } from '@/lib/store/favoritesStore';
import { favoriteKey } from '@/lib/utils/favorites';
import { toast } from 'sonner';
import { Heart, Music, Play, Newspaper, BookOpen } from 'lucide-react';
import { FillImage } from '@/components/general/FillImage';

const TYPE_LABELS: Record<ContentFavoriteEntityType, string> = {
  music: 'Music',
  video: 'Videos',
  news: 'News',
  devotional: 'Devotionals',
};

const TYPE_ICONS: Record<ContentFavoriteEntityType, typeof Music> = {
  music: Music,
  video: Play,
  news: Newspaper,
  devotional: BookOpen,
};

export interface AccountFavoritesPageClientProps {
  initialItems: IUserContentFavoriteItem[];
  initialPagination: { page: number; limit: number; total: number; totalPages: number };
  initialLoadError: string | null;
}

export function AccountFavoritesPageClient({
  initialItems,
  initialPagination: _initialPagination,
  initialLoadError,
}: AccountFavoritesPageClientProps) {
  const router = useRouter();
  const [items, setItems] = useState<IUserContentFavoriteItem[]>(initialItems);
  const [removingKey, setRemovingKey] = useState<string | null>(null);
  const toggleFavorite = useFavoritesStore(state => state.actions.toggleFavorite);

  useEffect(() => {
    const keys: Record<string, true> = {};
    for (const item of initialItems) {
      keys[favoriteKey(item.entityType, item.entityId)] = true;
    }
    useInitFavoritesStore.setState({ hydrated: true, favoriteKeys: keys });
  }, [initialItems]);

  const grouped = useMemo(() => {
    const map = new Map<ContentFavoriteEntityType, IUserContentFavoriteItem[]>();
    for (const item of items) {
      const list = map.get(item.entityType) ?? [];
      list.push(item);
      map.set(item.entityType, list);
    }
    return map;
  }, [items]);

  const handleRemove = async (item: IUserContentFavoriteItem) => {
    const key = favoriteKey(item.entityType, item.entityId);
    setRemovingKey(key);

    const result = await toggleFavorite(item.entityType, item.entityId);

    setRemovingKey(null);

    if (result.error) {
      toast.error(result.error);
      return;
    }

    setItems(prev =>
      prev.filter(i => !(i.entityType === item.entityType && i.entityId === item.entityId))
    );
  };

  if (initialLoadError) {
    return (
      <div className="space-y-6">
        <DashboardPageHeader
          title="My favorites"
          description="Music, videos, and more you've saved"
        />
        <div className="rounded-xl border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive flex items-center justify-between gap-4">
          <span>{initialLoadError}</span>
          <Button
            variant="outline"
            size="sm"
            className="border-destructive text-destructive hover:bg-destructive/10"
            onClick={() => router.refresh()}>
            Retry
          </Button>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="space-y-8">
        <DashboardPageHeader
          title="My favorites"
          description="Music, videos, and more you've saved"
        />
        <div className="mx-auto max-w-md rounded-2xl border border-border/80 bg-card px-6 py-12 text-center shadow-sm">
          <Heart className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">
            You have not saved any content yet. Tap the heart on music or video cards to add
            favorites.
          </p>
          <Button asChild className="mt-6 rounded-full bg-primary hover:bg-primary/90">
            <Link href="/music">Explore music</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <DashboardPageHeader title="My favorites" description="Music, videos, and more you've saved">
        <Button asChild variant="outline" className="rounded-full">
          <Link href="/music">Explore music</Link>
        </Button>
      </DashboardPageHeader>

      {Array.from(grouped.entries()).map(([entityType, sectionItems]) => {
        const Icon = TYPE_ICONS[entityType];

        return (
          <section key={entityType} className="space-y-4">
            <h2 className="flex items-center gap-2 text-lg font-semibold text-foreground">
              <Icon className="h-5 w-5 text-primary" />
              {TYPE_LABELS[entityType]}
            </h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {sectionItems.map(item => {
                const key = favoriteKey(item.entityType, item.entityId);

                return (
                  <Card
                    key={item._id}
                    className="gap-0 overflow-hidden border-border/80 py-0 shadow-sm">
                    <div className="relative aspect-square bg-muted">
                      <FillImage
                        src={item.image ?? ''}
                        alt=""
                        imageContext="dashboard"
                        sizes="(max-width: 768px) 50vw, 280px"
                      />
                      <button
                        type="button"
                        className="absolute left-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-md"
                        onClick={() => void handleRemove(item)}
                        disabled={removingKey === key}
                        aria-label="Remove from favorites">
                        <Heart className="h-4 w-4 fill-current" />
                      </button>
                    </div>
                    <div className="space-y-2 p-4">
                      <Link
                        href={item.href}
                        className="font-semibold text-foreground hover:underline line-clamp-2">
                        {item.title}
                      </Link>
                      {item.subtitle && (
                        <p className="text-sm text-muted-foreground truncate">{item.subtitle}</p>
                      )}
                      <Button asChild variant="outline" size="sm" className="w-full rounded-full">
                        <Link href={item.href}>View</Link>
                      </Button>
                    </div>
                  </Card>
                );
              })}
            </div>
          </section>
        );
      })}
    </div>
  );
}
