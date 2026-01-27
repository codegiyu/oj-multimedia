/**
 * Unified Devotional Item Type
 * This type represents all devotional content across different sections.
 * Items are marked with flags (isDaily, isBibleStudy, isPrayerPoint, isLivingTip, isMarriageFamily) to indicate
 * which sections they belong to.
 */
export interface DevotionalItem {
  id: number;
  title: string;
  verse?: string;
  date?: string;
  readingTime?: string;
  category: string;
  excerpt?: string;
  views?: number;
  // Section flags
  isDaily?: boolean;
  isBibleStudy?: boolean;
  isPrayerPoint?: boolean;
  isLivingTip?: boolean;
  isMarriageFamily?: boolean;
  isFeatured?: boolean;
  isTrending?: boolean;
  isLatest?: boolean;
  isPopular?: boolean;
  // Detail page fields
  fullContent?: {
    introduction?: string;
    sections?: Array<{
      heading?: string;
      paragraphs: string[];
    }>;
    conclusion?: string;
  };
  // Bible Study specific fields
  description?: string;
  lessons?: number;
  duration?: string;
  participants?: string;
  status?: 'Ongoing' | 'Completed' | 'Upcoming';
  // Prayer Point specific fields
  points?: number;
  prayerPoints?: string[];
  // Living Tip specific fields
  trending?: boolean;
  // Marriage/Family specific fields
  articles?: number;
  author?: string;
  tags?: string[];
}

/**
 * Central array of all devotional items
 * Items can appear in multiple sections by setting multiple flags
 */
