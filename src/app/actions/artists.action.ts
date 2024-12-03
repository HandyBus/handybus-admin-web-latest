'use server';

import { instance } from '@/services/config';

export const addArtist = async (name: string) => {
  const response = (
    await instance.post<{ ok: boolean }>('/shuttle-operation/admin/artists', {
      name,
    })
  ).data;

  if (response.ok) {
    return JSON.parse(JSON.stringify(response));
  } else {
    return Promise.reject('');
  }
};
