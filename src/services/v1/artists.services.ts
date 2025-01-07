'use client';

import { authInstance } from '../config';
import { ArtistListSchema } from '@/types/v1/artist.type';
import { queryClient } from '@/components/Provider';
import { silentParse } from '@/utils/parse.util';

export const addArtist = async (name: string) => {
  const response = await authInstance.post<{ ok: boolean }>(
    '/v1/shuttle-operation/admin/artists',
    {
      name,
    },
  );
  queryClient.invalidateQueries({ queryKey: ['artists'] });
  return response;
};

export const getArtists = async () => {
  const response = await authInstance.get<{ ok: boolean; artists: unknown }>(
    '/v1/shuttle-operation/admin/artists',
  );
  return silentParse(ArtistListSchema, response.artists);
};
