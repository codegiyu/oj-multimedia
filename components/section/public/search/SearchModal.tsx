'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { motion } from 'motion/react';
import {
  Search,
  X,
  Music,
  Newspaper,
  Video,
  Users,
  ArrowRight,
  BookOpen,
  Heart,
  HandHeart,
  HelpCircle,
  BarChart3,
  FolderOpen,
  Loader2,
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useRouter } from 'next/navigation';
import type { ISearchResultItem } from '@/lib/constants/endpoints';
import { callApi } from '@/lib/services/callApi';
import { getSearchResultDetailHref } from '@/lib/utils/searchResultRoutes';
import { Dialog, DialogClose, DialogContent, DialogTitle } from '@/components/ui/dialog';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const typeIcons: Record<string, typeof Music> = {
  music: Music,
  news: Newspaper,
  video: Video,
  community: Users,
  devotional: BookOpen,
  testimony: Heart,
  'prayer-request': HandHeart,
  question: HelpCircle,
  poll: BarChart3,
  resource: FolderOpen,
  artist: Users,
};

const typeColors: Record<string, string> = {
  music: 'text-primary',
  news: 'text-accent',
  video: 'text-secondary',
  community: 'text-muted-foreground',
  devotional: 'text-blue-500',
  testimony: 'text-pink-500',
  'prayer-request': 'text-red-500',
  question: 'text-orange-500',
  poll: 'text-green-500',
  resource: 'text-yellow-500',
  artist: 'text-violet-500',
};

function getDetailHref(item: ISearchResultItem): string | null {
  return getSearchResultDetailHref(item.type, item._id);
}

function resultSubtitle(item: ISearchResultItem): string {
  return item.subtitle?.trim() || item.meta?.trim() || '';
}

export const SearchModal = ({ isOpen, onClose }: SearchModalProps) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<ISearchResultItem[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const requestIdRef = useRef(0);

  useEffect(() => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    const q = query.trim();
    if (!q) return;
    debounceTimerRef.current = setTimeout(() => {
      setLoading(true);
      const myId = ++requestIdRef.current;
      const params = new URLSearchParams();
      params.set('q', q);
      params.set('limit', '8');

      void (async () => {
        const res = await callApi('PUBLIC_SEARCH', {
          query: `?${params.toString()}` as `?${string}`,
        });
        if (myId !== requestIdRef.current) return;
        setLoading(false);
        if (res.type !== 'success' || !res.data?.results) {
          setResults([]);
          return;
        }
        setResults(res.data.results);
      })();
    }, 500);

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [query]);

  const handleClose = () => {
    setQuery('');
    setResults([]);
    setLoading(false);
    onClose();
  };

  const handleViewAll = () => {
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
      handleClose();
    }
  };

  const showEmpty = query.trim() && !loading && results.length === 0;

  return (
    <Dialog
      open={isOpen}
      onOpenChange={v => {
        if (!v) handleClose();
      }}>
      <DialogContent
        showCloseButton={false}
        className="p-0 overflow-hidden bg-card rounded-2xl shadow-2xl border border-border gap-0 max-w-2xl w-full top-20 left-1/2 -translate-x-1/2 translate-y-0">
        <DialogTitle id="search-modal-title" className="sr-only">
          Search
        </DialogTitle>

        <div>
          <div className="flex items-center gap-3 p-4 border-b border-border">
            <Search className="w-5 h-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search music, news, videos, community..."
              value={query}
              onChange={e => {
                const next = e.target.value;
                setQuery(next);
                if (!next.trim()) {
                  setResults([]);
                  setLoading(false);
                }
              }}
              className="flex-1 border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 text-lg placeholder:text-muted-foreground"
              autoFocus
            />
            <DialogClose asChild>
              <button
                type="button"
                aria-label="Close search"
                className="p-2 rounded-full hover:bg-muted transition-colors">
                <X className="w-5 h-5 text-muted-foreground" />
              </button>
            </DialogClose>
          </div>

          <div className="max-h-96 overflow-y-auto">
            {loading && query.trim() ? (
              <div className="p-10 flex justify-center text-muted-foreground">
                <Loader2 className="w-8 h-8 animate-spin" aria-label="Searching" />
              </div>
            ) : results.length > 0 ? (
              <div className="p-2">
                {results.map((result, index) => {
                  const Icon = typeIcons[result.type] ?? Music;
                  const colorClass = typeColors[result.type] ?? 'text-muted-foreground';
                  const href = getDetailHref(result);

                  const row = (
                    <motion.div
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-muted transition-colors text-left">
                      <div className={`p-2 rounded-lg bg-muted ${colorClass}`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-foreground truncate">{result.title}</p>
                        <p className="text-sm text-muted-foreground truncate">
                          {resultSubtitle(result)}
                        </p>
                      </div>
                      <span className="text-xs text-muted-foreground capitalize px-2 py-1 bg-muted rounded-full">
                        {result.type}
                      </span>
                    </motion.div>
                  );

                  return href ? (
                    <Link
                      key={`${result.type}-${result._id}`}
                      href={href}
                      onClick={handleClose}
                      className="block">
                      {row}
                    </Link>
                  ) : (
                    <div key={`${result.type}-${result._id}`}>{row}</div>
                  );
                })}
              </div>
            ) : showEmpty ? (
              <div className="p-8 text-center text-muted-foreground">
                <p>
                  No results found for {'"'}
                  {query}
                  {'"'}
                </p>
              </div>
            ) : (
              <div className="p-6">
                <p className="text-sm text-muted-foreground mb-4">Quick Links</p>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { label: 'Trending Music', icon: Music, href: '/music' },
                    { label: 'Latest News', icon: Newspaper, href: '/news' },
                    { label: 'Community', icon: Users, href: '/community' },
                    { label: 'Videos', icon: Video, href: '/#videos' },
                  ].map(link => (
                    <button
                      key={link.label}
                      onClick={() => {
                        router.push(link.href);
                        handleClose();
                      }}
                      className="flex items-center gap-2 p-3 rounded-xl hover:bg-muted transition-colors text-left">
                      <link.icon className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm text-foreground">{link.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {query.trim() && results.length > 0 && !loading && (
            <div className="p-3 border-t border-border">
              <button
                onClick={handleViewAll}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors">
                View All Results
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
