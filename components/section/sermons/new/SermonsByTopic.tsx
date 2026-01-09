import { Heart, Users, Sparkles, Target, Shield, BookOpen, Flame, Crown } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const topics = [
  {
    id: 1,
    name: 'Faith',
    icon: Sparkles,
    count: 156,
    color: 'from-amber-500 to-orange-500',
    description: 'Building unshakeable faith',
  },
  {
    id: 2,
    name: 'Family',
    icon: Users,
    count: 89,
    color: 'from-teal-500 to-emerald-500',
    description: 'Strengthening family bonds',
  },
  {
    id: 3,
    name: 'Healing',
    icon: Heart,
    count: 124,
    color: 'from-rose-500 to-pink-500',
    description: 'Physical & spiritual healing',
  },
  {
    id: 4,
    name: 'Purpose',
    icon: Target,
    count: 98,
    color: 'from-violet-500 to-purple-500',
    description: 'Discovering your calling',
  },
  {
    id: 5,
    name: 'Leadership',
    icon: Crown,
    count: 67,
    color: 'from-blue-500 to-indigo-500',
    description: 'Leading with integrity',
  },
  {
    id: 6,
    name: 'Protection',
    icon: Shield,
    count: 78,
    color: 'from-slate-500 to-gray-600',
    description: "God's divine protection",
  },
  {
    id: 7,
    name: 'Word Study',
    icon: BookOpen,
    count: 203,
    color: 'from-cyan-500 to-teal-500',
    description: 'Deep dive into scripture',
  },
  {
    id: 8,
    name: 'Revival',
    icon: Flame,
    count: 45,
    color: 'from-orange-500 to-red-500',
    description: 'Spiritual awakening',
  },
];

export const SermonsByTopic = () => {
  return (
    <section className="py-16 bg-background">
      <div className="regular-container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-foreground mb-3">Browse by Topic</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Find sermons that speak to your current season of life
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {topics.map(topic => (
            <Card
              key={topic.id}
              className="group cursor-pointer hover:shadow-lg transition-all duration-300 border-border/50 overflow-hidden p-0">
              <CardContent className="px-6 py-10 text-center relative">
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${topic.color} opacity-0 group-hover:opacity-10 transition-opacity`}
                />
                <div
                  className={`w-14 h-14 mx-auto mb-4 rounded-xl bg-gradient-to-br ${topic.color} flex items-center justify-center transform group-hover:scale-110 transition-transform`}>
                  <topic.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="font-semibold text-foreground mb-1 group-hover:text-primary transition-colors">
                  {topic.name}
                </h3>
                <p className="text-xs text-muted-foreground mb-2">{topic.description}</p>
                <span className="text-xs font-medium text-primary">{topic.count} sermons</span>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