export const DEVOTIONALS_ITEMS: DevotionalItem[] = [
  // Daily Devotionals
  {
    id: 1,
    title: 'Walking in Faith',
    verse: 'Hebrews 11:1',
    date: 'Today',
    readingTime: '5 min',
    category: 'Faith',
    excerpt:
      'Now faith is confidence in what we hope for and assurance about what we do not see...',
    views: 2340,
    isDaily: true,
    isLatest: true,
    isTrending: true,
    fullContent: {
      introduction:
        'Faith is the foundation of our Christian walk. It is the substance of things hoped for, the evidence of things not seen.',
      sections: [
        {
          heading: 'Understanding Faith',
          paragraphs: [
            "Faith is not blind belief, but confident trust in God who has proven Himself faithful throughout history. When we walk in faith, we acknowledge that God's ways are higher than our ways, and His thoughts higher than our thoughts.",
            'The Bible tells us that without faith, it is impossible to please God. Faith is what connects us to the divine and allows us to experience the supernatural in our daily lives.',
          ],
        },
        {
          heading: 'Practical Steps',
          paragraphs: [
            'To walk in faith means to trust God even when circumstances seem contrary. It means believing that God is working all things together for our good, even when we cannot see it.',
            'Start each day by declaring your faith in God. Read His Word, pray, and trust that He will guide your steps. Remember, faith without works is dead, so let your actions reflect your faith in God.',
          ],
        },
      ],
      conclusion:
        'As you walk in faith today, remember that God is with you. Trust in His promises and watch as He moves in your life.',
    },
    author: 'Pastor David Chen',
    tags: ['faith', 'trust', 'daily-devotional'],
  },
  {
    id: 2,
    title: 'The Power of Prayer',
    verse: 'Philippians 4:6-7',
    date: 'Yesterday',
    readingTime: '6 min',
    category: 'Prayer',
    excerpt: 'Do not be anxious about anything, but in every situation, by prayer and petition...',
    views: 1890,
    isDaily: true,
    isLatest: true,
    fullContent: {
      introduction:
        "Prayer is our direct line of communication with God. It is through prayer that we express our hearts, seek guidance, and experience God's presence.",
      sections: [
        {
          heading: 'The Importance of Prayer',
          paragraphs: [
            'Prayer is not just a religious ritual; it is a powerful tool that connects us to the heart of God. When we pray, we invite God into our situations and allow Him to work in ways we cannot imagine.',
            'Jesus Himself spent much time in prayer, showing us the importance of maintaining a consistent prayer life. He prayed before major decisions, during difficult times, and to maintain intimacy with the Father.',
          ],
        },
        {
          heading: 'How to Pray Effectively',
          paragraphs: [
            'Effective prayer is not about using the right words, but about having the right heart. Come to God with honesty, humility, and faith.',
            "Remember the model prayer Jesus taught: acknowledge God's holiness, submit to His will, ask for daily needs, seek forgiveness, and request protection from temptation.",
          ],
        },
      ],
      conclusion:
        'Make prayer a priority in your life. Set aside time each day to commune with God, and watch as your relationship with Him deepens.',
    },
    author: 'Rev. Sarah Williams',
    tags: ['prayer', 'communication', 'daily-devotional'],
  },
  {
    id: 3,
    title: "God's Unfailing Love",
    verse: 'Romans 8:38-39',
    date: '2 days ago',
    readingTime: '4 min',
    category: 'Love',
    excerpt: 'For I am convinced that neither death nor life, neither angels nor demons...',
    views: 3120,
    isDaily: true,
    isFeatured: true,
    fullContent: {
      introduction:
        "God's love for us is unconditional, unchanging, and unfailing. Nothing can separate us from His love.",
      sections: [
        {
          heading: "The Nature of God's Love",
          paragraphs: [
            "God's love is not based on our performance or worthiness. It is a gift freely given, regardless of our past mistakes or current struggles.",
            "The Bible tells us that while we were still sinners, Christ died for us. This demonstrates the depth of God's love - it is proactive, sacrificial, and eternal.",
          ],
        },
        {
          heading: "Experiencing God's Love",
          paragraphs: [
            "To experience God's love, we must first receive it. Accept that you are loved unconditionally, not because of what you do, but because of who God is.",
            "Allow God's love to transform you. When you truly understand how much God loves you, it changes how you see yourself and how you relate to others.",
          ],
        },
      ],
      conclusion:
        "Rest in the assurance that nothing can separate you from God's love. It is your anchor in every storm.",
    },
    author: 'Bishop James Moore',
    tags: ['love', 'god', 'daily-devotional'],
  },
  {
    id: 4,
    title: 'Finding Peace in Chaos',
    verse: 'John 14:27',
    date: '3 days ago',
    readingTime: '7 min',
    category: 'Peace',
    excerpt:
      'Peace I leave with you; my peace I give you. I do not give to you as the world gives...',
    views: 2780,
    isDaily: true,
    isTrending: true,
    fullContent: {
      introduction:
        'In a world filled with chaos and uncertainty, God offers us a peace that surpasses all understanding.',
      sections: [
        {
          heading: 'The Source of True Peace',
          paragraphs: [
            'The world offers temporary peace through circumstances, but God offers eternal peace through relationship with Him. This peace is not dependent on external situations but on internal confidence in God.',
            'Jesus promised to give us His peace - a peace that the world cannot give and cannot take away. This peace comes from knowing that God is in control.',
          ],
        },
        {
          heading: 'Cultivating Peace',
          paragraphs: [
            "To experience God's peace, we must surrender our worries and anxieties to Him. Cast all your cares upon Him, for He cares for you.",
            "Spend time in God's presence through prayer and worship. As you focus on Him, your perspective shifts, and peace fills your heart.",
          ],
        },
      ],
      conclusion:
        "No matter what chaos surrounds you, remember that God's peace is available. Receive it today.",
    },
    author: 'Pastor Grace Okonkwo',
    tags: ['peace', 'trust', 'daily-devotional'],
  },
  // Bible Study Series
  {
    id: 5,
    title: 'The Book of Romans',
    description: "A deep dive into Paul's letter to the Romans",
    lessons: 16,
    duration: '8 weeks',
    participants: '2.4K',
    status: 'Ongoing',
    category: 'Bible Study',
    isBibleStudy: true,
    isFeatured: true,
    fullContent: {
      introduction:
        'The Book of Romans is one of the most profound theological works in the New Testament. Written by the Apostle Paul, it systematically explains the gospel and its implications for believers.',
      sections: [
        {
          heading: 'Overview',
          paragraphs: [
            'This study will take you through all 16 chapters of Romans, exploring themes of sin, grace, justification, sanctification, and the Christian life.',
            'Each lesson includes discussion questions, practical applications, and opportunities for personal reflection.',
          ],
        },
      ],
    },
    author: 'Dr. Michael Thompson',
    tags: ['bible-study', 'romans', 'theology'],
  },
  {
    id: 6,
    title: 'The Gospel of John',
    description: 'Exploring the life and teachings of Jesus Christ',
    lessons: 21,
    duration: '10 weeks',
    participants: '3.1K',
    status: 'Ongoing',
    category: 'Bible Study',
    isBibleStudy: true,
    fullContent: {
      introduction:
        'The Gospel of John presents a unique perspective on the life and ministry of Jesus Christ, emphasizing His divinity and the importance of belief.',
    },
    author: 'Pastor David Chen',
    tags: ['bible-study', 'john', 'jesus'],
  },
  {
    id: 7,
    title: 'Proverbs: Wisdom for Life',
    description: 'Practical wisdom for daily living',
    lessons: 31,
    duration: '1 month',
    participants: '1.8K',
    status: 'Completed',
    category: 'Bible Study',
    isBibleStudy: true,
    fullContent: {
      introduction:
        'The Book of Proverbs contains timeless wisdom for every aspect of life - relationships, finances, work, and character development.',
    },
    author: 'Rev. Sarah Williams',
    tags: ['bible-study', 'proverbs', 'wisdom'],
  },
  {
    id: 8,
    title: 'The Psalms',
    description: 'Songs of praise, lament, and worship',
    lessons: 12,
    duration: '6 weeks',
    participants: '2.7K',
    status: 'Ongoing',
    category: 'Bible Study',
    isBibleStudy: true,
    fullContent: {
      introduction:
        'The Psalms are a collection of songs and prayers that express the full range of human emotions in relationship with God.',
    },
    author: 'Bishop James Moore',
    tags: ['bible-study', 'psalms', 'worship'],
  },
  // Prayer Points
  {
    id: 9,
    title: 'Prayer for Healing',
    category: 'Health',
    points: 5,
    readingTime: '3 min',
    verse: 'James 5:15',
    excerpt: 'Prayers for physical, emotional, and spiritual wholeness',
    isPrayerPoint: true,
    prayerPoints: [
      'Pray for complete healing in body, mind, and spirit',
      'Ask God to restore strength and vitality',
      'Pray for wisdom for medical professionals',
      'Request peace and comfort during recovery',
      'Thank God for His healing power',
    ],
    fullContent: {
      introduction:
        'Healing is a gift from God, and we can approach Him with confidence, knowing that He cares for our well-being.',
    },
    author: 'Pastor Grace Okonkwo',
    tags: ['prayer', 'healing', 'health'],
  },
  {
    id: 10,
    title: 'Prayer for Financial Breakthrough',
    category: 'Finance',
    points: 7,
    readingTime: '4 min',
    verse: 'Philippians 4:19',
    excerpt: 'Prayers for provision, wisdom, and open doors',
    isPrayerPoint: true,
    prayerPoints: [
      "Pray for God's provision in your finances",
      'Ask for wisdom in financial decisions',
      'Pray for open doors of opportunity',
      'Request freedom from debt',
      'Thank God for His faithfulness',
      'Pray for generosity and stewardship',
      "Ask for God's blessing on your work",
    ],
    fullContent: {
      introduction:
        'God is our provider, and He promises to supply all our needs according to His riches in glory.',
    },
    author: 'Pastor David Chen',
    tags: ['prayer', 'finance', 'provision'],
  },
  {
    id: 11,
    title: 'Prayer for Family Unity',
    category: 'Family',
    points: 6,
    readingTime: '5 min',
    verse: 'Psalm 133:1',
    excerpt: 'Prayers for love, understanding, and harmony in families',
    isPrayerPoint: true,
    prayerPoints: [
      'Pray for unity and love in your family',
      'Ask for wisdom in parenting',
      'Pray for healing of relationships',
      'Request patience and understanding',
      'Thank God for your family',
      "Pray for God's protection over your household",
    ],
    fullContent: {
      introduction:
        'Family unity is a blessing from God, and we can pray for His grace to strengthen our family bonds.',
    },
    author: 'Rev. Sarah Williams',
    tags: ['prayer', 'family', 'unity'],
  },
  {
    id: 12,
    title: 'Prayer for Spiritual Growth',
    category: 'Spiritual',
    points: 6,
    readingTime: '4 min',
    verse: '2 Peter 3:18',
    excerpt: 'Prayers for deeper relationship and transformation',
    isPrayerPoint: true,
    prayerPoints: [
      'Pray for deeper intimacy with God',
      "Ask for hunger for God's Word",
      'Pray for sensitivity to the Holy Spirit',
      'Request transformation and renewal',
      'Thank God for His work in your life',
      'Pray for opportunities to serve',
    ],
    fullContent: {
      introduction:
        'Spiritual growth is a journey, and we can pray for God to continue transforming us into His image.',
    },
    author: 'Bishop James Moore',
    tags: ['prayer', 'spiritual-growth', 'transformation'],
  },
  // Christian Living Tips
  {
    id: 13,
    title: 'Building a Consistent Prayer Life',
    category: 'Spiritual Growth',
    excerpt:
      'Learn practical steps to develop a meaningful and consistent prayer routine that transforms your relationship with God.',
    views: 12500,
    trending: true,
    isLivingTip: true,
    isTrending: true,
    readingTime: '8 min',
    fullContent: {
      introduction:
        'A consistent prayer life is the foundation of a vibrant relationship with God. Here are practical steps to build and maintain this essential discipline.',
      sections: [
        {
          heading: 'Set a Regular Time',
          paragraphs: [
            "Choose a specific time each day for prayer. Whether it's early morning, during lunch, or before bed, consistency is key.",
            'Start with just 10-15 minutes and gradually increase as you develop the habit.',
          ],
        },
        {
          heading: 'Create a Prayer Space',
          paragraphs: [
            'Designate a quiet place where you can pray without distractions. This helps your mind associate that space with prayer.',
            'Keep your Bible, a journal, and any prayer resources nearby.',
          ],
        },
      ],
    },
    author: 'Pastor Grace Okonkwo',
    tags: ['prayer', 'spiritual-discipline', 'christian-living'],
  },
  {
    id: 14,
    title: 'Managing Time as a Christian',
    category: 'Productivity',
    excerpt:
      'Discover biblical principles for time management that honor God while maximizing your productivity and purpose.',
    views: 9800,
    trending: false,
    isLivingTip: true,
    readingTime: '6 min',
    fullContent: {
      introduction:
        'Time is a gift from God, and managing it well is an act of stewardship that honors Him.',
    },
    author: 'Pastor David Chen',
    tags: ['time-management', 'productivity', 'stewardship'],
  },
  {
    id: 15,
    title: 'Overcoming Temptation',
    category: 'Spiritual Warfare',
    excerpt:
      'Biblical strategies to resist temptation and walk in victory through the power of the Holy Spirit.',
    views: 15200,
    trending: true,
    isLivingTip: true,
    isTrending: true,
    readingTime: '7 min',
    fullContent: {
      introduction:
        'Temptation is a reality for every believer, but we have been given power through the Holy Spirit to overcome it.',
    },
    author: 'Bishop James Moore',
    tags: ['temptation', 'spiritual-warfare', 'victory'],
  },
  {
    id: 16,
    title: 'Cultivating Gratitude',
    category: 'Attitude',
    excerpt:
      "Transform your perspective by developing a heart of gratitude that sees God's goodness in every situation.",
    views: 8300,
    trending: false,
    isLivingTip: true,
    readingTime: '5 min',
    fullContent: {
      introduction:
        "Gratitude is a powerful attitude that transforms our perspective and opens our hearts to God's blessings.",
    },
    author: 'Rev. Sarah Williams',
    tags: ['gratitude', 'attitude', 'transformation'],
  },
  // Marriage and Family
  {
    id: 17,
    title: 'Building a God-Centered Marriage',
    category: 'Marriage',
    excerpt:
      'Discover biblical principles for a strong, loving marriage that honors God and brings joy to both partners.',
    articles: 12,
    isMarriageFamily: true,
    isFeatured: true,
    readingTime: '10 min',
    fullContent: {
      introduction:
        'A God-centered marriage is built on biblical principles that create a foundation of love, respect, and mutual support.',
    },
    author: 'Pastor David Chen',
    tags: ['marriage', 'relationships', 'god-centered'],
  },
  {
    id: 18,
    title: 'Raising Children in Faith',
    category: 'Parenting',
    excerpt:
      'Practical guidance for teaching your children about God and instilling Christian values in their daily lives.',
    articles: 18,
    isMarriageFamily: true,
    readingTime: '9 min',
    fullContent: {
      introduction:
        'Raising children in faith is one of the most important responsibilities of Christian parents.',
    },
    author: 'Rev. Sarah Williams',
    tags: ['parenting', 'children', 'faith'],
  },
  {
    id: 19,
    title: 'Communication in Marriage',
    category: 'Marriage',
    excerpt:
      'Learn to communicate effectively with your spouse, resolving conflicts with love, respect, and understanding.',
    articles: 8,
    isMarriageFamily: true,
    readingTime: '7 min',
    fullContent: {
      introduction: 'Effective communication is the key to a healthy, thriving marriage.',
    },
    author: 'Pastor Grace Okonkwo',
    tags: ['marriage', 'communication', 'relationships'],
  },
  {
    id: 20,
    title: 'Family Devotions',
    category: 'Family',
    excerpt:
      'Create meaningful family worship times that bring your household closer to God and to each other.',
    articles: 15,
    isMarriageFamily: true,
    readingTime: '6 min',
    fullContent: {
      introduction:
        'Family devotions create opportunities for spiritual growth and bonding within the family unit.',
    },
    author: 'Bishop James Moore',
    tags: ['family', 'devotions', 'worship'],
  },
];
