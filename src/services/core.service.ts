'use client';

import { z } from 'zod';
import { authInstance } from './config';
import {
  AdminHandleBannerRequestBanners,
  AdminHandleBannerRequestBannersSchema,
} from '@/types/banner.type';
import { useMutation, useQuery } from '@tanstack/react-query';

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

export const updateBanner = async (
  banners: AdminHandleBannerRequestBanners[],
) => {
  await authInstance.put('/v1/core/admin/banners', {
    banners: banners,
  });
};

// authInstacne는 빈 응답을 JSON으로 파싱하려고 할 때 에러가 발생합니다.
// 해당 API의 response가 빈 배열로 옵니다. 때문에 이를 예외처리하였습니다.
export const useUpdateBanner = ({
  onSuccess,
  onError,
}: {
  onSuccess?: () => void;
  onError?: (error: unknown) => void;
}) => {
  return useMutation({
    mutationFn: async (banners: AdminHandleBannerRequestBanners[]) => {
      try {
        await authInstance.put('/v1/core/admin/banners', {
          banners: banners,
        });
        return true;
      } catch (error) {
        if (
          error instanceof Error &&
          error.message.includes('Unexpected end of JSON input')
        )
          return true;
        throw error;
      }
    },
    onSuccess,
    onError,
  });
};
