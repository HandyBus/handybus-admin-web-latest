'use server';

import { instance } from '@/services/config';

export const getPresignedUrl = async (
  key: 'concerts' | 'users/profiles' | 'reviews',
  extension: string, // TODO 'jpg' | 'jpeg' | 'png' | 'gif' | 'webp' | 'svg',
) => {
  try {
    // TODO set no-cache or no-store? when refactored to fetch
    const response = await instance.get(
      `/common/image/presigned-url?key=${key}&extension=${extension}`,
    );
    return response.data as { presignedUrl: string; cdnUrl: string };
  } catch (e) {
    console.error(e);
    return Promise.reject(e);
  }
};
