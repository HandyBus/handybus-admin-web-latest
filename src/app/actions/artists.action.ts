'use server';

import { instance } from '@/services/config';
import { revalidatePath } from 'next/cache';

export const addArtist = async (name: string) => {
  const response = (
    await instance.post<{ ok: boolean }>('/shuttle-operation/admin/artists', {
      name,
    })
  ).data;
  revalidatePath('/artists', 'layout');
  return response;
};
