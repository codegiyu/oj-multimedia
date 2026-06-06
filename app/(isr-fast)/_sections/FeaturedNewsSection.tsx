import { NewsSection } from '@/components/section/home';
import { SectionLoadError } from '@/components/general/SectionLoadError';
import { fetchPublicNewsArticles } from '@/app/news/_sections/shared';
import { HOME_ISR, mapArticleToNewsCard } from './shared';

export async function FeaturedNewsSection() {
  const { articles, error } = await fetchPublicNewsArticles({
    category: 'all',
    limit: 6,
    page: 1,
    type: 'featured',
    fetchOptions: HOME_ISR,
  });

  if (error && articles.length === 0) {
    return <SectionLoadError title="Featured news unavailable" message={error} />;
  }

  const mapped = articles.map(mapArticleToNewsCard);

  if (mapped.length === 0) return null;

  return (
    <NewsSection
      articles={mapped}
      heading="Featured news"
      subtext="Editorial picks"
      viewAllLink="/news/featured"
      sectionId="news-featured"
    />
  );
}
