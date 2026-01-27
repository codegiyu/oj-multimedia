/**
 * Unified Testimony Item Type
 * This type represents all testimony content.
 * Items are marked with flags (isFeatured, isTrending, isLatest) to indicate
 * which sections they belong to.
 */
export interface TestimonyItem {
  id: number;
  author: string;
  avatar: string;
  content: string;
  likes: number;
  comments: number;
  timeAgo: string;
  category?: string;
  // Section flags
  isFeatured?: boolean;
  isTrending?: boolean;
  isLatest?: boolean;
  // Detail page fields
  fullContent?: string;
  title?: string;
  date?: string;
  tags?: string[];
  relatedScriptures?: string[];
}

/**
 * Central array of all testimony items
 */
export const TESTIMONIES_ITEMS: TestimonyItem[] = [
  {
    id: 1,
    author: 'Michelle K.',
    avatar: '/images/artist-2.jpg',
    content:
      'This platform changed my life. I found a community that truly supports and uplifts each other. Sharing my story here helped me heal and find purpose. God used this community to restore my faith and bring me closer to Him.',
    likes: 342,
    comments: 56,
    timeAgo: '2 hours ago',
    category: 'Healing',
    isFeatured: true,
    isLatest: true,
    isTrending: true,
    fullContent:
      'This platform changed my life. I found a community that truly supports and uplifts each other. Sharing my story here helped me heal and find purpose. God used this community to restore my faith and bring me closer to Him. When I first came here, I was broken and lost. But through the prayers, encouragement, and testimonies of others, I found hope again. Today, I am a completely different person - healed, restored, and walking in purpose. God is faithful!',
    title: 'From Broken to Restored',
    date: '2026-01-26',
    tags: ['healing', 'restoration', 'community'],
    relatedScriptures: ['Jeremiah 30:17', 'Psalm 147:3'],
  },
  {
    id: 2,
    author: 'David O.',
    avatar: '/images/artist-1.jpg',
    content:
      'After years of feeling lost, I found purpose through the devotionals and community discussions. Forever grateful for this space where I can grow in my faith and connect with other believers.',
    likes: 518,
    comments: 89,
    timeAgo: '5 hours ago',
    category: 'Purpose',
    isFeatured: true,
    isLatest: true,
    fullContent:
      "After years of feeling lost, I found purpose through the devotionals and community discussions. Forever grateful for this space where I can grow in my faith and connect with other believers. The daily devotionals have become a lifeline for me, and the community here has become like family. I've learned so much and grown so much in my walk with God. Thank you to everyone who shares and encourages others here.",
    title: 'Finding Purpose Through Community',
    date: '2026-01-26',
    tags: ['purpose', 'community', 'growth'],
    relatedScriptures: ['Jeremiah 29:11', 'Ephesians 2:10'],
  },
  {
    id: 3,
    author: 'Grace A.',
    avatar: '/images/artist-3.jpg',
    content:
      'The prayer community here is incredible. When I posted my request, I received so much love and support. God answered my prayers in ways I never imagined possible. This platform is truly a blessing.',
    likes: 276,
    comments: 42,
    timeAgo: '1 day ago',
    category: 'Prayer',
    isFeatured: true,
    isLatest: true,
    fullContent:
      'The prayer community here is incredible. When I posted my request, I received so much love and support. God answered my prayers in ways I never imagined possible. This platform is truly a blessing. I was going through a difficult time, and the prayers and encouragement I received here gave me strength to keep going. God moved in my situation, and I want to encourage others that God hears and answers prayer!',
    title: 'Prayers Answered',
    date: '2026-01-25',
    tags: ['prayer', 'answered-prayer', 'community'],
    relatedScriptures: ['James 5:16', 'Matthew 7:7'],
  },
  {
    id: 4,
    author: 'James M.',
    avatar: '/images/artist-1.jpg',
    content:
      'I was going through a difficult season in my marriage, but through the resources and encouragement I found here, God restored our relationship. We are stronger than ever, and I give all glory to God.',
    likes: 412,
    comments: 67,
    timeAgo: '2 days ago',
    category: 'Marriage',
    isLatest: true,
    fullContent:
      "I was going through a difficult season in my marriage, but through the resources and encouragement I found here, God restored our relationship. We are stronger than ever, and I give all glory to God. The marriage resources and testimonies from other couples gave us hope and practical tools to work through our issues. Today, our marriage is better than it has ever been, and we're committed to keeping God at the center.",
    title: 'Marriage Restored',
    date: '2026-01-24',
    tags: ['marriage', 'restoration', 'relationships'],
    relatedScriptures: ['Mark 10:9', 'Ephesians 5:25'],
  },
  {
    id: 5,
    author: 'Sarah T.',
    avatar: '/images/artist-2.jpg',
    content:
      'God healed me from a chronic illness that doctors said was incurable. Through prayer and faith, I experienced a miracle. I share this to encourage others that nothing is impossible with God.',
    likes: 689,
    comments: 124,
    timeAgo: '3 days ago',
    category: 'Healing',
    isTrending: true,
    fullContent:
      "God healed me from a chronic illness that doctors said was incurable. Through prayer and faith, I experienced a miracle. I share this to encourage others that nothing is impossible with God. For years, I suffered from this condition, and doctors had given up hope. But I never stopped praying and believing. One day, during a prayer session, I felt God's presence in a powerful way, and I knew I was healed. The next doctor's visit confirmed it - I was completely healed!",
    title: 'Miracle Healing',
    date: '2026-01-23',
    tags: ['healing', 'miracle', 'faith'],
    relatedScriptures: ['Jeremiah 17:14', 'James 5:15'],
  },
  {
    id: 6,
    author: 'Michael P.',
    avatar: '/images/artist-3.jpg',
    content:
      'I lost my job and was in financial crisis, but God provided in miraculous ways. Through this community, I found peace and learned to trust God completely. He is truly Jehovah Jireh.',
    likes: 523,
    comments: 98,
    timeAgo: '4 days ago',
    category: 'Provision',
    isTrending: true,
    fullContent:
      'I lost my job and was in financial crisis, but God provided in miraculous ways. Through this community, I found peace and learned to trust God completely. He is truly Jehovah Jireh. When I lost my job, I was terrified. But the prayers and encouragement from this community gave me strength. I started trusting God more, and He opened doors I never expected. Today, I have a better job and have learned that God is truly our provider.',
    title: 'God My Provider',
    date: '2026-01-22',
    tags: ['provision', 'trust', 'financial'],
    relatedScriptures: ['Philippians 4:19', 'Matthew 6:26'],
  },
  {
    id: 7,
    author: 'Ruth K.',
    avatar: '/images/artist-2.jpg',
    content:
      'After struggling with anxiety and depression for years, God delivered me completely. The worship music and devotionals here played a huge role in my healing journey. I am free today!',
    likes: 445,
    comments: 76,
    timeAgo: '5 days ago',
    category: 'Deliverance',
    fullContent:
      "After struggling with anxiety and depression for years, God delivered me completely. The worship music and devotionals here played a huge role in my healing journey. I am free today! The daily devotionals and worship music became my daily medicine. As I immersed myself in God's Word and worship, the chains of anxiety and depression began to break. Today, I walk in complete freedom and joy.",
    title: 'Delivered from Anxiety',
    date: '2026-01-21',
    tags: ['deliverance', 'mental-health', 'freedom'],
    relatedScriptures: ['2 Timothy 1:7', 'Isaiah 61:1'],
  },
  {
    id: 8,
    author: 'Peter D.',
    avatar: '/images/artist-1.jpg',
    content:
      'I was far from God, living in sin, but His grace found me. Through the sermons and testimonies I heard here, I gave my life to Christ. Today I am a new creation, serving God with all my heart.',
    likes: 612,
    comments: 145,
    timeAgo: '1 week ago',
    category: 'Salvation',
    isFeatured: true,
    fullContent:
      "I was far from God, living in sin, but His grace found me. Through the sermons and testimonies I heard here, I gave my life to Christ. Today I am a new creation, serving God with all my heart. My life was a mess - I was lost, broken, and searching for meaning. But when I heard the gospel through a sermon here, something clicked. I gave my life to Christ, and everything changed. I'm now walking in purpose and serving God with all my heart.",
    title: 'Saved by Grace',
    date: '2026-01-19',
    tags: ['salvation', 'grace', 'new-creation'],
    relatedScriptures: ['2 Corinthians 5:17', 'Ephesians 2:8-9'],
  },
  {
    id: 9,
    author: 'Esther F.',
    avatar: '/images/artist-3.jpg',
    content:
      'God blessed us with a child after years of waiting. The prayers and encouragement from this community sustained us during the difficult times. Our miracle baby is now 6 months old!',
    likes: 567,
    comments: 112,
    timeAgo: '1 week ago',
    category: 'Blessing',
    fullContent:
      'God blessed us with a child after years of waiting. The prayers and encouragement from this community sustained us during the difficult times. Our miracle baby is now 6 months old! After years of trying and waiting, we had almost given up hope. But the prayers from this community and our faith in God kept us going. God answered our prayers, and we now have a beautiful baby boy. He is truly our miracle!',
    title: 'Our Miracle Baby',
    date: '2026-01-19',
    tags: ['blessing', 'miracle', 'family'],
    relatedScriptures: ['Psalm 127:3', 'Genesis 21:1-2'],
  },
  {
    id: 10,
    author: 'John B.',
    avatar: '/images/artist-1.jpg',
    content:
      'I was struggling with addiction for over 10 years. Through the prayers and support from this community, God set me free. Today I am 2 years clean and living for God!',
    likes: 489,
    comments: 89,
    timeAgo: '2 weeks ago',
    category: 'Deliverance',
    fullContent:
      "I was struggling with addiction for over 10 years. Through the prayers and support from this community, God set me free. Today I am 2 years clean and living for God! Addiction had a stronghold on my life, but God's power is greater. Through prayer, support, and God's Word, I found freedom. Today, I help others who are struggling with the same issues.",
    title: 'Free from Addiction',
    date: '2026-01-12',
    tags: ['deliverance', 'addiction', 'freedom'],
    relatedScriptures: ['John 8:36', '2 Corinthians 3:17'],
  },
];
