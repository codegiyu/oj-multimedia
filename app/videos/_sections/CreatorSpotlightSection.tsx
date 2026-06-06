import { ArtistsSpotlightGridSection } from '@/app/music/_sections/ArtistsSpotlightGridSection';
import type { VideoSectionProps } from './shared';

export async function CreatorSpotlightSection({ fetchOptions }: VideoSectionProps) {
  return (
    <ArtistsSpotlightGridSection scope="spotlight" variant="hub" fetchOptions={fetchOptions} />
  );
}
