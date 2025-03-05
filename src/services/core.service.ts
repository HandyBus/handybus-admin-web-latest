'use client';

import { z } from 'zod';
import { authInstance } from './config';
import {
  AdminHandleBannerRequestBanners,
  AdminHandleBannerRequestBannersSchema,
} from '@/types/banner.type';
import { useMutation, useQuery } from '@tanstack/react-query';

// ----- GET -----

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

export const getBanners = async () => {
  return await authInstance.get('/v1/core/admin/banners', {
    shape: {
      banners: z.array(AdminHandleBannerRequestBannersSchema),
    },
  });
};

export const useGetBanners = () => {
  return useQuery({
    queryKey: ['banners'],
    queryFn: getBanners,
  });
};

export const putBanner = async (banners: AdminHandleBannerRequestBanners[]) => {
  return await authInstance.put('/v1/core/admin/banners', {
    banners: banners,
  });
};

export const usePutBanner = ({
  onSuccess,
  onError,
}: {
  onSuccess?: () => void;
  onError?: (error: unknown) => void;
}) => {
  return useMutation({
    mutationFn: putBanner,
    onSuccess,
    onError,
  });
};
