'use server';

import { instance } from '@/services/config';
import { revalidatePath } from 'next/cache';
import { ArtistListSchema } from '@/types/artist.type';

export const addArtist = async (name: string) => {
  const response = (
    await instance.post<{ ok: boolean }>('/shuttle-operation/admin/artists', {
      name,
    })
  ).data;
  revalidatePath('/artists', 'layout');
  return response;
};

export const getArtists = async () => {
  const response = await instance.get('/shuttle-operation/admin/artists');
  console.log(response.data);
  return ArtistListSchema.parse(response.data.artists);
};
