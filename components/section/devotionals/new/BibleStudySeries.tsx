import { BookOpen, Users, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const bibleStudySeries = [
  {
    id: 1,
    title: 'The Book of Romans',
    description: "A deep dive into Paul's letter to the Romans",
    lessons: 16,
    duration: '8 weeks',
    participants: '2.4K',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=250&fit=crop',
    status: 'Ongoing',
  },
  {
    id: 2,
    title: 'The Gospel of John',
    description: 'Exploring the life and teachings of Jesus Christ',
    lessons: 21,
    duration: '10 weeks',
    participants: '3.1K',
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=250&fit=crop',
    status: 'Ongoing',
  },
  {
    id: 3,
    title: 'Proverbs: Wisdom for Life',
    description: 'Practical wisdom for daily living',
    lessons: 31,
    duration: '1 month',
    participants: '1.8K',
    image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=250&fit=crop',
    status: 'Completed',
  },
  {
    id: 4,
    title: 'The Psalms',
    description: 'Songs of praise, lament, and worship',
    lessons: 12,
    duration: '6 weeks',
    participants: '2.7K',
    image: 'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=400&h=250&fit=crop',
    status: 'Ongoing',
  },
  {
    id: 5,
    title: 'Ephesians: Identity in Christ',
    description: 'Understanding who we are in Christ',
    lessons: 6,
    duration: '3 weeks',
    participants: '1.5K',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=250&fit=crop',
    status: 'Upcoming',
  },
  {
    id: 6,
    title: 'The Book of James',
    description: 'Faith in action and practical Christianity',
    lessons: 5,
    duration: '5 weeks',
    participants: '1.2K',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=250&fit=crop',
    status: 'Completed',
  },
];

export const BibleStudySeries = () => {
  return (
    <section className="py-16 bg-muted/30">
      <div className="regular-container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-foreground">Bible Study Series</h2>
              <p className="text-muted-foreground">Deep dive into God's word</p>
            </div>
          </div>
          <Button variant="outline">View All Series</Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {bibleStudySeries.map(series => (
            <Card
              key={series.id}
              className="group hover:shadow-md transition-all duration-300 border-border/50 overflow-hidden">
              <div className="relative aspect-[1.75] overflow-hidden">
                <img
                  src={series.image}
                  alt={series.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-3 left-3 right-3">
                  <h3 className="font-semibold text-white text-lg mb-1">{series.title}</h3>
                  <Badge
                    variant={
                      series.status === 'Ongoing'
                        ? 'default'
                        : series.status === 'Upcoming'
                          ? 'secondary'
                          : 'outline'
                    }
                    className={
                      series.status === 'Ongoing'
                        ? 'bg-green-500'
                        : series.status === 'Upcoming'
                          ? 'bg-blue-500'
                          : 'bg-gray-500'
                    }>
                    {series.status}
                  </Badge>
                </div>
              </div>
              <CardContent className="p-5">
                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                  {series.description}
                </p>
                <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                  <span className="flex items-center gap-1">
                    <BookOpen className="w-4 h-4" />
                    {series.lessons} lessons
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {series.duration}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Users className="w-4 h-4" />
                    {series.participants} participants
                  </span>
                  <Button size="sm" variant="default">
                    Join Study
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
