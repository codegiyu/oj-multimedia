import { Calendar, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

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
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=200&fit=crop',
  },
  {
    id: 2,
    title: 'The Power of Prayer',
    verse: 'Philippians 4:6-7',
    date: 'Yesterday',
    readingTime: '6 min',
    category: 'Prayer',
    excerpt: 'Do not be anxious about anything, but in every situation, by prayer and petition...',
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=200&fit=crop',
  },
  {
    id: 3,
    title: 'Gods Unfailing Love',
    verse: 'Romans 8:38-39',
    date: '2 days ago',
    readingTime: '4 min',
    category: 'Love',
    excerpt: 'For I am convinced that neither death nor life, neither angels nor demons...',
    image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=200&fit=crop',
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
    image: 'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=300&h=200&fit=crop',
  },
  {
    id: 5,
    title: 'Trusting Gods Timing',
    verse: 'Ecclesiastes 3:1',
    date: '4 days ago',
    readingTime: '5 min',
    category: 'Trust',
    excerpt: 'There is a time for everything, and a season for every activity under the heavens...',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=200&fit=crop',
  },
  {
    id: 6,
    title: 'The Joy of Serving',
    verse: 'Mark 10:45',
    date: '5 days ago',
    readingTime: '6 min',
    category: 'Service',
    excerpt: 'For even the Son of Man did not come to be served, but to serve...',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=200&fit=crop',
  },
];

export const DailyDevotionals = () => {
  return (
    <section className="py-16 bg-background">
      <div className="regular-container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
              <Calendar className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-foreground">Daily Devotionals</h2>
              <p className="text-muted-foreground">Start your day with God's word</p>
            </div>
          </div>
          <Button variant="outline">View All</Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {dailyDevotionals.map(devotional => (
            <Card
              key={devotional.id}
              className="group hover:shadow-md transition-all duration-300 border-border/50 overflow-hidden">
              <div className="relative aspect-[1.75] overflow-hidden">
                <img
                  src={devotional.image}
                  alt={devotional.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3">
                  <Badge variant="secondary" className="bg-primary/90 text-primary-foreground">
                    {devotional.category}
                  </Badge>
                </div>
                {devotional.date === 'Today' && (
                  <div className="absolute top-3 right-3">
                    <Badge className="bg-green-500 text-white">Today</Badge>
                  </div>
                )}
              </div>
              <CardContent className="p-5">
                <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                  <Calendar className="w-3 h-3" />
                  <span>{devotional.date}</span>
                  <span>•</span>
                  <Clock className="w-3 h-3" />
                  <span>{devotional.readingTime}</span>
                </div>
                <h3 className="font-semibold text-lg text-foreground mb-2 group-hover:text-primary transition-colors">
                  {devotional.title}
                </h3>
                <p className="text-sm text-primary font-medium mb-2">{devotional.verse}</p>
                <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                  {devotional.excerpt}
                </p>
                <Button variant="outline" size="sm" className="w-full">
                  Read More
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
