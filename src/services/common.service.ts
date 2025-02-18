'use client';

import { z } from 'zod';
import { authInstance } from './config';

export type Extension = 'jpg' | 'jpeg' | 'png' | 'gif' | 'webp' | 'svg';

export const getPresignedUrl = async (
  key: 'concerts' | 'users/profiles' | 'reviews',
  extension: Extension,
) => {
  return await authInstance.get(
    `/v1/core/admin/image/presigned-url?key=${key}&extension=${extension}`,
    {
      shape: {
        presignedUrl: z.string().url(),
        cdnUrl: z.string().url(),
      },
    },
  );
};
