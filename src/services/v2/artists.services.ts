import { authInstance } from '../config';
import { ArtistViewEntity } from '@/types/v2/artist.type';

export const getArtists = async () => {
  const response = await authInstance.get(
    '/v2/shuttle-operation/admin/artists',
    { shape: { artists: ArtistViewEntity.array() } },
  );
  return response.artists;
};
