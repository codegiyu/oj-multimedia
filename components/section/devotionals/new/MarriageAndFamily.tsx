import { Heart, Users, Baby, Home, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const marriageFamilyContent = [
  {
    id: 1,
    title: 'Building a God-Centered Marriage',
    category: 'Marriage',
    excerpt:
      'Discover biblical principles for a strong, loving marriage that honors God and brings joy to both partners.',
    image: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=400&h=250&fit=crop',
    articles: 12,
    icon: Heart,
  },
  {
    id: 2,
    title: 'Raising Children in Faith',
    category: 'Parenting',
    excerpt:
      'Practical guidance for teaching your children about God and instilling Christian values in their daily lives.',
    image: 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=400&h=250&fit=crop',
    articles: 18,
    icon: Baby,
  },
  {
    id: 3,
    title: 'Communication in Marriage',
    category: 'Marriage',
    excerpt:
      'Learn to communicate effectively with your spouse, resolving conflicts with love, respect, and understanding.',
    image: 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=400&h=250&fit=crop',
    articles: 8,
    icon: Heart,
  },
  {
    id: 4,
    title: 'Family Devotions',
    category: 'Family',
    excerpt:
      'Create meaningful family worship times that bring your household closer to God and to each other.',
    image: 'https://images.unsplash.com/photo-1511895426328-dc8714191300?w=400&h=250&fit=crop',
    articles: 15,
    icon: Home,
  },
  {
    id: 5,
    title: 'Financial Stewardship for Families',
    category: 'Family',
    excerpt:
      'Biblical principles for managing family finances, budgeting, and teaching children about money from a Christian perspective.',
    image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&h=250&fit=crop',
    articles: 10,
    icon: Users,
  },
  {
    id: 6,
    title: 'Navigating Extended Family',
    category: 'Family',
    excerpt:
      'Wisdom for maintaining healthy relationships with in-laws, grandparents, and extended family members.',
    image: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=400&h=250&fit=crop',
    articles: 7,
    icon: Users,
  },
];

export const MarriageAndFamily = () => {
  return (
    <section className="py-16 bg-background">
      <div className="regular-container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-foreground">Marriage & Family</h2>
              <p className="text-muted-foreground">Guidance for strong Christian families</p>
            </div>
          </div>
          <Button variant="outline">View All</Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {marriageFamilyContent.map(item => {
            const Icon = item.icon;
            return (
              <Card
                key={item.id}
                className="group hover:shadow-md transition-all duration-300 border-border/50 overflow-hidden">
                <div className="relative aspect-[1.75] overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute top-3 left-3">
                    <div className="w-10 h-10 rounded-full bg-primary/90 flex items-center justify-center">
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                  </div>
                  <div className="absolute bottom-3 left-3 right-3">
                    <Badge variant="secondary" className="mb-2">
                      {item.category}
                    </Badge>
                    <h3 className="font-semibold text-white text-lg">{item.title}</h3>
                  </div>
                </div>
                <CardContent className="p-5">
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-3">{item.excerpt}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">
                      {item.articles} articles available
                    </span>
                    <Button variant="ghost" size="sm" className="group/btn">
                      Explore
                      <ArrowRight className="w-4 h-4 ml-1 group-hover/btn:translate-x-1 transition-transform" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};
