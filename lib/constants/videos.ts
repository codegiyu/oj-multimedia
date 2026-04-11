/**
 * Unified Video Item Type
 * This type represents all video items across different sections.
 * Items are marked with flags (isTrending, isFeatured, isRecent, isShortForm, isFeaturedCreator) to indicate
 * which sections they belong to.
 */
export interface VideoItem {
  _id: string;
  /** URL slug from API (for analytics / tracked download paths). */
  slug?: string;
  title: string;
  /** Artist profile _id (e.g. 'ap-1'). Getters populate to { _id, name }. */
  creator: string;
  thumbnail: string;
  category:
    | 'music'
    | 'short'
    | 'talks'
    | 'creative'
    | 'inspirational'
    | 'live'
    | 'podcasts'
    | 'sermon'
    | 'movie';
  // Trending Video fields
  views?: string;
  duration?: string;
  uploadedAt?: string;
  isNew?: boolean;
  // Featured Video fields
  featured?: boolean;
  // Recent Upload fields
  // (uses uploadedAt, category, views, duration from above)
  // Short Form fields
  likes?: string;
  // Featured Creator fields
  name?: string; // For creators, name is the same as creator
  avatar?: string; // For creators, avatar is the same as thumbnail
  followers?: string;
  videos?: number;
  verified?: boolean;
  latestVideo?: {
    thumbnail: string;
    title: string;
    duration: string;
  };
  // Section flags
  isTrending?: boolean;
  isFeatured?: boolean;
  isRecent?: boolean;
  isShortForm?: boolean;
  isFeaturedCreator?: boolean;
  // Detail page fields
  videoUrl?: string; // For streaming
  /** Hosted video file (preferred over legacy videoUrl for non-YouTube). */
  videoFileUrl?: string;
  /** YouTube / Vimeo page or watch URL. */
  embedUrl?: string;
  /** Normalized iframe src (from API). */
  youtubeEmbedUrl?: string;
  downloadUrl?: string; // For downloads
  description?: string; // Video description
  isMonetizable?: boolean; // Whether download requires payment
  downloadPrice?: number; // Price for download (if monetizable)
  releaseDate?: string; // Release date
  tags?: string[]; // Tags for related content
  comments?: number; // Number of comments
}

/**
 * Central array of all video items
 * Items can appear in multiple sections by setting multiple flags
 * At least 2-3 items per category are included
 */
