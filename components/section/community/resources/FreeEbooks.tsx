'use client';

import { motion } from 'motion/react';
import { BookOpen, Download } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { SectionComp } from '@/components/general/SectionComp';
import { SectionEmptyState } from '@/components/general/SectionEmptyState';
import { FillImage } from '@/components/general/FillImage';
import type { Ebook } from './ResourcesPageClient';
import { ResourceDownloadButton } from '@/components/section/shared/ResourceDownloadButton';

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
      {ebooks.length === 0 ? (
        <SectionEmptyState
          title="No e-books available yet"
          description="Free Christian e-books will be listed here for download."
          icon={BookOpen}
          actionLabel="Browse resources"
          actionHref="/community/resources"
        />
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {ebooks.map((ebook, index) => (
            <motion.div
              key={ebook._id ?? index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}>
              <Card className="card-interactive">
                <CardContent className="p-0">
                  <div className="aspect-[3/4] relative bg-muted rounded-t-xl overflow-hidden">
                    <FillImage
                      src={ebook.cover ?? ''}
                      alt={ebook.title}
                      imageContext="public"
                      sizes="(max-width: 768px) 50vw, 280px"
                    />
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
                    <ResourceDownloadButton
                      _id={ebook._id}
                      title={ebook.title}
                      fileUrl={ebook.fileUrl}
                      className="w-full"
                    />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </SectionComp>
  );
};
