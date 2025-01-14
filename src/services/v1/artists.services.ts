'use client';

import { authInstance } from '../config';
import { queryClient } from '@/components/Provider';

export const addArtist = async (name: string) => {
  const response = await authInstance.post(
    '/v1/shuttle-operation/admin/artists',
    {
      name,
    },
  );
  queryClient.invalidateQueries({ queryKey: ['artists'] });
  return response;
};