export const VIDEOS_ITEMS: VideoItem[] = [
  // Music Videos - Trending
  {
    _id: '1',
    title: 'Sunset Vibes - Official Music Video',
    creator: 'ap-1',
    thumbnail: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=225&fit=crop',
    category: 'music',
    views: '2.4M',
    duration: '3:45',
    uploadedAt: '2 days ago',
    isNew: true,
    isTrending: true,
    isFeatured: true,
    videoUrl: 'https://example.com/videos/sunset-vibes.mp4',
    downloadUrl: 'https://example.com/downloads/sunset-vibes.mp4',
    description:
      'An uplifting afrobeats music video that captures the essence of golden hour vibes. Featuring stunning visuals and energetic performances.',
    releaseDate: '2025-01-15',
    tags: ['music', 'afrobeats', 'upbeat'],
    isMonetizable: false,
    comments: 124,
  },
  {
    _id: '2',
    title: 'City Lights - Live Performance',
    creator: 'ap-5',
    thumbnail: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=225&fit=crop',
    category: 'music',
    views: '1.8M',
    duration: '4:12',
    uploadedAt: '3 days ago',
    isNew: false,
    isTrending: true,
    isFeatured: false,
    videoUrl: 'https://example.com/videos/city-lights.mp4',
    downloadUrl: 'https://example.com/downloads/city-lights.mp4',
    description:
      'A captivating live performance of City Lights featuring stunning stage production.',
    releaseDate: '2025-01-12',
    tags: ['music', 'live', 'performance'],
    isMonetizable: true,
    downloadPrice: 4.99,
    comments: 89,
  },
  // Music Videos - Recent
  {
    _id: '3',
    title: 'Summer Feels - Music Video',
    creator: 'ap-5',
    thumbnail: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=169&fit=crop',
    category: 'music',
    uploadedAt: '12 hours ago',
    views: '4.3K',
    duration: '3:50',
    isRecent: true,
    videoUrl: 'https://example.com/videos/summer-feels.mp4',
    downloadUrl: 'https://example.com/downloads/summer-feels.mp4',
    description: 'A vibrant summer-themed music video with beach vibes.',
    releaseDate: '2025-01-24',
    tags: ['music', 'summer', 'beach'],
    isMonetizable: false,
    comments: 23,
  },
  {
    _id: '4',
    title: 'Electric Soul - Music Video',
    creator: 'ap-3',
    thumbnail: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=225&fit=crop',
    category: 'music',
    views: '980K',
    duration: '3:55',
    uploadedAt: '5 days ago',
    isNew: false,
    isTrending: true,
    videoUrl: 'https://example.com/videos/electric-soul.mp4',
    downloadUrl: 'https://example.com/downloads/electric-soul.mp4',
    description: 'An electrifying music video with dynamic visuals and powerful performances.',
    releaseDate: '2025-01-10',
    tags: ['music', 'electronic', 'soul'],
    isMonetizable: false,
    comments: 67,
  },

  // Short Clips - Trending
  {
    _id: '5',
    title: 'Midnight Dreams - Creative Short',
    creator: 'ap-4',
    thumbnail: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=225&fit=crop',
    category: 'short',
    views: '1.2M',
    duration: '2:28',
    uploadedAt: '4 days ago',
    isNew: true,
    isTrending: true,
    isShortForm: true,
    videoUrl: 'https://example.com/videos/midnight-dreams.mp4',
    downloadUrl: 'https://example.com/downloads/midnight-dreams.mp4',
    description: 'A creative short film exploring themes of dreams and reality.',
    releaseDate: '2025-01-11',
    tags: ['short', 'creative', 'artistic'],
    isMonetizable: false,
    likes: '45K',
    comments: 156,
  },
  {
    _id: '6',
    title: 'Quick Tips: Creative Hacks',
    creator: 'ap-1',
    thumbnail: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=200&h=300&fit=crop',
    category: 'short',
    views: '450K',
    duration: '0:45',
    likes: '12K',
    isShortForm: true,
    isRecent: true,
    uploadedAt: '1 day ago',
    videoUrl: 'https://example.com/videos/creative-hacks.mp4',
    downloadUrl: 'https://example.com/downloads/creative-hacks.mp4',
    description: 'Quick and practical creative tips in under a minute.',
    releaseDate: '2025-01-24',
    tags: ['short', 'tips', 'tutorial'],
    isMonetizable: false,
    comments: 89,
  },
  // Short Clips - Recent
  {
    _id: '7',
    title: '60 Second Motivation',
    creator: 'ap-2',
    thumbnail: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=300&fit=crop',
    category: 'short',
    views: '380K',
    duration: '1:00',
    likes: '9.5K',
    isShortForm: true,
    isRecent: true,
    uploadedAt: '2 days ago',
    videoUrl: 'https://example.com/videos/motivation-60s.mp4',
    downloadUrl: 'https://example.com/downloads/motivation-60s.mp4',
    description: 'A powerful 60-second motivational message to start your day.',
    releaseDate: '2025-01-23',
    tags: ['short', 'motivation', 'inspiration'],
    isMonetizable: false,
    comments: 234,
  },
  {
    _id: '8',
    title: 'Behind the Scenes',
    creator: 'ap-3',
    thumbnail: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=200&h=300&fit=crop',
    category: 'short',
    views: '320K',
    duration: '0:30',
    likes: '8.2K',
    isShortForm: true,
    videoUrl: 'https://example.com/videos/behind-scenes.mp4',
    downloadUrl: 'https://example.com/downloads/behind-scenes.mp4',
    description: 'A quick behind-the-scenes look at the creative process.',
    releaseDate: '2025-01-20',
    tags: ['short', 'behind-scenes', 'creative'],
    isMonetizable: false,
    comments: 67,
  },

  // Talks & Speeches - Trending
  {
    _id: '9',
    title: 'Golden Hour - Inspirational Talk',
    creator: 'ap-6',
    thumbnail: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=225&fit=crop',
    category: 'talks',
    views: '756K',
    duration: '8:08',
    uploadedAt: '6 days ago',
    isNew: false,
    isTrending: true,
    isFeatured: true,
    videoUrl: 'https://example.com/videos/golden-hour-talk.mp4',
    downloadUrl: 'https://example.com/downloads/golden-hour-talk.mp4',
    description:
      'An inspiring talk about finding your purpose and making the most of every moment. A powerful message of hope and determination.',
    releaseDate: '2025-01-09',
    tags: ['talks', 'inspiration', 'motivation'],
    isMonetizable: true,
    downloadPrice: 9.99,
    comments: 189,
  },
  {
    _id: '10',
    title: 'Rise Up - Motivational Talk',
    creator: 'ap-2',
    thumbnail: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=169&fit=crop',
    category: 'talks',
    uploadedAt: '8 hours ago',
    views: '5.8K',
    duration: '12:45',
    isRecent: true,
    videoUrl: 'https://example.com/videos/rise-up.mp4',
    downloadUrl: 'https://example.com/downloads/rise-up.mp4',
    description:
      'A powerful motivational talk about overcoming challenges and rising above adversity.',
    releaseDate: '2025-01-25',
    tags: ['talks', 'motivation', 'overcoming'],
    isMonetizable: false,
    comments: 45,
  },
  // Talks & Speeches - Featured
  {
    _id: '11',
    title: 'The Art of Creative Expression',
    creator: 'ap-3',
    thumbnail: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=225&fit=crop',
    category: 'talks',
    views: '3.2M',
    duration: '15:30',
    featured: true,
    isFeatured: true,
    videoUrl: 'https://example.com/videos/creative-expression.mp4',
    downloadUrl: 'https://example.com/downloads/creative-expression.mp4',
    description:
      'A deep dive into the art of creative expression, exploring how artists find their voice and share their message with the world.',
    releaseDate: '2024-12-20',
    tags: ['talks', 'creative', 'art'],
    isMonetizable: false,
    comments: 456,
  },

  // Creative Content - Trending
  {
    _id: '12',
    title: 'Street Dreams - Short Film',
    creator: 'ap-4',
    thumbnail: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=225&fit=crop',
    category: 'creative',
    views: '654K',
    duration: '5:32',
    uploadedAt: '1 week ago',
    isNew: true,
    isTrending: true,
    isFeatured: true,
    videoUrl: 'https://example.com/videos/street-dreams.mp4',
    downloadUrl: 'https://example.com/downloads/street-dreams.mp4',
    description: 'A cinematic short film exploring urban dreams and aspirations.',
    releaseDate: '2025-01-08',
    tags: ['creative', 'film', 'urban'],
    isMonetizable: false,
    comments: 234,
  },
  {
    _id: '13',
    title: 'Ocean Waves - Creative Content',
    creator: 'ap-5',
    thumbnail: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=225&fit=crop',
    category: 'creative',
    views: '543K',
    duration: '3:18',
    uploadedAt: '1 week ago',
    isNew: false,
    isTrending: true,
    videoUrl: 'https://example.com/videos/ocean-waves.mp4',
    downloadUrl: 'https://example.com/downloads/ocean-waves.mp4',
    description: 'A visually stunning creative piece featuring ocean waves and natural beauty.',
    releaseDate: '2025-01-08',
    tags: ['creative', 'nature', 'visual'],
    isMonetizable: false,
    comments: 123,
  },
  // Creative Content - Recent
  {
    _id: '14',
    title: 'Creative Process: Behind the Scenes',
    creator: 'ap-4',
    thumbnail: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=169&fit=crop',
    category: 'creative',
    uploadedAt: '6 hours ago',
    views: '6.2K',
    duration: '8:20',
    isRecent: true,
    videoUrl: 'https://example.com/videos/creative-process.mp4',
    downloadUrl: 'https://example.com/downloads/creative-process.mp4',
    description: 'An intimate look at the creative process from concept to completion.',
    releaseDate: '2025-01-25',
    tags: ['creative', 'behind-scenes', 'process'],
    isMonetizable: false,
    comments: 34,
  },
  {
    _id: '15',
    title: 'Heart & Soul - Creative Short',
    creator: 'ap-6',
    thumbnail: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=169&fit=crop',
    category: 'creative',
    uploadedAt: '1 day ago',
    views: '3.9K',
    duration: '1:25',
    isRecent: true,
    isShortForm: true,
    videoUrl: 'https://example.com/videos/heart-soul.mp4',
    downloadUrl: 'https://example.com/downloads/heart-soul.mp4',
    description: 'A short creative piece exploring themes of heart and soul.',
    releaseDate: '2025-01-24',
    tags: ['creative', 'short', 'artistic'],
    isMonetizable: false,
    likes: '2.1K',
    comments: 56,
  },

  // Inspirational - Trending
  {
    _id: '16',
    title: 'Inspiring Stories: Journey to Success',
    creator: 'ap-1',
    thumbnail: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=225&fit=crop',
    category: 'inspirational',
    views: '2.8M',
    duration: '22:15',
    featured: true,
    isFeatured: true,
    isTrending: true,
    videoUrl: 'https://example.com/videos/journey-success.mp4',
    downloadUrl: 'https://example.com/downloads/journey-success.mp4',
    description:
      'Powerful stories of individuals who overcame obstacles to achieve their dreams. An inspiring journey of resilience and determination.',
    releaseDate: '2024-12-15',
    tags: ['inspirational', 'success', 'motivation'],
    isMonetizable: false,
    comments: 567,
  },
  {
    _id: '17',
    title: 'Morning Inspiration - Daily Motivation',
    creator: 'ap-6',
    thumbnail: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=169&fit=crop',
    category: 'inspirational',
    uploadedAt: '2 hours ago',
    views: '12K',
    duration: '5:30',
    isRecent: true,
    videoUrl: 'https://example.com/videos/morning-inspiration.mp4',
    downloadUrl: 'https://example.com/downloads/morning-inspiration.mp4',
    description: 'Start your day with inspiration and motivation.',
    releaseDate: '2025-01-25',
    tags: ['inspirational', 'morning', 'motivation'],
    isMonetizable: false,
    comments: 78,
  },
  // Inspirational - Featured
  {
    _id: '18',
    title: 'Deep Dive: Creative Process',
    creator: 'ap-5',
    thumbnail: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=225&fit=crop',
    category: 'inspirational',
    views: '1.5M',
    duration: '18:45',
    featured: false,
    isFeatured: true,
    videoUrl: 'https://example.com/videos/deep-dive-creative.mp4',
    downloadUrl: 'https://example.com/downloads/deep-dive-creative.mp4',
    description:
      'An in-depth exploration of the creative process and what drives artistic expression.',
    releaseDate: '2025-01-05',
    tags: ['inspirational', 'creative', 'process'],
    isMonetizable: false,
    comments: 345,
  },

  // Live Performances - Trending
  {
    _id: '19',
    title: 'Live Concert: Summer Vibes',
    creator: 'ap-1',
    thumbnail: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=225&fit=crop',
    category: 'live',
    views: '1.9M',
    duration: '45:20',
    featured: true,
    isFeatured: true,
    isTrending: true,
    videoUrl: 'https://example.com/videos/summer-vibes-concert.mp4',
    downloadUrl: 'https://example.com/downloads/summer-vibes-concert.mp4',
    description:
      'A full-length live concert recording featuring multiple artists and incredible stage production.',
    releaseDate: '2024-12-10',
    tags: ['live', 'concert', 'music'],
    isMonetizable: true,
    downloadPrice: 14.99,
    comments: 789,
  },
  {
    _id: '20',
    title: 'Urban Flow - Street Performance',
    creator: 'ap-2',
    thumbnail: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=169&fit=crop',
    category: 'live',
    uploadedAt: '4 hours ago',
    views: '8.5K',
    duration: '4:15',
    isRecent: true,
    videoUrl: 'https://example.com/videos/urban-flow-live.mp4',
    downloadUrl: 'https://example.com/downloads/urban-flow-live.mp4',
    description: 'An energetic street performance capturing the raw energy of urban music.',
    releaseDate: '2025-01-25',
    tags: ['live', 'street', 'performance'],
    isMonetizable: false,
    comments: 45,
  },
  {
    _id: '21',
    title: 'Neon Nights - Live Stream',
    creator: 'ap-5',
    thumbnail: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=225&fit=crop',
    category: 'live',
    views: '432K',
    duration: '12:50',
    uploadedAt: '1 week ago',
    isNew: false,
    isTrending: true,
    videoUrl: 'https://example.com/videos/neon-nights-live.mp4',
    downloadUrl: 'https://example.com/downloads/neon-nights-live.mp4',
    description: 'A live stream performance featuring neon visuals and electronic music.',
    releaseDate: '2025-01-08',
    tags: ['live', 'stream', 'electronic'],
    isMonetizable: false,
    comments: 234,
  },

  // Podcasts / Video Talks - Trending
  {
    _id: '22',
    title: 'The Creative Mindset Podcast',
    creator: 'ap-2',
    thumbnail: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=225&fit=crop',
    category: 'podcasts',
    views: '1.1M',
    duration: '35:20',
    uploadedAt: '3 days ago',
    isNew: true,
    isTrending: true,
    isFeatured: true,
    videoUrl: 'https://example.com/videos/creative-mindset-podcast.mp4',
    downloadUrl: 'https://example.com/downloads/creative-mindset-podcast.mp4',
    description:
      'A deep conversation about developing a creative mindset, featuring insights from successful artists and creators.',
    releaseDate: '2025-01-12',
    tags: ['podcasts', 'creative', 'mindset'],
    isMonetizable: false,
    comments: 345,
  },
  {
    _id: '23',
    title: 'Success Stories: Episode 5',
    creator: 'ap-3',
    thumbnail: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=225&fit=crop',
    category: 'podcasts',
    views: '890K',
    duration: '28:45',
    uploadedAt: '5 days ago',
    isNew: false,
    isTrending: true,
    videoUrl: 'https://example.com/videos/success-stories-ep5.mp4',
    downloadUrl: 'https://example.com/downloads/success-stories-ep5.mp4',
    description:
      'Episode 5 of Success Stories featuring an interview with a renowned entrepreneur.',
    releaseDate: '2025-01-10',
    tags: ['podcasts', 'success', 'entrepreneurship'],
    isMonetizable: false,
    comments: 234,
  },
  // Podcasts - Recent
  {
    _id: '24',
    title: 'Tech Talk: Future of Media',
    creator: 'ap-4',
    thumbnail: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=169&fit=crop',
    category: 'podcasts',
    uploadedAt: '1 day ago',
    views: '15K',
    duration: '42:10',
    isRecent: true,
    videoUrl: 'https://example.com/videos/tech-talk-media.mp4',
    downloadUrl: 'https://example.com/downloads/tech-talk-media.mp4',
    description: 'A discussion about the future of media and content creation in the digital age.',
    releaseDate: '2025-01-24',
    tags: ['podcasts', 'tech', 'media'],
    isMonetizable: false,
    comments: 67,
  },

  // Featured Creators
  {
    _id: '25',
    name: 'DJ Flame',
    creator: 'ap-1',
    title: 'DJ Flame',
    category: 'music',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
    thumbnail: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
    followers: '125K',
    videos: 45,
    views: '2.4M',
    verified: true,
    isFeaturedCreator: true,
    latestVideo: {
      thumbnail:
        'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=200&h=112&fit=crop',
      title: 'Sunset Vibes - Official',
      duration: '3:45',
    },
  },
  {
    _id: '26',
    name: 'Luna Belle',
    creator: 'ap-5',
    title: 'Luna Belle',
    category: 'creative',
    avatar: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=100&h=100&fit=crop',
    thumbnail: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=100&h=100&fit=crop',
    followers: '98K',
    videos: 32,
    views: '1.8M',
    verified: true,
    isFeaturedCreator: true,
    latestVideo: {
      thumbnail:
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=112&fit=crop',
      title: 'City Lights - Live',
      duration: '4:12',
    },
  },
  {
    _id: '27',
    name: 'Marcus Jay',
    creator: 'ap-3',
    title: 'Marcus Jay',
    category: 'talks',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
    thumbnail: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
    followers: '87K',
    videos: 28,
    views: '1.2M',
    verified: false,
    isFeaturedCreator: true,
    latestVideo: {
      thumbnail:
        'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=200&h=112&fit=crop',
      title: 'Electric Soul',
      duration: '3:55',
    },
  },
  {
    _id: '28',
    name: 'Aria Rose',
    creator: 'ap-6',
    title: 'Aria Rose',
    category: 'inspirational',
    avatar: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=100&h=100&fit=crop',
    thumbnail: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=100&h=100&fit=crop',
    followers: '76K',
    videos: 41,
    views: '980K',
    verified: true,
    isFeaturedCreator: true,
    latestVideo: {
      thumbnail:
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=112&fit=crop',
      title: 'Golden Hour Talk',
      duration: '8:08',
    },
  },
  {
    _id: '29',
    name: 'The Wave',
    creator: 'ap-4',
    title: 'The Wave',
    category: 'live',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
    thumbnail: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
    followers: '64K',
    videos: 53,
    views: '756K',
    verified: false,
    isFeaturedCreator: true,
    latestVideo: {
      thumbnail:
        'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=200&h=112&fit=crop',
      title: 'Midnight Dreams',
      duration: '2:28',
    },
  },
  {
    _id: '30',
    name: 'King Vibe',
    creator: 'ap-4',
    title: 'King Vibe',
    category: 'short',
    avatar: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=100&h=100&fit=crop',
    thumbnail: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=100&h=100&fit=crop',
    followers: '58K',
    videos: 22,
    views: '654K',
    verified: true,
    isFeaturedCreator: true,
    latestVideo: {
      thumbnail:
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=112&fit=crop',
      title: 'Street Dreams',
      duration: '5:32',
    },
  },

  // Sermons - Trending
  {
    _id: '31',
    title: 'Sunday Service: The Power of Prayer',
    creator: 'ap-6',
    thumbnail: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=225&fit=crop',
    category: 'sermon',
    views: '15K',
    duration: '1:15:00',
    uploadedAt: '1 day ago',
    isNew: true,
    isTrending: true,
    isFeatured: true,
    videoUrl: 'https://example.com/videos/power-of-prayer.mp4',
    downloadUrl: 'https://example.com/downloads/power-of-prayer.mp4',
    description: 'Full Sunday service recording focusing on the importance of prayer.',
    releaseDate: '2025-02-01',
    tags: ['sermon', 'prayer', 'church'],
    isMonetizable: false,
    comments: 45,
  },
  {
    _id: '32',
    title: 'Understanding the Scriptures',
    creator: 'ap-6',
    thumbnail: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=225&fit=crop',
    category: 'sermon',
    views: '5K',
    duration: '45:30',
    uploadedAt: '3 days ago',
    isNew: false,
    isTrending: true,
    videoUrl: 'https://example.com/videos/understanding-scriptures.mp4',
    downloadUrl: 'https://example.com/downloads/understanding-scriptures.mp4',
    description: 'Deep dive into biblical interpretation.',
    releaseDate: '2025-01-29',
    tags: ['sermon', 'bible', 'study'],
    isMonetizable: false,
    comments: 12,
  },
];
