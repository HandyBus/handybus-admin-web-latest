'use server';

import { accessToken } from '@/utils/auth.util';
import { revalidatePath } from 'next/cache';

export const addArtist = async (name: string) => {
  const token = await accessToken();
  const response = await fetch(
    new URL('/shuttle-operation/admin/artists', process.env.BASE_URL),
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name }),
    },
  );

  if (response.status !== 201) {
    return Promise.reject(response.json());
  }

  revalidatePath('/artists', 'layout');
  return response.json();
};
