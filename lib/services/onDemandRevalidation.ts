import { z } from 'zod';

export const revalidationContentTypeSchema = z.enum([
  'home',
  'music',
  'music_item',
  'news',
  'news_item',
  'marketplace_products',
  'marketplace_product',
]);

export type RevalidationContentType = z.infer<typeof revalidationContentTypeSchema>;

export const revalidationRequestSchema = z.union([
  z.object({
    paths: z.array(z.string().min(1)).min(1),
  }),
  z.object({
    type: revalidationContentTypeSchema,
    id: z.string().min(1).optional(),
    slug: z.string().min(1).optional(),
  }),
]);

export type RevalidationRequest = z.infer<typeof revalidationRequestSchema>;

export function pathsForRevalidationContent(input: {
  type: RevalidationContentType;
  id?: string;
  slug?: string;
}): string[] {
  const { type, id, slug } = input;

  switch (type) {
    case 'home':
      return ['/'];
    case 'music':
      return ['/', '/music'];
    case 'music_item':
      if (!id) throw new Error('id is required for music_item revalidation');
      return ['/', '/music', `/music/${encodeURIComponent(id)}`];
    case 'news':
      return ['/', '/news'];
    case 'news_item':
      if (!id) throw new Error('id is required for news_item revalidation');
      return ['/', '/news', `/news/story/${encodeURIComponent(id)}`];
    case 'marketplace_products':
      return ['/marketplace', '/marketplace/products'];
    case 'marketplace_product':
      if (!slug) throw new Error('slug is required for marketplace_product revalidation');
      return [
        '/marketplace',
        '/marketplace/products',
        `/marketplace/products/${encodeURIComponent(slug)}`,
      ];
    default: {
      const _exhaustive: never = type;
      return _exhaustive;
    }
  }
}

export function resolveRevalidationPaths(body: RevalidationRequest): string[] {
  if ('paths' in body) {
    return [...new Set(body.paths.map(path => path.trim()).filter(Boolean))];
  }

  return pathsForRevalidationContent(body);
}
