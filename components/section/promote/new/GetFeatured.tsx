import { Star, TrendingUp, Home, Mail, CheckCircle, ArrowRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { RegularBtn } from '@/components/atoms/RegularBtn';
import { Button } from '@/components/ui/button';

const featuredOptions = [
  {
    title: 'Homepage Slider Banner',
    duration: '1 Week',
    price: '₦10,000',
    icon: Home,
    description: 'Get maximum visibility on our homepage slider',
    features: ['Homepage banner placement', '7 days visibility', 'Click-through tracking'],
  },
  {
    title: 'Trending Section',
    duration: '1 Week',
    price: '₦8,000',
    icon: TrendingUp,
    description: 'Featured in the trending section',
    features: ['Trending badge', 'Priority placement', 'Enhanced discoverability'],
  },
  {
    title: 'Social Media Promo',
    duration: 'Flexible',
    price: '₦5,000 - ₦10,000',
    icon: Mail,
    description: 'Promote across Facebook and Instagram',
    features: ['Multi-platform promotion', 'Custom creatives', 'Performance reports'],
  },
];

export const GetFeatured = () => {
  return (
    <section className="py-20 bg-background">
      <div className="regular-container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Star className="w-4 h-4" />
            Get Featured
          </div>
          <h2 className="text-4xl font-bold text-foreground mb-4">
            Get Featured and Boost Your Visibility
          </h2>
          <p className="text-lg text-muted-foreground">
            Stand out from the crowd with our featured placement options. Get noticed by thousands
            of potential listeners.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {featuredOptions.map((option, index) => {
            const Icon = option.icon;
            return (
              <Card
                key={index}
                className="hover:shadow-lg transition-all duration-300 border-border/50">
                <CardContent className="px-6 py-12">
                  <div className="text-center mb-6">
                    <div className="w-14 h-14 mx-auto mb-4 rounded-xl bg-gradient-to-br from-accent to-accent/70 flex items-center justify-center">
                      <Icon className="w-7 h-7 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-foreground mb-2">{option.title}</h3>
                    <div className="flex items-baseline justify-center gap-1 mb-2">
                      <span className="text-3xl font-bold text-foreground">{option.price}</span>
                    </div>
                    <p className="text-xs text-muted-foreground mb-2">{option.duration}</p>
                    <p className="text-sm text-muted-foreground">{option.description}</p>
                  </div>
                  <ul className="space-y-3 mb-6">
                    {option.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm text-foreground">
                        <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button className="w-full" variant="outline" size="lg">
                    Get Featured
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <Card className="bg-gradient-to-r from-primary/10 to-secondary/10 border-primary/20">
          <CardContent className="p-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center">
                  <Star className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">Multiple Feature Options</h3>
                  <p className="text-sm text-muted-foreground">
                    Combine multiple features for maximum impact. Contact us for package deals.
                  </p>
                </div>
              </div>
              <RegularBtn
                variant="cta"
                onClick={() => {
                  document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
                }}>
                Contact for Packages
              </RegularBtn>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};
