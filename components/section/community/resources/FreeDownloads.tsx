'use client';

import { motion } from 'framer-motion';
import { Download, ArrowDown, CheckCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { SectionComp } from '@/components/general/SectionComp';
import Link from 'next/link';
import type { ResourceDownloadCategory } from '@/lib/types/promotion';

export interface FreeDownloadsProps {
  downloadCategories: ResourceDownloadCategory[];
}

export const FreeDownloads = ({ downloadCategories }: FreeDownloadsProps) => {
  return (
    <SectionComp
      id="free-downloads"
      icon={Download}
      iconColor="accent"
      heading="Free Downloads"
      subtext="Access all our free resources in one place. Everything you need for your ministry."
      contentProps={{ enableAnimation: false }}>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {downloadCategories.map((category, index) => (
          <motion.div
            key={category._id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}>
            <Card className="card-interactive">
              <CardContent className="p-6 text-center">
                <div className="text-5xl mb-4">{category.icon}</div>
                <h3 className="font-bold text-foreground mb-2">{category.title}</h3>
                <p className="text-2xl font-bold text-primary mb-2">{category.count}</p>
                <p className="text-sm text-muted-foreground mb-4">{category.description}</p>
                <Button className="w-full" variant="outline" size="sm" asChild>
                  <Link href={category.href}>
                    Browse
                    <ArrowDown className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}>
        <Card className="bg-gradient-to-r from-primary/10 to-secondary/10 border-primary/20">
          <CardContent className="p-8">
            <div className="max-w-2xl mx-auto text-center">
              <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-primary/10 flex items-center justify-center">
                <Download className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-4">All Resources Are Free</h3>
              <p className="text-muted-foreground mb-6">
                We believe in supporting the ministry community. All our resources are completely
                free to download and use for your ministry needs.
              </p>
              <div className="grid sm:grid-cols-3 gap-4 text-sm">
                <div className="flex items-center gap-2 justify-center">
                  <CheckCircle className="w-5 h-5 text-primary" />
                  <span className="text-foreground">100% Free</span>
                </div>
                <div className="flex items-center gap-2 justify-center">
                  <CheckCircle className="w-5 h-5 text-primary" />
                  <span className="text-foreground">No Sign-up Required</span>
                </div>
                <div className="flex items-center gap-2 justify-center">
                  <CheckCircle className="w-5 h-5 text-primary" />
                  <span className="text-foreground">Regular Updates</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </SectionComp>
  );
};
