'use client';

import { motion } from 'framer-motion';
import { Star, CheckCircle, ArrowRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { SectionComp } from '@/components/general/SectionComp';
import Link from 'next/link';
import { getFeaturedIcon } from '@/lib/utils/promotionIconMap';
import type { FeaturedOption } from '@/lib/types/promotion';

export interface GetFeaturedProps {
  featuredOptions: FeaturedOption[];
}

export const GetFeatured = ({ featuredOptions }: GetFeaturedProps) => {
  return (
    <SectionComp
      id="get-featured"
      icon={Star}
      iconColor="accent"
      heading="Get Featured and Boost Your Visibility"
      subtext="Stand out from the crowd with our featured placement options. Get noticed by thousands of potential listeners."
      contentProps={{ enableAnimation: false }}>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {featuredOptions.map((option, index) => {
          const Icon = getFeaturedIcon(option.icon);
          return (
            <motion.div
              key={option._id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}>
              <Card className="card-interactive">
                <CardContent className="p-6">
                  <div className="text-center mb-6">
                    <div className="w-14 h-14 mx-auto mb-4 rounded-xl bg-gradient-to-br from-accent/20 to-accent/10 flex items-center justify-center">
                      <Icon className="w-7 h-7 text-accent" />
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
                  <Button className="w-full" variant="outline" size="lg" asChild>
                    <Link href="/contact">
                      Get Featured
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}>
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
              <Button variant="accent" asChild>
                <Link href="/contact">Contact for Packages</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </SectionComp>
  );
};
