/* eslint-disable react-hooks/exhaustive-deps */
'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, Music, Newspaper, Video, Users, ArrowRight } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useRouter } from 'next/navigation';
import { MUSIC_ITEMS, type MusicItem } from '@/lib/constants/music';
import { NEWS_ITEMS, type NewsItem } from '@/lib/constants/news';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface SearchItem {
  id: number;
  title: string;
  type: string;
  artist?: string;
  category?: string;
  creator?: string;
}

// Transform music items to search items
const transformMusicItems = (items: MusicItem[]): SearchItem[] => {
  return items.map(item => ({
    id: item.id,
    title: item.title,
    type: 'music',
    artist: item.artist,
    category: item.category,
  }));
};

// Transform news items to search items
const transformNewsItems = (items: NewsItem[]): SearchItem[] => {
  return items.map(item => ({
    id: item.id,
    title: item.title,
    type: 'news',
    category: item.category,
    creator: item.author,
  }));
};

// TODO: Add video and community transform functions when constants are available
// const transformVideoItems = (items: VideoItem[]): SearchItem[] => { ... }
// const transformCommunityItems = (items: CommunityItem[]): SearchItem[] => { ... }

const typeIcons: Record<string, typeof Music> = {
  music: Music,
  news: Newspaper,
  video: Video,
  community: Users,
};

const typeColors: Record<string, string> = {
  music: 'text-primary',
  news: 'text-accent',
  video: 'text-secondary',
  community: 'text-muted-foreground',
};

export const SearchModal = ({ isOpen, onClose }: SearchModalProps) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchItem[]>([]);
  const router = useRouter();
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  const handleSearch = (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([]);
      return;
    }

    const lowerQuery = searchQuery.toLowerCase();

    // Transform and combine all searchable content
    const allContent: SearchItem[] = [
      ...transformMusicItems(MUSIC_ITEMS),
      ...transformNewsItems(NEWS_ITEMS),
      // TODO: Add when video constants are available
      // ...transformVideoItems(VIDEO_ITEMS),
      // TODO: Add when community constants are available
      // ...transformCommunityItems(COMMUNITY_ITEMS),
    ];

    const filtered = allContent.filter(
      item =>
        item.title.toLowerCase().includes(lowerQuery) ||
        (item.artist && item.artist.toLowerCase().includes(lowerQuery)) ||
        (item.category && item.category.toLowerCase().includes(lowerQuery)) ||
        (item.creator && item.creator.toLowerCase().includes(lowerQuery))
    );

    setResults(filtered.slice(0, 8));
  };

  const handleViewAll = () => {
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query)}`);
      onClose();
    }
  };

  const handleResultClick = (result: SearchItem) => {
    router.push(`/search?q=${encodeURIComponent(result.title)}`);
    onClose();
  };

  // Debounced search with 500ms delay
  useEffect(() => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = setTimeout(() => {
      handleSearch(query);
    }, 500);

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [query]);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.addEventListener('keydown', handleEsc);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-foreground/20 backdrop-blur-sm z-50"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed top-20 left-1/2 -translate-x-1/2 w-full max-w-2xl z-50 px-4">
            <div className="bg-card rounded-2xl shadow-2xl border border-border overflow-hidden">
              {/* Search Input */}
              <div className="flex items-center gap-3 p-4 border-b border-border">
                <Search className="w-5 h-5 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search music, news, videos, community..."
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  className="flex-1 border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 text-lg placeholder:text-muted-foreground"
                  autoFocus
                />
                <button
                  onClick={onClose}
                  className="p-2 rounded-full hover:bg-muted transition-colors">
                  <X className="w-5 h-5 text-muted-foreground" />
                </button>
              </div>

              {/* Results */}
              <div className="max-h-96 overflow-y-auto">
                {results.length > 0 ? (
                  <div className="p-2">
                    {results.map((result, index) => {
                      const Icon = typeIcons[result.type];
                      const colorClass = typeColors[result.type];

                      return (
                        <motion.button
                          key={`${result.type}-${result.id}`}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                          onClick={() => handleResultClick(result)}
                          className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-muted transition-colors text-left">
                          <div className={`p-2 rounded-lg bg-muted ${colorClass}`}>
                            <Icon className="w-4 h-4" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-foreground truncate">{result.title}</p>
                            <p className="text-sm text-muted-foreground truncate">
                              {result.artist || result.category || result.creator}
                            </p>
                          </div>
                          <span className="text-xs text-muted-foreground capitalize px-2 py-1 bg-muted rounded-full">
                            {result.type}
                          </span>
                        </motion.button>
                      );
                    })}
                  </div>
                ) : query.trim() ? (
                  <div className="p-8 text-center text-muted-foreground">
                    <p>No results found for "{query}"</p>
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
                            onClose();
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

              {/* View All Results */}
              {query.trim() && results.length > 0 && (
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
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
