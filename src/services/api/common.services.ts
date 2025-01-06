'use client';

import { authInstance } from '../config';

export const getPresignedUrl = async (
  key: 'concerts' | 'users/profiles' | 'reviews',
  extension: string, // TODO 'jpg' | 'jpeg' | 'png' | 'gif' | 'webp' | 'svg',
) => {
  return await authInstance.get<{
    presignedUrl: string;
    cdnUrl: string;
  }>(`/common/image/presigned-url?key=${key}&extension=${extension}`);
};
