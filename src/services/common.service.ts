'use client';

import { z } from 'zod';
import { authInstance } from './config';

// TODO : v2 api가 준비되면 migrate
export const getPresignedUrl = async (
  key: 'concerts' | 'users/profiles' | 'reviews',
  extension: string, // TODO 'jpg' | 'jpeg' | 'png' | 'gif' | 'webp' | 'svg',
) => {
  return await authInstance.get(
    `/v1/common/image/presigned-url?key=${key}&extension=${extension}`,
    {
      shape: {
        presignedUrl: z.string().url(),
        cdnUrl: z.string().url(),
      },
    },
  );
};
