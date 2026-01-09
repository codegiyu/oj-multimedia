import { Download, FileText, BookOpen, Music, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const downloadables = [
  {
    id: 1,
    title: 'Weekly Devotional Guide',
    type: 'PDF',
    size: '2.4 MB',
    downloads: '1.2K',
    icon: BookOpen,
    category: 'Devotional',
    image: 'https://images.unsplash.com/photo-1529070538774-1843cb3265df?w=300&h=200&fit=crop',
  },
  {
    id: 2,
    title: 'Worship Song Lyrics Collection',
    type: 'PDF',
    size: '5.8 MB',
    downloads: '856',
    icon: Music,
    category: 'Music',
    image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=200&fit=crop',
  },
  {
    id: 3,
    title: 'Bible Study Worksheets',
    type: 'PDF',
    size: '3.1 MB',
    downloads: '2.1K',
    icon: FileText,
    category: 'Study',
    image: 'https://images.unsplash.com/photo-1504052434569-70ad5836ab65?w=300&h=200&fit=crop',
  },
  {
    id: 4,
    title: 'Prayer Wallpapers Pack',
    type: 'ZIP',
    size: '12.5 MB',
    downloads: '634',
    icon: ImageIcon,
    category: 'Wallpapers',
    image: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=300&h=200&fit=crop',
  },
];

export function DownloadablesSection() {
  return (
    <section className="py-16 bg-background">
      <div className="regular-container mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
              <Download className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-3xl font-bold">Downloadables</h2>
              <p className="text-muted-foreground">Free resources for your spiritual journey</p>
            </div>
          </div>
          <Button variant="outline">View All</Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {downloadables.map(item => (
            <Card
              key={item.id}
              className="group hover:shadow-md transition-all duration-300 border-border/50 overflow-hidden">
              <div className="relative aspect-video overflow-hidden">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-transparent to-transparent" />
                <div className="absolute bottom-3 left-3 right-3">
                  <Badge variant="secondary" className="text-xs">
                    {item.type}
                  </Badge>
                </div>
              </div>
              <CardContent className="p-4">
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <item.icon className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-foreground mb-1 line-clamp-2 group-hover:text-primary transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-xs text-muted-foreground">{item.category}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
                  <span>{item.size}</span>
                  <span className="flex items-center gap-1">
                    <Download className="w-3 h-3" />
                    {item.downloads}
                  </span>
                </div>
                <Button variant="outline" size="sm" className="w-full">
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
