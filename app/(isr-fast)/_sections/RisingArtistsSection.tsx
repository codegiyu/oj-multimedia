import { ArtistsSpotlightGridSection } from '@/app/music/_sections/ArtistsSpotlightGridSection';
import { HOME_ISR } from './shared';

export async function RisingArtistsSection() {
  return <ArtistsSpotlightGridSection scope="rising" variant="hub" fetchOptions={HOME_ISR} />;
}
