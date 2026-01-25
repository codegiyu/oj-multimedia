'use client';

import { Users, Mic, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const pastors = [
  {
    id: 1,
    name: 'Pastor David Chen',
    title: 'Senior Pastor',
    church: 'Grace Community Church',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop',
    sermons: 156,
    followers: '45.2K',
    featured: true,
    topics: ['Faith', 'Leadership', 'Purpose'],
  },
  {
    id: 2,
    name: 'Rev. Sarah Williams',
    title: 'Teaching Pastor',
    church: 'New Life Fellowship',
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=300&fit=crop',
    sermons: 89,
    followers: '32.1K',
    featured: false,
    topics: ['Family', 'Healing', 'Women'],
  },
  {
    id: 3,
    name: 'Bishop James Moore',
    title: 'Founding Bishop',
    church: 'Kingdom Life Cathedral',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop',
    sermons: 234,
    followers: '78.5K',
    featured: true,
    topics: ['Word Study', 'Revival', 'Faith'],
  },
  {
    id: 4,
    name: 'Pastor Grace Okonkwo',
    title: 'Associate Pastor',
    church: 'Harvest Church International',
    image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=300&h=300&fit=crop',
    sermons: 67,
    followers: '28.9K',
    featured: false,
    topics: ['Purpose', 'Youth', 'Prayer'],
  },
];

export const PastorSpotlight = () => {
  return (
    <section className="py-16 bg-muted/30">
      <div className="regular-container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-foreground mb-2">Pastor Spotlight</h2>
            <p className="text-muted-foreground">Follow your favorite speakers and pastors</p>
          </div>
          <Button variant="outline" className="hidden md:flex">
            View All Pastors
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {pastors.map(pastor => (
            <Card
              key={pastor.id}
              className="group hover:shadow-lg transition-all duration-300 border-border/50 overflow-hidden">
              <CardContent className="p-6 text-center">
                <div className="relative mb-4 inline-block">
                  <img
                    src={pastor.image}
                    alt={pastor.name}
                    className="w-24 h-24 rounded-full object-cover mx-auto ring-4 ring-primary/20 group-hover:ring-primary/40 transition-all"
                  />
                  {pastor.featured && (
                    <Badge className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs">
                      Featured
                    </Badge>
                  )}
                </div>
                <h3 className="font-semibold text-foreground mb-1 group-hover:text-primary transition-colors">
                  {pastor.name}
                </h3>
                <p className="text-sm text-muted-foreground mb-1">{pastor.title}</p>
                <p className="text-xs text-muted-foreground mb-3">{pastor.church}</p>

                <div className="flex flex-wrap justify-center gap-1 mb-4">
                  {pastor.topics.map(topic => (
                    <Badge key={topic} variant="secondary" className="text-xs">
                      {topic}
                    </Badge>
                  ))}
                </div>

                <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground mb-4">
                  <span className="flex items-center gap-1">
                    <Mic className="w-3 h-3" />
                    {pastor.sermons}
                  </span>
                  <span className="flex items-center gap-1">
                    <Users className="w-3 h-3" />
                    {pastor.followers}
                  </span>
                </div>

                <div className="flex gap-2">
                  <Button size="sm" className="flex-1">
                    Follow
                  </Button>
                  <Button size="sm" variant="outline">
                    <ExternalLink className="w-4 h-4" />
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
