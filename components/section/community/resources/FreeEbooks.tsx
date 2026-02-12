'use client';

import { motion } from 'framer-motion';
import { BookOpen, Download, ArrowRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { SectionComp } from '@/components/general/SectionComp';
import type { Ebook } from './ResourcesPageClient';

interface FreeEbooksProps {
  ebooks: Ebook[];
}

export const FreeEbooks = ({ ebooks }: FreeEbooksProps) => {
  return (
    <SectionComp
      id="free-ebooks"
      icon={BookOpen}
      iconColor="primary"
      heading="Free E-books"
      subtext="Download free Christian e-books to enrich your faith journey and ministry"
      contentProps={{ enableAnimation: false }}>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {ebooks.map((ebook, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}>
            <Card className="card-interactive">
              <CardContent className="p-0">
                <div className="aspect-[3/4] bg-gradient-to-br from-primary/20 to-primary/10 rounded-t-xl flex items-center justify-center">
                  <BookOpen className="w-16 h-16 text-primary/50" />
                </div>
                <div className="p-6">
                  <h3 className="font-bold text-foreground mb-2 line-clamp-2">{ebook.title}</h3>
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                    {ebook.description}
                  </p>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Download className="w-4 h-4" />
                      <span>{ebook.downloads} downloads</span>
                    </div>
                  </div>
                  <Button className="w-full" variant="outline" size="sm">
                    Download
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </SectionComp>
  );
};
