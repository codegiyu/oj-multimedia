import { Heart, CheckCircle, Clock, Bookmark } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const prayerPoints = [
  {
    id: 1,
    title: 'Prayer for Healing',
    category: 'Health',
    points: 5,
    readingTime: '3 min',
    verse: 'James 5:15',
    isBookmarked: true,
    pointsList: [
      'Prayer for physical healing',
      'Prayer for emotional restoration',
      'Prayer for spiritual wholeness',
      'Prayer for strength',
      'Prayer for peace',
    ],
  },
  {
    id: 2,
    title: 'Prayer for Financial Breakthrough',
    category: 'Finance',
    points: 7,
    readingTime: '4 min',
    verse: 'Philippians 4:19',
    isBookmarked: false,
    pointsList: [
      'Prayer for provision',
      'Prayer for wisdom in finances',
      'Prayer for open doors',
      'Prayer for favor',
      'Prayer for debt cancellation',
      'Prayer for increase',
      'Prayer for stewardship',
    ],
  },
  {
    id: 3,
    title: 'Prayer for Family Unity',
    category: 'Family',
    points: 6,
    readingTime: '5 min',
    verse: 'Psalm 133:1',
    isBookmarked: true,
    pointsList: [
      'Prayer for love',
      'Prayer for understanding',
      'Prayer for forgiveness',
      'Prayer for protection',
      'Prayer for harmony',
      'Prayer for blessing',
    ],
  },
  {
    id: 4,
    title: 'Prayer for Career Success',
    category: 'Career',
    points: 8,
    readingTime: '6 min',
    verse: 'Proverbs 16:3',
    isBookmarked: false,
    pointsList: [
      'Prayer for favor',
      'Prayer for promotion',
      'Prayer for wisdom',
      'Prayer for opportunities',
      'Prayer for excellence',
      'Prayer for integrity',
      'Prayer for influence',
      'Prayer for purpose',
    ],
  },
  {
    id: 5,
    title: 'Prayer for Spiritual Growth',
    category: 'Spiritual',
    points: 6,
    readingTime: '4 min',
    verse: '2 Peter 3:18',
    isBookmarked: true,
    pointsList: [
      'Prayer for deeper relationship',
      'Prayer for understanding',
      'Prayer for obedience',
      'Prayer for fruitfulness',
      'Prayer for transformation',
      'Prayer for anointing',
    ],
  },
  {
    id: 6,
    title: 'Prayer for Protection',
    category: 'Protection',
    points: 5,
    readingTime: '3 min',
    verse: 'Psalm 91:1',
    isBookmarked: false,
    pointsList: [
      'Prayer for divine protection',
      'Prayer for angels',
      'Prayer for safety',
      'Prayer for deliverance',
      'Prayer for covering',
    ],
  },
];

export const PrayerPoints = () => {
  return (
    <section className="py-16 bg-background">
      <div className="regular-container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
              <Heart className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-foreground">Prayer Points</h2>
              <p className="text-muted-foreground">Structured prayers for every need</p>
            </div>
          </div>
          <Button variant="outline">View All</Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {prayerPoints.map(prayer => (
            <Card
              key={prayer.id}
              className="group hover:shadow-md transition-all duration-300 border-border/50">
              <CardContent className="p-5">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="secondary" className="text-xs">
                        {prayer.category}
                      </Badge>
                      {prayer.isBookmarked && (
                        <Bookmark className="w-4 h-4 text-primary fill-primary" />
                      )}
                    </div>
                    <h3 className="font-semibold text-lg text-foreground mb-1 group-hover:text-primary transition-colors">
                      {prayer.title}
                    </h3>
                    <p className="text-sm text-primary font-medium">{prayer.verse}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-xs text-muted-foreground mb-4">
                  <span className="flex items-center gap-1">
                    <CheckCircle className="w-3 h-3" />
                    {prayer.points} points
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {prayer.readingTime}
                  </span>
                </div>

                <ul className="grid gap-2 mb-4">
                  {prayer.pointsList.slice(0, 3).map((point, index) => (
                    <li
                      key={index}
                      className="flex items-start gap-2 text-sm text-muted-foreground">
                      <CheckCircle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                      <span>{point}</span>
                    </li>
                  ))}
                  {prayer.points > 3 && (
                    <li className="text-xs text-muted-foreground italic">
                      +{prayer.points - 3} more points
                    </li>
                  )}
                </ul>

                <Button variant="outline" size="sm" className="w-full">
                  Read Full Prayer
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
