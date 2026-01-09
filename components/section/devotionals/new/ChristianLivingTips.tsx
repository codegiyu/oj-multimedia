import { Lightbulb, TrendingUp, Users, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const livingTips = [
  {
    id: 1,
    title: 'Building a Consistent Prayer Life',
    category: 'Spiritual Growth',
    excerpt:
      'Learn practical steps to develop a meaningful and consistent prayer routine that transforms your relationship with God.',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=250&fit=crop',
    views: '12.5K',
    trending: true,
  },
  {
    id: 2,
    title: 'Managing Time as a Christian',
    category: 'Productivity',
    excerpt:
      'Discover biblical principles for time management that honor God while maximizing your productivity and purpose.',
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=250&fit=crop',
    views: '9.8K',
    trending: false,
  },
  {
    id: 3,
    title: 'Overcoming Temptation',
    category: 'Spiritual Warfare',
    excerpt:
      'Biblical strategies to resist temptation and walk in victory through the power of the Holy Spirit.',
    image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=250&fit=crop',
    views: '15.2K',
    trending: true,
  },
  {
    id: 4,
    title: 'Cultivating Gratitude',
    category: 'Attitude',
    excerpt:
      "Transform your perspective by developing a heart of gratitude that sees God's goodness in every situation.",
    image: 'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=400&h=250&fit=crop',
    views: '8.3K',
    trending: false,
  },
  {
    id: 5,
    title: 'Sharing Your Faith Naturally',
    category: 'Evangelism',
    excerpt:
      'Practical ways to share your faith with others in a natural, loving, and effective manner.',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=250&fit=crop',
    views: '11.7K',
    trending: false,
  },
  {
    id: 6,
    title: 'Finding Balance in Life',
    category: 'Wellness',
    excerpt:
      'Learn to balance work, family, ministry, and personal time while maintaining your spiritual health.',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=250&fit=crop',
    views: '10.4K',
    trending: true,
  },
];

export const ChristianLivingTips = () => {
  return (
    <section className="py-16 bg-muted/30">
      <div className="regular-container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
              <Lightbulb className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-foreground">Christian Living Tips</h2>
              <p className="text-muted-foreground">Practical wisdom for daily life</p>
            </div>
          </div>
          <Button variant="outline">View All Tips</Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {livingTips.map(tip => (
            <Card
              key={tip.id}
              className="group hover:shadow-md transition-all duration-300 border-border/50 overflow-hidden">
              <div className="relative aspect-[1.75] overflow-hidden">
                <img
                  src={tip.image}
                  alt={tip.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3">
                  <Badge variant="secondary" className="bg-primary/90 text-primary-foreground">
                    {tip.category}
                  </Badge>
                </div>
                {tip.trending && (
                  <div className="absolute top-3 right-3">
                    <Badge className="bg-orange-500 text-white flex items-center gap-1">
                      <TrendingUp className="w-3 h-3" />
                      Trending
                    </Badge>
                  </div>
                )}
              </div>
              <CardContent className="p-5">
                <h3 className="font-semibold text-lg text-foreground mb-2 group-hover:text-primary transition-colors">
                  {tip.title}
                </h3>
                <p className="text-sm text-muted-foreground mb-4 line-clamp-3">{tip.excerpt}</p>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Users className="w-3 h-3" />
                    {tip.views} views
                  </span>
                  <Button variant="ghost" size="sm" className="group/btn">
                    Read More
                    <ArrowRight className="w-4 h-4 ml-1 group-hover/btn:translate-x-1 transition-transform" />
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
