'use client';

import { authInstance } from '../new-fetch';
import { revalidatePath } from 'next/cache';
import { ArtistListSchema } from '@/types/artist.type';

export const addArtist = async (name: string) => {
  const response = await authInstance.post<{ ok: boolean }>(
    '/shuttle-operation/admin/artists',
    {
      name,
    },
  );
  revalidatePath('/artists', 'layout');
  return response;
};

export const getArtists = async () => {
  const response = await authInstance.get<{ ok: boolean; artists: unknown }>(
    '/shuttle-operation/admin/artists',
  );
  return ArtistListSchema.parse(response.artists);
};
