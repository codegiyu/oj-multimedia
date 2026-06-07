import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { MainLayout } from '@/components/layout/MainLayout';
import { ResourceDetailPageClient } from '@/components/section/community/resources/ResourceDetailPageClient';
import { callPublicServerApi } from '@/lib/services/serverApi';
import { mapToResourceDetail } from '@/lib/utils/communityApiMappers';
import { buildDetailShareMetadata } from '@/lib/utils/metadata';

interface ResourceDetailPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: ResourceDetailPageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const id = resolvedParams.id;

  if (!id) {
    return {
      title: 'Resource Not Found',
      description: 'The requested resource could not be found.',
    };
  }

  const res = await callPublicServerApi('PUBLIC_GET_RESOURCE_ITEM', {
    query: `/${encodeURIComponent(id)}`,
  });

  if (res.type === 'error') {
    return {
      title: 'Resource Not Found',
      description: 'The requested resource could not be found.',
    };
  }

  const resource = mapToResourceDetail(res.data.resource as unknown as Record<string, unknown>);

  return buildDetailShareMetadata({
    title: `${resource.title} - Resources`,
    description: resource.description ?? resource.title,
    path: `/community/resources/${id}`,
    image: resource.coverImage,
    imageAlt: resource.title,
    type: 'article',
  });
}

export default async function ResourceDetailPage({ params }: ResourceDetailPageProps) {
  const resolvedParams = await params;
  const id = resolvedParams.id;

  if (!id) notFound();

  const res = await callPublicServerApi('PUBLIC_GET_RESOURCE_ITEM', {
    query: `/${encodeURIComponent(id)}`,
  });

  if (res.type === 'error') notFound();

  const resource = mapToResourceDetail(res.data.resource as unknown as Record<string, unknown>);

  return (
    <MainLayout>
      <ResourceDetailPageClient resource={resource} />
    </MainLayout>
  );
}
