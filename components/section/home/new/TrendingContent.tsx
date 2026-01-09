import { TrendingUp, ArrowRight, Music, Mic2, Newspaper } from 'lucide-react';

const trending = [
  {
    type: 'song',
    title: 'Grace Upon Grace',
    subtitle: 'Trending in Worship',
    stats: '+245% this week',
    icon: Music,
  },
  {
    type: 'sermon',
    title: 'Overcoming Fear in 2024',
    subtitle: 'Pastor Michael',
    stats: '15K views today',
    icon: Mic2,
  },
  {
    type: 'news',
    title: 'New Community Center Opens',
    subtitle: 'Community News',
    stats: '2.3K shares',
    icon: Newspaper,
  },
  {
    type: 'song',
    title: 'Unshakeable',
    subtitle: 'The Worship Movement',
    stats: '+180% this week',
    icon: Music,
  },
];

export function TrendingContent() {
  return (
    <section className="py-16 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5">
      <div className="regular-container mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <TrendingUp className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h2 className="text-3xl font-bold">Trending Now</h2>
            <p className="text-muted-foreground">What's hot in the community</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {trending.map((item, index) => (
            <a
              key={index}
              href="#"
              className="group p-5 bg-card rounded-2xl shadow-card card-hover border border-transparent hover:border-primary/20">
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <item.icon className="w-6 h-6 text-primary" />
                </div>
                <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
              </div>

              <h3 className="font-bold mb-1 line-clamp-1">{item.title}</h3>
              <p className="text-sm text-muted-foreground mb-3">{item.subtitle}</p>

              <div className="flex items-center gap-1.5 text-xs font-semibold text-primary">
                <TrendingUp className="w-3.5 h-3.5" />
                {item.stats}
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
