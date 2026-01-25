import type { Metadata } from 'next';
import { Suspense } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { AskAPastorHero } from '@/components/section/community/ask-a-pastor/AskAPastorHero';
import { AskAPastorPageClient } from '@/components/section/community/ask-a-pastor/AskAPastorPageClient';
import { AskAPastorPageSkeleton } from '@/components/section/community/ask-a-pastor/AskAPastorPageSkeleton';

export const metadata: Metadata = {
  title: 'Ask a Pastor - Get Biblical Guidance',
  description:
    'Submit your questions to our pastors, browse answered questions, and get biblical guidance on faith, life, and spiritual matters.',
};

// Generate ask a pastor data (in a real app, this would come from an API or database)
async function generateAskAPastorData() {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1500));

  const activeQuestions = [
    {
      id: 1,
      question: 'How do I know if God is speaking to me?',
      category: 'Spiritual Growth',
      author: 'Sarah M.',
      views: 234,
      answers: 3,
      timeAgo: '2 hours ago',
      urgent: false,
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
    },
  ];

  const answeredQuestions = [
    {
      id: 1,
      question: 'How do I forgive someone who has deeply hurt me?',
      answer:
        "Forgiveness is a process that begins with understanding God's forgiveness toward us. Jesus said in Matthew 6:14-15 that if we forgive others, our heavenly Father will forgive us. Start by praying for the person who hurt you, asking God to help you see them through His eyes. Remember that forgiveness doesn't mean forgetting or excusing the wrong, but rather releasing the debt and the right to revenge. It's a choice to let go of bitterness and trust God with justice.",
      pastor: 'Pastor David Chen',
      category: 'Relationships',
      answeredDate: '1 week ago',
      helpful: 89,
    },
    {
      id: 2,
      question: 'What does it mean to be "born again"?',
      answer:
        'Being "born again" refers to the spiritual transformation that occurs when someone accepts Jesus Christ as their Lord and Savior. Jesus explained this to Nicodemus in John 3:3, saying "unless one is born again, he cannot see the kingdom of God." This new birth is not physical but spiritual - it\'s the work of the Holy Spirit in a person\'s heart, creating a new nature and relationship with God. It involves repentance, faith in Christ, and receiving the Holy Spirit.',
      pastor: 'Rev. Sarah Williams',
      category: 'Faith',
      answeredDate: '2 weeks ago',
      helpful: 156,
    },
    {
      id: 3,
      question: 'How should Christians handle anxiety and worry?',
      answer:
        'The Bible addresses anxiety directly in Philippians 4:6-7: "Do not be anxious about anything, but in every situation, by prayer and petition, with thanksgiving, present your requests to God." Practical steps include: 1) Pray about everything, 2) Practice gratitude, 3) Focus on God\'s promises, 4) Seek community support, and 5) Remember that God cares for you (1 Peter 5:7). If anxiety persists, consider speaking with a Christian counselor alongside your spiritual practices.',
      pastor: 'Bishop James Moore',
      category: 'Mental Health',
      answeredDate: '3 weeks ago',
      helpful: 203,
    },
  ];

  const availablePastors = [
    {
      id: 1,
      name: 'Pastor David Chen',
      title: 'Senior Pastor',
      church: 'Grace Community Church',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop',
      expertise: ['Faith', 'Leadership', 'Bible Study'],
      questionsAnswered: 156,
      rating: 4.9,
    },
    {
      id: 2,
      name: 'Rev. Sarah Williams',
      title: 'Teaching Pastor',
      church: 'New Life Fellowship',
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=300&fit=crop',
      expertise: ['Relationships', "Women's Ministry", 'Counseling'],
      questionsAnswered: 89,
      rating: 4.8,
    },
    {
      id: 3,
      name: 'Bishop James Moore',
      title: 'Founding Bishop',
      church: 'Kingdom Life Cathedral',
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop',
      expertise: ['Theology', 'Spiritual Growth', 'Revival'],
      questionsAnswered: 234,
      rating: 5.0,
    },
    {
      id: 4,
      name: 'Pastor Grace Okonkwo',
      title: 'Associate Pastor',
      church: 'Harvest Church International',
      image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=300&h=300&fit=crop',
      expertise: ['Youth', 'Purpose', 'Prayer'],
      questionsAnswered: 67,
      rating: 4.7,
    },
  ];

  // Only fetch category counts from the server
  const categoryCounts: Record<string, number> = {
    Faith: 156,
    Relationships: 89,
    'Spiritual Growth': 203,
    Finance: 67,
    'Bible Study': 124,
    Prayer: 98,
  };

  return {
    activeQuestions,
    answeredQuestions,
    availablePastors,
    categoryCounts,
  };
}

export default async function CommunityAskAPastorPage() {
  const askAPastorData = await generateAskAPastorData();

  return (
    <MainLayout>
      <AskAPastorHero />
      <Suspense fallback={<AskAPastorPageSkeleton />}>
        <AskAPastorPageClient {...askAPastorData} />
      </Suspense>
    </MainLayout>
  );
}
