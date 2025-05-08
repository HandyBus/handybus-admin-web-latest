'use client';

import { z } from 'zod';
import { authInstance } from './config';
import {
  AdminHandleBannerRequestBanners,
  AdminHandleBannerRequestBannersSchema,
} from '@/types/banner.type';
import { useMutation, useQuery } from '@tanstack/react-query';
import {
  AdminCreateAnnouncementRequestSchema,
  AdminCreateAnnouncementRequest,
  AdminAnnouncementResponseModelSchema,
  AdminUpdateAnnouncementRequestSchema,
  AdminUpdateAnnouncementRequest,
} from '@/types/announcement.type';
import { silentParse } from '@/utils/parse.util';

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

// ----- BANNER -----

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

// ----- ANNOUNCEMENT -----

export const getAnnouncements = async ({
  withDeleted,
}: {
  withDeleted?: boolean;
}) => {
  const res = await authInstance.get(
    `/v1/core/admin/announcements?withDeleted=${withDeleted}`,
    {
      shape: {
        announcements: AdminAnnouncementResponseModelSchema.array(),
      },
    },
  );
  return res.announcements;
};

export const useGetAnnouncements = (options: { withDeleted?: boolean }) => {
  return useQuery({
    queryKey: ['announcements', options],
    queryFn: () => getAnnouncements(options),
  });
};

export const getAnnouncement = async (announcementId: string) => {
  const res = await authInstance.get(
    `/v1/core/admin/announcements/${announcementId}`,
    {
      shape: {
        announcement: AdminAnnouncementResponseModelSchema,
      },
    },
  );
  return res.announcement;
};

export const useGetAnnouncement = (announcementId: string) => {
  return useQuery({
    queryKey: ['announcement', announcementId],
    queryFn: () => getAnnouncement(announcementId),
  });
};

export const postAnnouncement = async (
  body: AdminCreateAnnouncementRequest,
) => {
  return await authInstance.post(
    '/v1/core/admin/announcements',
    silentParse(AdminCreateAnnouncementRequestSchema, body),
  );
};

export const usePostAnnouncement = () => {
  return useMutation({
    mutationFn: postAnnouncement,
  });
};

export const putAnnouncement = async (
  announcementId: string,
  body: AdminUpdateAnnouncementRequest,
) => {
  return await authInstance.put(
    `/v1/core/admin/announcements/${announcementId}`,
    silentParse(AdminUpdateAnnouncementRequestSchema, body),
  );
};

export const usePutAnnouncement = () => {
  return useMutation({
    mutationFn: ({
      announcementId,
      body,
    }: {
      announcementId: string;
      body: AdminUpdateAnnouncementRequest;
    }) => putAnnouncement(announcementId, body),
  });
};
