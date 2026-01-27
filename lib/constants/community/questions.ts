/**
 * Unified Question Item Type (Ask a Pastor)
 * This type represents all question content.
 * Items are marked with flags (isActive, isAnswered, isUrgent) to indicate
 * which sections they belong to.
 */
export interface QuestionItem {
  id: number;
  question: string;
  category: string;
  author: string;
  views: number;
  answers: number;
  timeAgo: string;
  urgent: boolean;
  // Section flags
  isActive?: boolean;
  isAnswered?: boolean;
  isFeatured?: boolean;
  // Detail page fields
  fullQuestion?: string;
  date?: string;
  tags?: string[];
  // Answered question fields
  answer?: string;
  pastor?: string;
  pastorId?: number;
  answeredDate?: string;
  helpful?: number;
}

/**
 * Central array of all question items
 */
export const QUESTIONS_ITEMS: QuestionItem[] = [
  // Active Questions
  {
    id: 1,
    question: 'How do I know if God is speaking to me?',
    category: 'Spiritual Growth',
    author: 'Sarah M.',
    views: 234,
    answers: 3,
    timeAgo: '2 hours ago',
    urgent: false,
    isActive: true,
    isFeatured: true,
    fullQuestion:
      "I've been trying to discern God's voice in my life, but I'm not sure if what I'm hearing is from God or just my own thoughts. How can I know for certain when God is speaking to me?",
    date: '2026-01-26',
    tags: ['hearing-god', 'discernment', 'spiritual-growth'],
  },
  {
    id: 2,
    question: 'What does the Bible say about handling conflict in relationships?',
    category: 'Relationships',
    author: 'Michael T.',
    views: 189,
    answers: 2,
    timeAgo: '5 hours ago',
    urgent: false,
    isActive: true,
    fullQuestion:
      "I'm having conflicts with some people in my life, and I want to handle it in a biblical way. What does the Bible teach about resolving conflicts and maintaining healthy relationships?",
    date: '2026-01-26',
    tags: ['relationships', 'conflict', 'biblical-principles'],
  },
  {
    id: 3,
    question: 'How can I overcome doubt in my faith?',
    category: 'Faith',
    author: 'David K.',
    views: 312,
    answers: 5,
    timeAgo: '1 day ago',
    urgent: false,
    isActive: true,
    fullQuestion:
      "I've been struggling with doubts about my faith lately. Sometimes I question if God is real or if Christianity is true. How can I overcome these doubts and strengthen my faith?",
    date: '2026-01-25',
    tags: ['doubt', 'faith', 'struggles'],
  },
  {
    id: 4,
    question: 'What is the biblical perspective on tithing?',
    category: 'Finance',
    author: 'Jennifer L.',
    views: 278,
    answers: 4,
    timeAgo: '2 days ago',
    urgent: false,
    isActive: true,
    fullQuestion:
      "I've heard different opinions about tithing. Some say it's required, others say it's not. What does the Bible actually say about tithing, and is it still relevant for Christians today?",
    date: '2026-01-24',
    tags: ['tithing', 'finance', 'giving'],
  },
  {
    id: 5,
    question: 'How do I know if I have the gift of prophecy?',
    category: 'Spiritual Gifts',
    author: 'Robert P.',
    views: 156,
    answers: 2,
    timeAgo: '3 days ago',
    urgent: false,
    isActive: true,
    fullQuestion:
      "I've been having what I think might be prophetic insights or words from God. How can I know if I have the gift of prophecy, and how should I use it if I do?",
    date: '2026-01-23',
    tags: ['spiritual-gifts', 'prophecy', 'discernment'],
  },
  {
    id: 6,
    question: 'What should I do when I feel distant from God?',
    category: 'Spiritual Growth',
    author: 'Maria G.',
    views: 421,
    answers: 6,
    timeAgo: '4 days ago',
    urgent: false,
    isActive: true,
    fullQuestion:
      "Lately, I've been feeling distant from God. My prayers feel empty, and I don't sense His presence like I used to. What should I do to reconnect with God?",
    date: '2026-01-22',
    tags: ['spiritual-growth', 'relationship', 'dry-seasons'],
  },
  // Answered Questions
  {
    id: 7,
    question: 'How do I forgive someone who has deeply hurt me?',
    category: 'Relationships',
    author: 'Anonymous',
    views: 567,
    answers: 1,
    timeAgo: '1 week ago',
    urgent: false,
    isAnswered: true,
    isFeatured: true,
    fullQuestion:
      'How do I forgive someone who has deeply hurt me? I know the Bible says to forgive, but this person has caused so much pain in my life. How can I truly forgive them?',
    answer:
      "Forgiveness is a process that begins with understanding God's forgiveness toward us. Jesus said in Matthew 6:14-15 that if we forgive others, our heavenly Father will forgive us. Start by praying for the person who hurt you, asking God to help you see them through His eyes. Remember that forgiveness doesn't mean forgetting or excusing the wrong, but rather releasing the debt and the right to revenge. It's a choice to let go of bitterness and trust God with justice.",
    pastor: 'Pastor David Chen',
    pastorId: 1,
    answeredDate: '1 week ago',
    helpful: 89,
    date: '2026-01-19',
    tags: ['forgiveness', 'relationships', 'healing'],
  },
  {
    id: 8,
    question: 'What does it mean to be "born again"?',
    category: 'Faith',
    author: 'John D.',
    views: 423,
    answers: 1,
    timeAgo: '2 weeks ago',
    urgent: false,
    isAnswered: true,
    fullQuestion:
      'I\'ve heard the term "born again" used a lot, but I\'m not entirely sure what it means. Can you explain what it means to be born again?',
    answer:
      'Being "born again" refers to the spiritual transformation that occurs when someone accepts Jesus Christ as their Lord and Savior. Jesus explained this to Nicodemus in John 3:3, saying "unless one is born again, he cannot see the kingdom of God." This new birth is not physical but spiritual - it\'s the work of the Holy Spirit in a person\'s heart, creating a new nature and relationship with God. It involves repentance, faith in Christ, and receiving the Holy Spirit.',
    pastor: 'Rev. Sarah Williams',
    pastorId: 2,
    answeredDate: '2 weeks ago',
    helpful: 156,
    date: '2026-01-12',
    tags: ['salvation', 'born-again', 'faith'],
  },
  {
    id: 9,
    question: 'How should Christians handle anxiety and worry?',
    category: 'Mental Health',
    author: 'Lisa M.',
    views: 678,
    answers: 1,
    timeAgo: '3 weeks ago',
    urgent: false,
    isAnswered: true,
    isFeatured: true,
    fullQuestion:
      'I struggle with anxiety and worry constantly. What does the Bible say about handling anxiety, and what practical steps can I take as a Christian?',
    answer:
      'The Bible addresses anxiety directly in Philippians 4:6-7: "Do not be anxious about anything, but in every situation, by prayer and petition, with thanksgiving, present your requests to God." Practical steps include: 1) Pray about everything, 2) Practice gratitude, 3) Focus on God\'s promises, 4) Seek community support, and 5) Remember that God cares for you (1 Peter 5:7). If anxiety persists, consider speaking with a Christian counselor alongside your spiritual practices.',
    pastor: 'Bishop James Moore',
    pastorId: 3,
    answeredDate: '3 weeks ago',
    helpful: 203,
    date: '2026-01-05',
    tags: ['anxiety', 'mental-health', 'peace'],
  },
];
