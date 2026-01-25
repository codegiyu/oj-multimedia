'use client';

import { motion } from 'framer-motion';
import { FileText, Download, ArrowRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import type { Template } from './ResourcesPageClient';

interface SermonTemplatesProps {
  templates: Template[];
}

export const SermonTemplates = ({ templates }: SermonTemplatesProps) => {
  return (
    <section id="sermon-templates" className="py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-10">
        <div className="flex items-center justify-center mb-4">
          <div className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center">
            <FileText className="w-5 h-5 text-secondary" />
          </div>
        </div>
        <h2 className="section-header mb-3">Sermon Templates / Flyers</h2>
        <p className="text-muted-foreground max-w-lg mx-auto">
          Professional templates and flyer designs for your church events and ministry
        </p>
      </motion.div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {templates.map((template, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}>
            <Card className="card-interactive">
              <CardContent className="p-0">
                <div className="aspect-[4/3] bg-gradient-to-br from-secondary/20 to-secondary/10 rounded-t-xl flex items-center justify-center relative">
                  <FileText className="w-16 h-16 text-secondary/50" />
                  <div className="absolute top-3 right-3">
                    <span className="px-2 py-1 bg-secondary/20 text-secondary text-xs font-medium rounded-full">
                      {template.type}
                    </span>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="font-bold text-foreground mb-2 line-clamp-2">{template.title}</h3>
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                    {template.description}
                  </p>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Download className="w-4 h-4" />
                      <span>{template.downloads} downloads</span>
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
    </section>
  );
};
