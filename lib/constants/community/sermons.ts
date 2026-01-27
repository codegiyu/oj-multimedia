/**
 * Unified Sermon Item Type
 * This type represents all sermon content across different sections.
 * Items are marked with flags (isAudio, isVideo, isPopular, isTrending, isLatest) to indicate
 * which sections they belong to.
 */
export interface SermonItem {
  id: number;
  title: string;
  pastor: string;
  duration: string;
  category?: string;
  topic?: string;
  // Section flags
  isAudio?: boolean;
  isVideo?: boolean;
  isPopular?: boolean;
  isTrending?: boolean;
  isLatest?: boolean;
  // Audio sermon fields
  plays?: string;
  image?: string;
  date?: string;
  // Video sermon fields
  views?: string;
  thumbnail?: string;
  isLive?: boolean;
  isNew?: boolean;
  // Detail page fields
  audioUrl?: string;
  videoUrl?: string;
  transcript?: string;
  description?: string;
  tags?: string[];
  releaseDate?: string;
  pastorId?: number;
  relatedScriptures?: string[];
}

/**
 * Pastor Type
 */
export interface Pastor {
  id: number;
  name: string;
  title: string;
  church: string;
  image: string;
  sermons: number;
  followers: string;
  featured: boolean;
  topics: string[];
  expertise?: string[];
  questionsAnswered?: number;
  rating?: number;
}

/**
 * Sermon Topic Type
 */
export interface SermonTopic {
  id: number;
  name: string;
  count: number;
  description: string;
}

/**
 * Central array of all sermon items
 * Items can appear in multiple sections by setting multiple flags
 */
