/* eslint-disable react-hooks/exhaustive-deps */
'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
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
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useRouter } from 'next/navigation';
import { MUSIC_ITEMS, type MusicItem } from '@/lib/constants/music';
import { populateArtist } from '@/lib/utils/community/artists';
import { NEWS_ITEMS, type NewsItem } from '@/lib/constants/news';
import { DEVOTIONALS_ITEMS } from '@/lib/constants/community/devotionals';
import { TESTIMONIES_ITEMS } from '@/lib/constants/community/testimonies';
import { PRAYER_REQUESTS_ITEMS } from '@/lib/constants/community/prayer-requests';
import { QUESTIONS_ITEMS } from '@/lib/constants/community/questions';
import { POLLS_ITEMS } from '@/lib/constants/community/polls';
import { RESOURCES_ITEMS } from '@/lib/constants/community/resources';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface SearchItem {
  _id: string;
  title: string;
  type: string;
  artist?: string;
  category?: string;
  creator?: string;
  author?: string;
}

// Transform music items to search items
const transformMusicItems = (items: MusicItem[]): SearchItem[] => {
  return items.map(item => ({
    _id: item._id,
    title: item.title,
    type: 'music',
    artist: populateArtist(item.artist)?.name ?? 'Unknown',
    category: item.category,
  }));
};

// Transform news items to search items
const transformNewsItems = (items: NewsItem[]): SearchItem[] => {
  return items.map(item => ({
    _id: item._id,
    title: item.title,
    type: 'news',
    category: item.category,
    creator: item.author,
  }));
};

// Transform devotional items to search items
const transformDevotionalItems = (items: typeof DEVOTIONALS_ITEMS): SearchItem[] => {
  return items.map(item => ({
    _id: item._id,
    title: item.title,
    type: 'devotional',
    category: item.category,
    creator: item.author,
  }));
};

// Transform testimony items to search items
const transformTestimonyItems = (items: typeof TESTIMONIES_ITEMS): SearchItem[] => {
  return items.map(item => ({
    _id: item._id,
    title: item.title || item.content.substring(0, 50),
    type: 'testimony',
    category: item.category,
    author: item.author,
  }));
};

// Transform prayer request items to search items
const transformPrayerRequestItems = (items: typeof PRAYER_REQUESTS_ITEMS): SearchItem[] => {
  return items.map(item => ({
    _id: item._id,
    title: item.title,
    type: 'prayer-request',
    category: item.category,
    author: item.author,
  }));
};

// Transform question items to search items
const transformQuestionItems = (items: typeof QUESTIONS_ITEMS): SearchItem[] => {
  return items.map(item => ({
    _id: item._id,
    title: item.question,
    type: 'question',
    category: item.category,
    author: item.author,
  }));
};

// Transform poll items to search items
const transformPollItems = (items: typeof POLLS_ITEMS): SearchItem[] => {
  return items.map(item => ({
    _id: item._id,
    title: item.question,
    type: 'poll',
    category: item.category,
  }));
};

// Transform resource items to search items
const transformResourceItems = (items: typeof RESOURCES_ITEMS): SearchItem[] => {
  return items.map(item => ({
    _id: item._id,
    title: item.title,
    type: 'resource',
    category: item.category || item.genre || item.templateType || item.productCategory,
  }));
};

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
};

function getDetailHref(item: SearchItem): string | null {
  switch (item.type) {
    case 'music':
      return `/music/${item._id}`;
    case 'news':
      return `/news/story/${item._id}`;
    case 'video':
      return `/videos/${item._id}`;
    case 'devotional':
      return `/community/devotionals/${item._id}`;
    case 'testimony':
      return `/community/testimonies/${item._id}`;
    case 'prayer-request':
      return `/community/prayer-requests/${item._id}`;
    case 'question':
      return `/community/ask-a-pastor/${item._id}`;
    case 'poll':
      return `/community/polls-and-voting/${item._id}`;
    case 'resource':
      return `/community/resources`;
    default:
      return null;
  }
}

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
      ...transformDevotionalItems(DEVOTIONALS_ITEMS),
      ...transformTestimonyItems(TESTIMONIES_ITEMS),
      ...transformPrayerRequestItems(PRAYER_REQUESTS_ITEMS),
      ...transformQuestionItems(QUESTIONS_ITEMS),
      ...transformPollItems(POLLS_ITEMS),
      ...transformResourceItems(RESOURCES_ITEMS),
    ];

    const filtered = allContent.filter(
      item =>
        item.title.toLowerCase().includes(lowerQuery) ||
        (item.artist && item.artist.toLowerCase().includes(lowerQuery)) ||
        (item.category && item.category.toLowerCase().includes(lowerQuery)) ||
        (item.creator && item.creator.toLowerCase().includes(lowerQuery)) ||
        (item.author && item.author.toLowerCase().includes(lowerQuery))
    );

    setResults(filtered.slice(0, 8));
  };

  const handleViewAll = () => {
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query)}`);
      onClose();
    }
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
                              {result.artist ||
                                // result.pastor ||
                                result.author ||
                                result.category ||
                                result.creator}
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
                          onClick={onClose}
                          className="block">
                          {row}
                        </Link>
                      ) : (
                        <div key={`${result.type}-${result._id}`}>{row}</div>
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
