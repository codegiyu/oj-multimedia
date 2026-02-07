/**
 * Pastor Type for Ask a Pastor feature
 */
export interface Pastor {
  _id: string;
  name: string;
  title: string;
  church: string;
  image: string;
  expertise?: string[];
  topics?: string[];
  questionsAnswered?: number;
  rating?: number;
}

/**
 * Available Pastors for Ask a Pastor feature
 */
export const PASTORS: Pastor[] = [
  {
    _id: '1',
    name: 'Pastor David Chen',
    title: 'Senior Pastor',
    church: 'Grace Community Church',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop',
    expertise: ['Relationships', 'Forgiveness', 'Spiritual Growth'],
    topics: ['Relationships', 'Forgiveness', 'Spiritual Growth'],
    questionsAnswered: 45,
    rating: 4.8,
  },
  {
    _id: '2',
    name: 'Rev. Sarah Williams',
    title: 'Associate Pastor',
    church: 'Hope Fellowship',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop',
    expertise: ['Faith', 'Salvation', 'Bible Study'],
    topics: ['Faith', 'Salvation', 'Bible Study'],
    questionsAnswered: 38,
    rating: 4.9,
  },
  {
    _id: '3',
    name: 'Bishop James Moore',
    title: 'Bishop',
    church: 'New Life Cathedral',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop',
    expertise: ['Mental Health', 'Anxiety', 'Peace', 'Prayer'],
    topics: ['Mental Health', 'Anxiety', 'Peace', 'Prayer'],
    questionsAnswered: 52,
    rating: 4.7,
  },
  {
    _id: '4',
    name: 'Pastor Grace Okonkwo',
    title: 'Lead Pastor',
    church: 'Victory Ministries',
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop',
    expertise: ['Finance', 'Tithing', 'Giving', 'Stewardship'],
    topics: ['Finance', 'Tithing', 'Giving', 'Stewardship'],
    questionsAnswered: 41,
    rating: 4.6,
  },
];
