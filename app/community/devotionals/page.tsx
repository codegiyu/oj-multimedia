import type { Metadata } from 'next';
import { Suspense } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { DevotionalsHero } from '@/components/section/community/devotionals/DevotionalsHero';
import {
  BibleStudy,
  DevotionalsPageClient,
} from '@/components/section/community/devotionals/DevotionalsPageClient';
import { DevotionalsPageSkeleton } from '@/components/section/community/devotionals/DevotionalsPageSkeleton';

export const metadata: Metadata = {
  title: 'Devotionals - Daily Inspiration & Bible Study',
  description:
    'Explore daily devotionals, Bible study series, prayer points, Christian living tips, and marriage & family guidance. Grow in your faith with inspiring content.',
};

// Generate devotionals data (in a real app, this would come from an API or database)
async function generateDevotionalsData() {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1500));

  const dailyDevotionals = [
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
    },
    {
      id: 2,
      title: 'The Power of Prayer',
      verse: 'Philippians 4:6-7',
      date: 'Yesterday',
      readingTime: '6 min',
      category: 'Prayer',
      excerpt:
        'Do not be anxious about anything, but in every situation, by prayer and petition...',
      views: 1890,
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
    },
  ];

  const bibleStudySeries = [
    {
      id: 1,
      title: 'The Book of Romans',
      description: "A deep dive into Paul's letter to the Romans",
      lessons: 16,
      duration: '8 weeks',
      participants: '2.4K',
      status: 'Ongoing',
    },
    {
      id: 2,
      title: 'The Gospel of John',
      description: 'Exploring the life and teachings of Jesus Christ',
      lessons: 21,
      duration: '10 weeks',
      participants: '3.1K',
      status: 'Ongoing',
    },
    {
      id: 3,
      title: 'Proverbs: Wisdom for Life',
      description: 'Practical wisdom for daily living',
      lessons: 31,
      duration: '1 month',
      participants: '1.8K',
      status: 'Completed',
    },
    {
      id: 4,
      title: 'The Psalms',
      description: 'Songs of praise, lament, and worship',
      lessons: 12,
      duration: '6 weeks',
      participants: '2.7K',
      status: 'Ongoing',
    },
  ] satisfies BibleStudy[];

  const prayerPoints = [
    {
      id: 1,
      title: 'Prayer for Healing',
      category: 'Health',
      points: 5,
      readingTime: '3 min',
      verse: 'James 5:15',
      excerpt: 'Prayers for physical, emotional, and spiritual wholeness',
    },
    {
      id: 2,
      title: 'Prayer for Financial Breakthrough',
      category: 'Finance',
      points: 7,
      readingTime: '4 min',
      verse: 'Philippians 4:19',
      excerpt: 'Prayers for provision, wisdom, and open doors',
    },
    {
      id: 3,
      title: 'Prayer for Family Unity',
      category: 'Family',
      points: 6,
      readingTime: '5 min',
      verse: 'Psalm 133:1',
      excerpt: 'Prayers for love, understanding, and harmony in families',
    },
    {
      id: 4,
      title: 'Prayer for Spiritual Growth',
      category: 'Spiritual',
      points: 6,
      readingTime: '4 min',
      verse: '2 Peter 3:18',
      excerpt: 'Prayers for deeper relationship and transformation',
    },
  ];

  const livingTips = [
    {
      id: 1,
      title: 'Building a Consistent Prayer Life',
      category: 'Spiritual Growth',
      excerpt:
        'Learn practical steps to develop a meaningful and consistent prayer routine that transforms your relationship with God.',
      views: '12.5K',
      trending: true,
    },
    {
      id: 2,
      title: 'Managing Time as a Christian',
      category: 'Productivity',
      excerpt:
        'Discover biblical principles for time management that honor God while maximizing your productivity and purpose.',
      views: '9.8K',
      trending: false,
    },
    {
      id: 3,
      title: 'Overcoming Temptation',
      category: 'Spiritual Warfare',
      excerpt:
        'Biblical strategies to resist temptation and walk in victory through the power of the Holy Spirit.',
      views: '15.2K',
      trending: true,
    },
    {
      id: 4,
      title: 'Cultivating Gratitude',
      category: 'Attitude',
      excerpt:
        "Transform your perspective by developing a heart of gratitude that sees God's goodness in every situation.",
      views: '8.3K',
      trending: false,
    },
  ];

  const marriageFamily = [
    {
      id: 1,
      title: 'Building a God-Centered Marriage',
      category: 'Marriage',
      excerpt:
        'Discover biblical principles for a strong, loving marriage that honors God and brings joy to both partners.',
      articles: 12,
    },
    {
      id: 2,
      title: 'Raising Children in Faith',
      category: 'Parenting',
      excerpt:
        'Practical guidance for teaching your children about God and instilling Christian values in their daily lives.',
      articles: 18,
    },
    {
      id: 3,
      title: 'Communication in Marriage',
      category: 'Marriage',
      excerpt:
        'Learn to communicate effectively with your spouse, resolving conflicts with love, respect, and understanding.',
      articles: 8,
    },
    {
      id: 4,
      title: 'Family Devotions',
      category: 'Family',
      excerpt:
        'Create meaningful family worship times that bring your household closer to God and to each other.',
      articles: 15,
    },
  ];

  return {
    dailyDevotionals,
    bibleStudySeries,
    prayerPoints,
    livingTips,
    marriageFamily,
  };
}

export default async function CommunityDevotionalsPage() {
  const devotionalsData = await generateDevotionalsData();

  return (
    <MainLayout>
      <DevotionalsHero />
      <Suspense fallback={<DevotionalsPageSkeleton />}>
        <DevotionalsPageClient {...devotionalsData} />
      </Suspense>
    </MainLayout>
  );
}