export const SERMONS_ITEMS: SermonItem[] = [
  // Audio Sermons
  {
    id: 1,
    title: 'Walking in Faith and Obedience',
    pastor: 'Pastor David Chen',
    duration: '45:30',
    category: 'Faith',
    topic: 'Faith',
    isAudio: true,
    isPopular: true,
    isLatest: true,
    plays: '12.5K',
    image: '/images/artist-1.jpg',
    date: '2026-01-25',
    audioUrl: 'https://example.com/audio/walking-in-faith.mp3',
    description:
      "A powerful message about walking in faith and obedience to God's word. Learn how to trust God in every season of life.",
    transcript:
      "Good morning, church. Today we're going to talk about walking in faith and obedience. Faith is not just believing that God exists, but trusting Him with every aspect of our lives...",
    tags: ['faith', 'obedience', 'trust'],
    releaseDate: '2026-01-25',
    pastorId: 1,
  },
  {
    id: 2,
    title: 'The Power of Prayer',
    pastor: 'Rev. Sarah Williams',
    duration: '38:15',
    category: 'Prayer',
    topic: 'Prayer',
    isAudio: true,
    isLatest: true,
    plays: '9.8K',
    image: '/images/artist-2.jpg',
    date: '2026-01-24',
    audioUrl: 'https://example.com/audio/power-of-prayer.mp3',
    description:
      'Discover the transformative power of prayer and how it can change your life and circumstances.',
    tags: ['prayer', 'spiritual-growth'],
    releaseDate: '2026-01-24',
    pastorId: 2,
  },
  {
    id: 3,
    title: "God's Unfailing Love",
    pastor: 'Bishop James Moore',
    duration: '42:20',
    category: 'Love',
    topic: 'Love',
    isAudio: true,
    isPopular: true,
    isTrending: true,
    plays: '15.2K',
    image: '/images/artist-3.jpg',
    date: '2026-01-23',
    audioUrl: 'https://example.com/audio/gods-unfailing-love.mp3',
    description:
      "Understanding the depth and breadth of God's love for us and how it transforms our lives.",
    tags: ['love', 'god', 'transformation'],
    releaseDate: '2026-01-23',
    pastorId: 3,
  },
  {
    id: 4,
    title: 'Finding Peace in Chaos',
    pastor: 'Pastor Grace Okonkwo',
    duration: '40:10',
    category: 'Peace',
    topic: 'Peace',
    isAudio: true,
    isLatest: true,
    plays: '8.3K',
    image: '/images/artist-1.jpg',
    date: '2026-01-22',
    audioUrl: 'https://example.com/audio/finding-peace.mp3',
    description: "Learn how to find God's peace even in the midst of life's storms and challenges.",
    tags: ['peace', 'trust', 'trials'],
    releaseDate: '2026-01-22',
    pastorId: 4,
  },
  {
    id: 5,
    title: 'The Grace of God',
    pastor: 'Pastor David Chen',
    duration: '48:45',
    category: 'Grace',
    topic: 'Grace',
    isAudio: true,
    plays: '11.7K',
    image: '/images/artist-1.jpg',
    date: '2026-01-21',
    audioUrl: 'https://example.com/audio/grace-of-god.mp3',
    description:
      'Exploring the amazing grace of God and how it saves, sustains, and transforms us.',
    tags: ['grace', 'salvation', 'transformation'],
    releaseDate: '2026-01-21',
    pastorId: 1,
  },
  {
    id: 6,
    title: 'Overcoming Temptation',
    pastor: 'Rev. Sarah Williams',
    duration: '35:30',
    category: 'Spiritual Warfare',
    topic: 'Spiritual Warfare',
    isAudio: true,
    plays: '7.9K',
    image: '/images/artist-2.jpg',
    date: '2026-01-20',
    audioUrl: 'https://example.com/audio/overcoming-temptation.mp3',
    description: 'Biblical strategies for overcoming temptation and walking in victory.',
    tags: ['temptation', 'victory', 'spiritual-warfare'],
    releaseDate: '2026-01-20',
    pastorId: 2,
  },
  // Video Sermons
  {
    id: 7,
    title: 'The Purpose of Your Life',
    pastor: 'Bishop James Moore',
    duration: '52:15',
    category: 'Purpose',
    topic: 'Purpose',
    isVideo: true,
    isPopular: true,
    isTrending: true,
    views: '24.8K',
    thumbnail: '/images/video-thumb-1.jpg',
    isLive: false,
    isNew: true,
    videoUrl: 'https://example.com/videos/purpose-of-life.mp4',
    description: "Discovering God's purpose for your life and how to walk in it daily.",
    transcript:
      "Today we're going to talk about purpose. Many people go through life wondering what their purpose is. But God has a plan for each of us...",
    tags: ['purpose', 'calling', 'destiny'],
    releaseDate: '2026-01-25',
    pastorId: 3,
  },
  {
    id: 8,
    title: 'Building Strong Relationships',
    pastor: 'Pastor Grace Okonkwo',
    duration: '46:20',
    category: 'Relationships',
    topic: 'Relationships',
    isVideo: true,
    isPopular: true,
    isLatest: true,
    views: '18.5K',
    thumbnail: '/images/video-thumb-2.jpg',
    isLive: false,
    isNew: false,
    videoUrl: 'https://example.com/videos/building-relationships.mp4',
    description: 'Biblical principles for building and maintaining strong, healthy relationships.',
    tags: ['relationships', 'marriage', 'friendship'],
    releaseDate: '2026-01-24',
    pastorId: 4,
  },
  {
    id: 9,
    title: 'Financial Stewardship',
    pastor: 'Pastor David Chen',
    duration: '44:30',
    category: 'Finance',
    topic: 'Finance',
    isVideo: true,
    isLatest: true,
    views: '16.2K',
    thumbnail: '/images/video-thumb-3.jpg',
    isLive: false,
    isNew: false,
    videoUrl: 'https://example.com/videos/financial-stewardship.mp4',
    description: "Understanding God's principles for managing finances and being a good steward.",
    tags: ['finance', 'stewardship', 'money'],
    releaseDate: '2026-01-23',
    pastorId: 1,
  },
  {
    id: 10,
    title: 'The Holy Spirit in Your Life',
    pastor: 'Rev. Sarah Williams',
    duration: '50:10',
    category: 'Holy Spirit',
    topic: 'Holy Spirit',
    isVideo: true,
    isTrending: true,
    views: '21.3K',
    thumbnail: '/images/video-thumb-1.jpg',
    isLive: false,
    isNew: true,
    videoUrl: 'https://example.com/videos/holy-spirit.mp4',
    description: 'Learning to walk in the power and presence of the Holy Spirit daily.',
    tags: ['holy-spirit', 'power', 'presence'],
    releaseDate: '2026-01-22',
    pastorId: 2,
  },
  {
    id: 11,
    title: 'Sunday Service - Live',
    pastor: 'Bishop James Moore',
    duration: '1:15:30',
    category: 'Worship',
    topic: 'Worship',
    isVideo: true,
    isPopular: true,
    views: '35.7K',
    thumbnail: '/images/video-thumb-2.jpg',
    isLive: true,
    isNew: true,
    videoUrl: 'https://example.com/videos/sunday-service-live.mp4',
    description: 'Join us for our weekly Sunday service with worship, prayer, and the Word.',
    tags: ['live', 'worship', 'service'],
    releaseDate: '2026-01-26',
    pastorId: 3,
  },
  {
    id: 12,
    title: 'Healing and Restoration',
    pastor: 'Pastor Grace Okonkwo',
    duration: '41:25',
    category: 'Healing',
    topic: 'Healing',
    isVideo: true,
    views: '14.6K',
    thumbnail: '/images/video-thumb-3.jpg',
    isLive: false,
    isNew: false,
    videoUrl: 'https://example.com/videos/healing-restoration.mp4',
    description: "God's power to heal and restore every area of our lives.",
    tags: ['healing', 'restoration', 'miracles'],
    releaseDate: '2026-01-21',
    pastorId: 4,
  },
];

