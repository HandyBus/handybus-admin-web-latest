'use client';

import { authInstance } from '../config';
import { queryClient } from '@/components/Provider';

// TODO : v2 api가 준비되면 migrate
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
