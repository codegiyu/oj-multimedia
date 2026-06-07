'use client';

import { Download, FileText, Music, ShoppingBag } from 'lucide-react';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { FillImage } from '@/components/general/FillImage';
import { MultilineText } from '@/components/general/MultilineText';
import { ResourceDownloadButton } from '@/components/section/shared/ResourceDownloadButton';
import { CommunityContentDetailHero } from '../shared/CommunityContentDetailHero';
import { RESOURCE_TYPE_FILTER_LABELS } from '@/lib/utils/resourceBrowse';
import type { ResourceType } from '@/lib/types/community';

export type ResourceDetailView = {
  _id: string;
  title: string;
  description?: string;
  type: string;
  category?: string;
  coverImage?: string;
  downloads?: number;
  price?: number;
  isFree?: boolean;
  fileUrl?: string;
};

interface ResourceDetailPageClientProps {
  resource: ResourceDetailView;
}

function resourceTypeLabel(type: string): string {
  if ((Object.keys(RESOURCE_TYPE_FILTER_LABELS) as ResourceType[]).includes(type as ResourceType)) {
    return RESOURCE_TYPE_FILTER_LABELS[type as ResourceType];
  }

  return type.replace(/-/g, ' ');
}

export function ResourceDetailPageClient({ resource }: ResourceDetailPageClientProps) {
  const typeLabel = resourceTypeLabel(resource.type);
  const isAffiliate = resource.type === 'affiliate';
  const externalHref = resource.fileUrl?.trim() || '/marketplace/products';
  const external = Boolean(resource.fileUrl?.trim());

  return (
    <article className="min-h-screen">
      <CommunityContentDetailHero
        backHref="/community/resources/all"
        backLabel="Back to Resources"
        title={resource.title}
        subtitle={typeLabel}
        badge={
          <Badge variant="secondary" className="capitalize">
            {typeLabel}
          </Badge>
        }
        metaItems={[
          {
            icon: Download,
            label: `${(resource.downloads ?? 0).toLocaleString()} downloads`,
          },
        ]}>
        <div className="grid gap-8 lg:grid-cols-[minmax(0,320px)_1fr]">
          {resource.coverImage ? (
            <div className="relative aspect-[3/4] overflow-hidden rounded-2xl border border-border bg-muted">
              <FillImage
                src={resource.coverImage}
                alt={resource.title}
                imageContext="public"
                sizes="(max-width: 1024px) 100vw, 320px"
              />
            </div>
          ) : (
            <div className="flex aspect-square items-center justify-center rounded-2xl border border-border bg-muted">
              {resource.type === 'template' ? (
                <FileText className="h-16 w-16 text-primary" />
              ) : resource.type === 'beat' ? (
                <Music className="h-16 w-16 text-primary" />
              ) : (
                <ShoppingBag className="h-16 w-16 text-accent" />
              )}
            </div>
          )}

          <div className="space-y-6">
            {resource.category ? (
              <p className="text-sm text-muted-foreground capitalize">
                {resource.category.replace(/-/g, ' ')}
              </p>
            ) : null}

            {resource.description ? (
              <MultilineText text={resource.description} className="text-muted-foreground" />
            ) : null}

            {resource.price != null && !resource.isFree ? (
              <p className="text-lg font-semibold text-foreground">
                {typeof resource.price === 'number'
                  ? `₦${resource.price.toLocaleString()}`
                  : String(resource.price)}
              </p>
            ) : null}

            {isAffiliate ? (
              <Button variant="outline" className="w-full sm:w-auto" asChild>
                <Link
                  href={externalHref}
                  target={external ? '_blank' : undefined}
                  rel={external ? 'noopener noreferrer' : undefined}>
                  View product
                </Link>
              </Button>
            ) : (
              <ResourceDownloadButton
                _id={resource._id}
                title={resource.title}
                fileUrl={resource.fileUrl}
                className="w-full sm:w-auto"
              />
            )}
          </div>
        </div>
      </CommunityContentDetailHero>
    </article>
  );
}
