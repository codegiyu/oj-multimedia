import { Newspaper, ArrowRight, Calendar, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Link from 'next/link';

const trendingNews = [
  {
    title: 'Gospel Artist Wins International Award',
    excerpt:
      'Nigerian gospel artist receives recognition at the Global Gospel Music Awards for outstanding contribution to Christian music...',
    date: '2 days ago',
    category: 'Music',
    slug: 'gospel-artist-wins-award',
    image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=300&fit=crop',
    trending: true,
  },
  {
    title: 'New Church Initiative Launches',
    excerpt:
      'Major churches unite to launch community outreach program focused on youth empowerment and spiritual growth...',
    date: '3 days ago',
    category: 'Ministry',
    slug: 'new-church-initiative',
    image: 'https://images.unsplash.com/photo-1504052434569-70ad5836ab65?w=400&h=300&fit=crop',
    trending: true,
  },
  {
    title: 'Christian Movie Premiere This Weekend',
    excerpt:
      'Highly anticipated faith-based film set to premiere in theaters nationwide, bringing hope and inspiration...',
    date: '5 days ago',
    category: 'Entertainment',
    slug: 'christian-movie-premiere',
    image: 'https://images.unsplash.com/photo-1529070538774-1843cb3265df?w=400&h=300&fit=crop',
    trending: false,
  },
  {
    title: 'Gospel Music Festival Announced',
    excerpt:
      'Annual gospel music festival returns with lineup of top Christian artists and worship leaders...',
    date: '1 week ago',
    category: 'Events',
    slug: 'gospel-music-festival',
    image: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400&h=300&fit=crop',
    trending: true,
  },
];

export function TrendingGospelNews() {
  return (
    <section className="py-16 bg-muted/30">
      <div className="regular-container mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
              <Newspaper className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-3xl font-bold">Trending Gospel News</h2>
              <p className="text-muted-foreground">
                Stay updated with the latest in Christian media
              </p>
            </div>
          </div>
          <Button variant="outline" className="hidden md:flex">
            View All News
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {trendingNews.map((item, idx) => (
            <Card
              key={idx}
              className="group hover:shadow-lg transition-all duration-300 overflow-hidden border-border/50">
              <Link href={`/news/${item.slug}`}>
                <div className="relative aspect-video overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                  {item.trending && (
                    <div className="absolute top-3 right-3">
                      <span className="flex items-center gap-1 px-2 py-1 bg-primary text-primary-foreground text-xs font-semibold rounded-full">
                        <TrendingUp className="w-3 h-3" />
                        Trending
                      </span>
                    </div>
                  )}
                </div>
                <CardContent className="p-5">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="px-2 py-1 text-xs font-semibold bg-primary/10 text-primary rounded-full">
                      {item.category}
                    </span>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Calendar className="w-3 h-3" />
                      <span>{item.date}</span>
                    </div>
                  </div>
                  <h3 className="text-lg font-bold text-foreground mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
                    {item.excerpt}
                  </p>
                </CardContent>
              </Link>
            </Card>
          ))}
        </div>

        <div className="mt-8 md:hidden">
          <Button variant="outline" className="w-full">
            View All News
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    </section>
  );
}
