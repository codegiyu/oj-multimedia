'use client';

import { motion } from 'motion/react';
import { Download, FileText, Music, ShoppingBag } from 'lucide-react';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { FillImage } from '@/components/general/FillImage';
import { ResourceDownloadButton } from '@/components/section/shared/ResourceDownloadButton';
import type { ResourceBrowseItem } from '@/lib/utils/resourceBrowse';

interface ResourceBrowseCardProps {
  item: ResourceBrowseItem;
  index: number;
}

export function ResourceBrowseCard({ item, index }: ResourceBrowseCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.05 }}>
      {item.kind === 'ebook' ? <EbookCard data={item.data} /> : null}
      {item.kind === 'template' ? <TemplateCard data={item.data} /> : null}
      {item.kind === 'beat' ? <BeatCard data={item.data} /> : null}
      {item.kind === 'wallpaper' ? <WallpaperCard data={item.data} /> : null}
      {item.kind === 'affiliate' ? <AffiliateCard data={item.data} /> : null}
    </motion.div>
  );
}

function resourceDetailHref(id: string): string {
  return `/community/resources/${id}`;
}

function EbookCard({ data }: { data: Extract<ResourceBrowseItem, { kind: 'ebook' }>['data'] }) {
  return (
    <Card className="card-interactive h-full">
      <CardContent className="p-0 flex flex-col h-full">
        <Link href={resourceDetailHref(data._id)} className="block">
          <div className="aspect-[3/4] relative bg-muted rounded-t-xl overflow-hidden">
            <FillImage
              src={data.cover ?? ''}
              alt={data.title}
              imageContext="public"
              sizes="280px"
            />
          </div>
        </Link>
        <div className="p-6 flex flex-col flex-1">
          <Link href={resourceDetailHref(data._id)} className="block">
            <h3 className="font-bold text-foreground mb-2 line-clamp-2 hover:text-primary transition-colors">
              {data.title}
            </h3>
          </Link>
          <p className="text-sm text-muted-foreground mb-4 line-clamp-2 flex-1">
            {data.description}
          </p>
          <p className="text-xs text-muted-foreground mb-4 flex items-center gap-1">
            <Download className="w-4 h-4" />
            {data.downloads} downloads
          </p>
          <ResourceDownloadButton
            _id={data._id}
            title={data.title}
            fileUrl={data.fileUrl}
            className="w-full"
          />
        </div>
      </CardContent>
    </Card>
  );
}

function TemplateCard({
  data,
}: {
  data: Extract<ResourceBrowseItem, { kind: 'template' }>['data'];
}) {
  return (
    <Card className="card-interactive h-full">
      <CardContent className="p-6 flex flex-col h-full">
        <Link href={resourceDetailHref(data._id)} className="block flex-1">
          <FileText className="w-10 h-10 text-primary mb-4" />
          <h3 className="font-bold text-foreground mb-2 hover:text-primary transition-colors">
            {data.title}
          </h3>
          <p className="text-sm text-muted-foreground mb-4 flex-1 line-clamp-3">
            {data.description}
          </p>
          <p className="text-xs text-muted-foreground mb-4">{data.downloads} downloads</p>
        </Link>
        <ResourceDownloadButton
          _id={data._id}
          title={data.title}
          fileUrl={data.fileUrl}
          className="w-full"
        />
      </CardContent>
    </Card>
  );
}

function BeatCard({ data }: { data: Extract<ResourceBrowseItem, { kind: 'beat' }>['data'] }) {
  return (
    <Card className="card-interactive h-full">
      <CardContent className="p-0 flex flex-col h-full">
        <Link href={resourceDetailHref(data._id)} className="block">
          {data.cover ? (
            <div className="aspect-square relative bg-muted rounded-t-xl overflow-hidden">
              <FillImage src={data.cover} alt={data.title} imageContext="public" sizes="280px" />
            </div>
          ) : (
            <div className="aspect-square bg-muted rounded-t-xl flex items-center justify-center">
              <Music className="w-12 h-12 text-muted-foreground" />
            </div>
          )}
        </Link>
        <div className="p-6 flex flex-col flex-1">
          <Link href={resourceDetailHref(data._id)} className="block">
            <h3 className="font-bold text-foreground mb-2 hover:text-primary transition-colors">
              {data.title}
            </h3>
          </Link>
          <p className="text-sm text-muted-foreground mb-4 flex-1 line-clamp-2">
            {data.description}
          </p>
          <ResourceDownloadButton
            _id={data._id}
            title={data.title}
            fileUrl={data.fileUrl}
            className="w-full"
          />
        </div>
      </CardContent>
    </Card>
  );
}

function WallpaperCard({
  data,
}: {
  data: Extract<ResourceBrowseItem, { kind: 'wallpaper' }>['data'];
}) {
  const categoryLabel = data.category.replace(/-/g, ' ');

  return (
    <Card className="card-interactive h-full">
      <CardContent className="p-0 flex flex-col h-full">
        <Link href={resourceDetailHref(data._id)} className="block">
          <div className="aspect-video relative bg-muted rounded-t-xl overflow-hidden">
            <FillImage
              src={data.cover ?? ''}
              alt={data.title}
              imageContext="public"
              sizes="400px"
            />
          </div>
        </Link>
        <div className="p-6 flex flex-col flex-1">
          <Badge variant="secondary" className="w-fit mb-2 capitalize">
            {categoryLabel}
          </Badge>
          <Link href={resourceDetailHref(data._id)} className="block">
            <h3 className="font-bold text-foreground mb-2 hover:text-primary transition-colors">
              {data.title}
            </h3>
          </Link>
          <p className="text-sm text-muted-foreground mb-4 flex-1 line-clamp-2">
            {data.description}
          </p>
          <ResourceDownloadButton
            _id={data._id}
            title={data.title}
            fileUrl={data.fileUrl}
            className="w-full"
          />
        </div>
      </CardContent>
    </Card>
  );
}

function AffiliateCard({
  data,
}: {
  data: Extract<ResourceBrowseItem, { kind: 'affiliate' }>['data'];
}) {
  return (
    <Card className="card-interactive h-full">
      <CardContent className="p-6 flex flex-col h-full">
        <Link href={resourceDetailHref(data._id)} className="block flex-1">
          <ShoppingBag className="w-10 h-10 text-accent mb-4" />
          <Badge variant="secondary" className="w-fit mb-2 capitalize">
            {data.categoryLabel ?? data.category.replace(/-/g, ' ')}
          </Badge>
          <h3 className="font-bold text-foreground mb-2 hover:text-primary transition-colors">
            {data.title}
          </h3>
          <p className="text-sm text-muted-foreground mb-2 flex-1 line-clamp-3">
            {data.description}
          </p>
          {data.price ? <p className="font-semibold text-foreground mb-4">{data.price}</p> : null}
        </Link>
        <Button variant="outline" className="w-full" asChild>
          <Link href={resourceDetailHref(data._id)}>View details</Link>
        </Button>
      </CardContent>
    </Card>
  );
}
