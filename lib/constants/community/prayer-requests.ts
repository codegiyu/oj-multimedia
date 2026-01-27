/**
 * Unified Prayer Request Item Type
 * This type represents all prayer request content.
 * Items are marked with flags (isActive, isAnswered) to indicate
 * which sections they belong to.
 */
export interface PrayerRequestItem {
  id: number;
  title: string;
  content: string;
  author: string;
  category: string;
  prayers: number;
  comments: number;
  timeAgo: string;
  urgent: boolean;
  // Section flags
  isActive?: boolean;
  isAnswered?: boolean;
  isFeatured?: boolean;
  // Detail page fields
  fullContent?: string;
  date?: string;
  tags?: string[];
  // Answered prayer fields
  testimony?: string;
  originalRequest?: string;
  answeredDate?: string;
}

/**
 * Central array of all prayer request items
 */
export const PRAYER_REQUESTS_ITEMS: PrayerRequestItem[] = [
  // Active Requests
  {
    id: 1,
    title: 'Prayer for Healing',
    content:
      'Please pray for my mother who is recovering from surgery. She needs strength and complete healing.',
    fullContent:
      "Please pray for my mother who is recovering from surgery. She needs strength and complete healing. The doctors say she's making progress, but we believe in the power of prayer for complete restoration. Thank you for standing with us in prayer.",
    author: 'Sarah M.',
    category: 'Healing',
    prayers: 124,
    comments: 18,
    timeAgo: '2 hours ago',
    urgent: true,
    isActive: true,
    isFeatured: true,
    date: '2026-01-26',
    tags: ['healing', 'surgery', 'family'],
  },
  {
    id: 2,
    title: 'Financial Breakthrough Needed',
    content:
      'Our family is facing financial difficulties. Please pray for God to open doors and provide for our needs.',
    fullContent:
      'Our family is facing financial difficulties. Please pray for God to open doors and provide for our needs. We trust that God is our provider and that He will make a way where there seems to be no way. We need wisdom in managing our resources and favor in finding opportunities.',
    author: 'Michael T.',
    category: 'Finance',
    prayers: 89,
    comments: 12,
    timeAgo: '5 hours ago',
    urgent: false,
    isActive: true,
    date: '2026-01-26',
    tags: ['finance', 'provision', 'family'],
  },
  {
    id: 3,
    title: 'Prayer for Job Opportunity',
    content:
      'I have been searching for employment for months. Please pray that God opens the right door for me.',
    fullContent:
      'I have been searching for employment for months. Please pray that God opens the right door for me. I believe God has a perfect job for me that aligns with my skills and purpose. I need favor with employers and clarity on which opportunities to pursue.',
    author: 'David K.',
    category: 'Career',
    prayers: 156,
    comments: 24,
    timeAgo: '1 day ago',
    urgent: false,
    isActive: true,
    date: '2026-01-25',
    tags: ['career', 'job', 'employment'],
  },
  {
    id: 4,
    title: 'Family Reconciliation',
    content:
      'Please pray for reconciliation in our family. There has been a lot of hurt and misunderstanding.',
    fullContent:
      "Please pray for reconciliation in our family. There has been a lot of hurt and misunderstanding. We need God's grace to heal wounds, restore relationships, and bring unity. Pray for softened hearts and willingness to forgive.",
    author: 'Jennifer L.',
    category: 'Family',
    prayers: 203,
    comments: 31,
    timeAgo: '2 days ago',
    urgent: false,
    isActive: true,
    isFeatured: true,
    date: '2026-01-24',
    tags: ['family', 'reconciliation', 'healing'],
  },
  {
    id: 5,
    title: 'Prayer for Spiritual Growth',
    content:
      'I desire to grow deeper in my relationship with God. Please pray for wisdom and understanding.',
    fullContent:
      'I desire to grow deeper in my relationship with God. Please pray for wisdom and understanding. I want to know God more, hear His voice clearly, and walk in obedience to His will. Pray for a hunger for His Word and a deeper prayer life.',
    author: 'Robert P.',
    category: 'Spiritual',
    prayers: 98,
    comments: 15,
    timeAgo: '3 days ago',
    urgent: false,
    isActive: true,
    date: '2026-01-23',
    tags: ['spiritual-growth', 'relationship', 'wisdom'],
  },
  {
    id: 6,
    title: 'Prayer for Protection',
    content:
      'Please pray for protection over my children as they travel. I trust God to keep them safe.',
    fullContent:
      "Please pray for protection over my children as they travel. I trust God to keep them safe. They are going on a trip and I'm asking for God's angels to surround them, protect them from harm, and bring them back safely.",
    author: 'Maria G.',
    category: 'Protection',
    prayers: 167,
    comments: 22,
    timeAgo: '4 days ago',
    urgent: false,
    isActive: true,
    date: '2026-01-22',
    tags: ['protection', 'children', 'travel'],
  },
  {
    id: 7,
    title: 'Prayer for Marriage Restoration',
    content:
      'My marriage is going through a difficult season. Please pray for restoration and healing.',
    fullContent:
      "My marriage is going through a difficult season. Please pray for restoration and healing. We need God's intervention to heal our hearts, restore our love, and strengthen our commitment to each other.",
    author: 'Anonymous',
    category: 'Marriage',
    prayers: 234,
    comments: 42,
    timeAgo: '5 days ago',
    urgent: true,
    isActive: true,
    date: '2026-01-21',
    tags: ['marriage', 'restoration', 'healing'],
  },
  {
    id: 8,
    title: 'Prayer for Direction',
    content: "I need clarity on a major life decision. Please pray for God's guidance and wisdom.",
    fullContent:
      "I need clarity on a major life decision. Please pray for God's guidance and wisdom. I'm at a crossroads and need to know which path God wants me to take. Pray for clear direction and peace in my decision.",
    author: 'Thomas R.',
    category: 'Guidance',
    prayers: 112,
    comments: 19,
    timeAgo: '6 days ago',
    urgent: false,
    isActive: true,
    date: '2026-01-20',
    tags: ['guidance', 'direction', 'wisdom'],
  },
  // Answered Prayers
  {
    id: 9,
    title: 'Praise Report: Job Found!',
    originalRequest: 'I was praying for a new job opportunity...',
    content: 'Praise Report: Job Found!',
    fullContent:
      'God answered! I received a job offer that exceeded my expectations. Thank you all for praying! The position is perfect for me and aligns with my skills and passion. God truly makes a way where there seems to be no way.',
    testimony:
      'God answered! I received a job offer that exceeded my expectations. Thank you all for praying! The position is perfect for me and aligns with my skills and passion. God truly makes a way where there seems to be no way.',
    author: 'James W.',
    category: 'Career',
    prayers: 245,
    comments: 35,
    timeAgo: '1 week ago',
    urgent: false,
    isAnswered: true,
    isFeatured: true,
    answeredDate: '1 week ago',
    date: '2026-01-19',
    tags: ['praise', 'job', 'answered-prayer'],
  },
  {
    id: 10,
    title: 'Healing Testimony',
    originalRequest: 'My daughter was very sick...',
    content: 'Healing Testimony',
    fullContent:
      "My daughter has fully recovered! The doctors were amazed. God is faithful. Thank you for your prayers! She was diagnosed with a serious condition, but through prayer and God's healing power, she is now completely well.",
    testimony:
      "My daughter has fully recovered! The doctors were amazed. God is faithful. Thank you for your prayers! She was diagnosed with a serious condition, but through prayer and God's healing power, she is now completely well.",
    author: 'Linda H.',
    category: 'Healing',
    prayers: 312,
    comments: 48,
    timeAgo: '2 weeks ago',
    urgent: false,
    isAnswered: true,
    isFeatured: true,
    answeredDate: '2 weeks ago',
    date: '2026-01-12',
    tags: ['healing', 'testimony', 'answered-prayer'],
  },
  {
    id: 11,
    title: 'Financial Breakthrough',
    originalRequest: 'We were struggling financially...',
    content: 'Financial Breakthrough',
    fullContent:
      'Unexpected provision came through! God made a way where there seemed to be no way. Praise God! We received an unexpected blessing that completely turned our situation around. God is truly our provider.',
    testimony:
      'Unexpected provision came through! God made a way where there seemed to be no way. Praise God! We received an unexpected blessing that completely turned our situation around. God is truly our provider.',
    author: 'Thomas R.',
    category: 'Finance',
    prayers: 189,
    comments: 28,
    timeAgo: '3 weeks ago',
    urgent: false,
    isAnswered: true,
    answeredDate: '3 weeks ago',
    date: '2026-01-05',
    tags: ['finance', 'provision', 'answered-prayer'],
  },
  {
    id: 12,
    title: 'Family Reconciliation - Answered!',
    originalRequest: 'Please pray for reconciliation in our family...',
    content: 'Family Reconciliation - Answered!',
    fullContent:
      'God has restored our family! After months of prayer, we had a breakthrough conversation and are now working toward healing. Thank you for your prayers!',
    testimony:
      'God has restored our family! After months of prayer, we had a breakthrough conversation and are now working toward healing. Thank you for your prayers!',
    author: 'Jennifer L.',
    category: 'Family',
    prayers: 267,
    comments: 52,
    timeAgo: '1 month ago',
    urgent: false,
    isAnswered: true,
    answeredDate: '1 month ago',
    date: '2025-12-26',
    tags: ['family', 'reconciliation', 'answered-prayer'],
  },
];
