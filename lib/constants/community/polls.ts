/**
 * Unified Poll Item Type
 * This type represents all poll content.
 * Items are marked with flags (isActive, isClosed) to indicate
 * which sections they belong to.
 */
export interface PollItem {
  _id: string;
  question: string;
  description?: string;
  category?: string;
  options: PollOption[];
  totalVotes: number;
  status: 'pending' | 'active' | 'closed' | 'rejected';
  creatorLabel?: string;
  timeAgo: string;
  endDate?: string;
  // Section flags
  isActive?: boolean;
  isClosed?: boolean;
  isFeatured?: boolean;
  // Detail page fields
  tags?: string[];
  date?: string;
  createdBy?: string;
}

export interface PollOption {
  _id: string;
  text: string;
  votes: number;
  percentage: number;
}

/**
 * Central array of all poll items
 */
export const POLLS_ITEMS: PollItem[] = [
  {
    _id: '1',
    question: 'What is your favorite worship style?',
    description: 'Help us understand the worship preferences of our community',
    category: 'Worship',
    options: [
      { _id: '1', text: 'Contemporary', votes: 245, percentage: 45 },
      { _id: '2', text: 'Traditional Hymns', votes: 156, percentage: 29 },
      { _id: '3', text: 'Gospel', votes: 98, percentage: 18 },
      { _id: '4', text: 'Blended', votes: 42, percentage: 8 },
    ],
    totalVotes: 541,
    status: 'active',
    timeAgo: '2 hours ago',
    endDate: '2026-12-31',
    isActive: true,
    isFeatured: true,
    date: '2026-01-26',
    tags: ['worship', 'music', 'preferences'],
    createdBy: 'Community Team',
  },
  {
    _id: '2',
    question: 'How often do you read your Bible?',
    description: 'Understanding Bible reading habits in our community',
    category: 'Spiritual Growth',
    options: [
      { _id: '1', text: 'Daily', votes: 312, percentage: 52 },
      { _id: '2', text: 'Several times a week', votes: 189, percentage: 31 },
      { _id: '3', text: 'Once a week', votes: 67, percentage: 11 },
      { _id: '4', text: 'Rarely', votes: 28, percentage: 5 },
    ],
    totalVotes: 596,
    status: 'active',
    timeAgo: '5 hours ago',
    endDate: '2026-12-25',
    isActive: true,
    date: '2026-01-26',
    tags: ['bible', 'reading', 'spiritual-growth'],
    createdBy: 'Community Team',
  },
  {
    _id: '3',
    question: 'What topic would you like more content on?',
    description: 'Help us create content that matters to you',
    category: 'Content',
    options: [
      { _id: '1', text: 'Marriage & Relationships', votes: 178, percentage: 38 },
      { _id: '2', text: 'Financial Stewardship', votes: 145, percentage: 31 },
      { _id: '3', text: 'Prayer & Intercession', votes: 98, percentage: 21 },
      { _id: '4', text: 'Leadership', votes: 45, percentage: 10 },
    ],
    totalVotes: 466,
    status: 'active',
    timeAgo: '1 day ago',
    endDate: '2026-12-30',
    isActive: true,
    date: '2026-01-25',
    tags: ['content', 'topics', 'feedback'],
    createdBy: 'Community Team',
  },
  {
    _id: '4',
    question: 'Which devotional format do you prefer?',
    description: 'Your feedback helps us improve our content',
    category: 'Devotionals',
    options: [
      { _id: '1', text: 'Daily Devotionals', votes: 234, percentage: 48 },
      { _id: '2', text: 'Weekly Studies', votes: 156, percentage: 32 },
      { _id: '3', text: 'Bible Reading Plans', votes: 67, percentage: 14 },
      { _id: '4', text: 'Video Devotionals', votes: 28, percentage: 6 },
    ],
    totalVotes: 485,
    status: 'active',
    timeAgo: '2 days ago',
    endDate: '2026-12-28',
    isActive: true,
    date: '2026-01-24',
    tags: ['devotionals', 'format', 'preferences'],
    createdBy: 'Community Team',
  },
  {
    _id: '5',
    question: 'How do you prefer to engage with sermons?',
    description: 'Understanding how our community consumes sermon content',
    category: 'Sermons',
    options: [
      { _id: '1', text: 'Live Streaming', votes: 198, percentage: 41 },
      { _id: '2', text: 'Audio Podcasts', votes: 145, percentage: 30 },
      { _id: '3', text: 'Video Recordings', votes: 98, percentage: 20 },
      { _id: '4', text: 'Written Transcripts', votes: 42, percentage: 9 },
    ],
    totalVotes: 483,
    status: 'active',
    timeAgo: '3 days ago',
    endDate: '2026-12-27',
    isActive: true,
    date: '2026-01-23',
    tags: ['sermons', 'engagement', 'preferences'],
    createdBy: 'Community Team',
  },
  {
    _id: '6',
    question: 'What motivates you to serve in ministry?',
    description: 'Share what drives your heart for service',
    category: 'Ministry',
    options: [
      { _id: '1', text: 'Love for God', votes: 267, percentage: 55 },
      { _id: '2', text: 'Desire to help others', votes: 145, percentage: 30 },
      { _id: '3', text: 'Personal calling', votes: 56, percentage: 12 },
      { _id: '4', text: 'Community impact', votes: 17, percentage: 3 },
    ],
    totalVotes: 485,
    status: 'closed',
    timeAgo: '1 week ago',
    endDate: '2026-01-20',
    isClosed: true,
    date: '2026-01-19',
    tags: ['ministry', 'service', 'motivation'],
    createdBy: 'Community Team',
  },
  {
    _id: '7',
    question: 'What is your preferred prayer time?',
    description: 'Understanding prayer habits in our community',
    category: 'Prayer',
    options: [
      { _id: '1', text: 'Early Morning', votes: 189, percentage: 39 },
      { _id: '2', text: 'Midday', votes: 98, percentage: 20 },
      { _id: '3', text: 'Evening', votes: 145, percentage: 30 },
      { _id: '4', text: 'Throughout the day', votes: 52, percentage: 11 },
    ],
    totalVotes: 484,
    status: 'closed',
    timeAgo: '2 weeks ago',
    endDate: '2026-01-13',
    isClosed: true,
    date: '2026-01-12',
    tags: ['prayer', 'habits', 'time'],
    createdBy: 'Community Team',
  },
  {
    _id: '8',
    question: 'Which social media platform do you use most for faith content?',
    description: 'Help us reach you where you are',
    category: 'Social Media',
    options: [
      { _id: '1', text: 'Facebook', votes: 156, percentage: 32 },
      { _id: '2', text: 'Instagram', votes: 198, percentage: 41 },
      { _id: '3', text: 'YouTube', votes: 98, percentage: 20 },
      { _id: '4', text: 'Twitter/X', votes: 32, percentage: 7 },
    ],
    totalVotes: 484,
    status: 'closed',
    timeAgo: '3 weeks ago',
    endDate: '2026-01-06',
    isClosed: true,
    date: '2026-01-05',
    tags: ['social-media', 'platform', 'content'],
    createdBy: 'Community Team',
  },
];