/**
 * Array of pastors
 */
export const PASTORS: Pastor[] = [
  {
    id: 1,
    name: 'Pastor David Chen',
    title: 'Senior Pastor',
    church: 'Grace Community Church',
    image: '/images/artist-1.jpg',
    sermons: 156,
    followers: '12.5K',
    featured: true,
    topics: ['Faith', 'Prayer', 'Grace'],
    expertise: ['Faith', 'Prayer', 'Grace'],
    questionsAnswered: 45,
    rating: 4.9,
  },
  {
    id: 2,
    name: 'Rev. Sarah Williams',
    title: 'Associate Pastor',
    church: 'Hope Fellowship',
    image: '/images/artist-2.jpg',
    sermons: 98,
    followers: '8.9K',
    featured: true,
    topics: ['Prayer', 'Relationships', 'Spiritual Growth'],
    expertise: ['Prayer', 'Relationships', 'Spiritual Growth'],
    questionsAnswered: 32,
    rating: 4.8,
  },
  {
    id: 3,
    name: 'Bishop James Moore',
    title: 'Bishop',
    church: 'Victory Cathedral',
    image: '/images/artist-3.jpg',
    sermons: 203,
    followers: '18.2K',
    featured: true,
    topics: ['Love', 'Purpose', 'Worship'],
    expertise: ['Love', 'Purpose', 'Worship'],
    questionsAnswered: 67,
    rating: 4.9,
  },
  {
    id: 4,
    name: 'Pastor Grace Okonkwo',
    title: 'Pastor',
    church: 'Faith Assembly',
    image: '/images/artist-1.jpg',
    sermons: 87,
    followers: '7.3K',
    featured: false,
    topics: ['Peace', 'Relationships', 'Healing'],
    expertise: ['Peace', 'Relationships', 'Healing'],
    questionsAnswered: 28,
    rating: 4.7,
  },
];

/**
 * Array of sermon topics
 */
export const SERMON_TOPICS: SermonTopic[] = [
  {
    id: 1,
    name: 'Faith',
    count: 45,
    description: 'Messages about faith, trust, and believing in God',
  },
  {
    id: 2,
    name: 'Prayer',
    count: 38,
    description: 'Teaching on prayer and communion with God',
  },
  {
    id: 3,
    name: 'Love',
    count: 32,
    description: "Understanding God's love and loving others",
  },
  {
    id: 4,
    name: 'Purpose',
    count: 28,
    description: 'Discovering and walking in your God-given purpose',
  },
  {
    id: 5,
    name: 'Relationships',
    count: 25,
    description: 'Building healthy relationships with God and others',
  },
  {
    id: 6,
    name: 'Healing',
    count: 22,
    description: "God's power to heal and restore",
  },
  {
    id: 7,
    name: 'Grace',
    count: 20,
    description: "Understanding and receiving God's grace",
  },
  {
    id: 8,
    name: 'Spiritual Warfare',
    count: 18,
    description: 'Victory over the enemy and spiritual battles',
  },
];
