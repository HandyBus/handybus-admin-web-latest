'use client';

import {
  CreateHubRequest,
  CreateHubRequestSchema,
  RegionHubSchema,
} from '@/types/hub.type';
import { authInstance } from './config';
import { silentParse } from '@/utils/parse.util';
import {
  keepPreviousData,
  useInfiniteQuery,
  useMutation,
  useQuery,
} from '@tanstack/react-query';
import regions from '../data/regions.json';
import { RegionSchema } from '@/types/region.type';
import { toSearchParamString } from '@/utils/searchParam.util';
import { withPagination } from '@/types/common.type';
import { z } from 'zod';

// ----- GET -----

// 실제 API 호출이 아니고 데이터 객체를 불러옴
export const getRegions = () => {
  return silentParse(RegionSchema.array(), regions.regions);
};

export const useGetRegions = () => {
  return useQuery({
    queryKey: ['region'],
    queryFn: () => getRegions(),
  });
};

export interface GetRegionHubsOptions {
  regionId?: string;
  name?: string;
  usageType?: string[];
  orderBy?: 'name' | 'address' | 'latitude' | 'longitude';
  order?: 'ASC' | 'DESC';
}

export interface GetRegionHubsOptionsWithPagination
  extends GetRegionHubsOptions {
  page: string | undefined;
  limit?: number;
}

export const getRegionHubsWithoutPagination = async (regionId: string) => {
  const res = await authInstance.get(
    `/v2/location/admin/regions/${regionId}/hubs`,
    {
      shape: withPagination({ regionHubs: RegionHubSchema.array() }),
    },
  );
  return res.regionHubs;
};

export const useGetRegionHubsWithoutPagination = ({
  regionId,
  enabled,
}: {
  regionId: string;
  enabled?: boolean;
}) => {
  return useQuery({
    queryKey: ['regionHub'],
    queryFn: () => getRegionHubsWithoutPagination(regionId),
    enabled,
  });
};

export const getRegionHubs = async (
  options?: GetRegionHubsOptionsWithPagination,
) => {
  let url = '';
  if (options?.regionId) {
    url = `/v2/location/admin/regions/${options.regionId}/hubs`;
  } else {
    url = `/v2/location/admin/regions/all/hubs`;
  }

  const res = await authInstance.get(
    url + toSearchParamString({ ...options }, '?'),
    {
      shape: withPagination({ regionHubs: RegionHubSchema.array() }),
    },
  );
  return res;
};

export const useGetRegionHubs = ({
  options,
  enabled,
}: {
  options?: GetRegionHubsOptionsWithPagination;
  enabled?: boolean;
}) => {
  return useInfiniteQuery({
    queryKey: ['regionHub', options],
    queryFn: ({ pageParam }: { pageParam: string | undefined }) =>
      getRegionHubs({ ...options, page: pageParam }),
    initialPageParam: undefined,
    initialData: { pages: [], pageParams: [] },
    getNextPageParam: (lastPage) => {
      return lastPage.nextPage;
    },
    placeholderData: keepPreviousData,
    enabled,
  });
};

export const getRegionHub = async (regionId: string, regionHubId: string) => {
  const res = await authInstance.get(
    `/v2/location/admin/regions/${regionId}/hubs/${regionHubId}`,
    { shape: { regionHub: RegionHubSchema } },
  );
  return res.regionHub;
};

export const useGetRegionHub = (regionId: string, regionHubId: string) => {
  return useQuery({
    queryKey: ['regionHub', regionId, regionHubId],
    queryFn: () => getRegionHub(regionId, regionHubId),
  });
};

// ----- POST -----

export const postRegionHub = async (
  regionId: string,
  body: CreateHubRequest,
) => {
  return await authInstance.post(
    `/v1/location/admin/regions/${regionId}/hubs`,
    silentParse(CreateHubRequestSchema, body),
    {
      shape: {
        regionHubId: z.string(),
      },
    },
  );
};

export const usePostRegionHub = ({
  onSuccess,
  onError,
}: {
  onSuccess?: () => void;
  onError?: (error: unknown) => void;
} = {}) => {
  return useMutation({
    mutationFn: ({
      regionId,
      body,
    }: {
      regionId: string;
      body: CreateHubRequest;
    }) => postRegionHub(regionId, body),
    onSuccess,
    onError,
  });
};

type PutRegionHubBody = Partial<CreateHubRequest & { regionId: string }>;

export const putRegionHub = async (
  regionId: string,
  regionHubId: string,
  body: PutRegionHubBody,
) => {
  return await authInstance.put(
    `/v1/location/admin/regions/${regionId}/hubs/${regionHubId}`,
    body,
    {
      shape: {
        regionHubId: z.string(),
      },
    },
  );
};

export const usePutRegionHub = ({
  onSuccess,
  onError,
}: {
  onSuccess?: () => void;
  onError?: (error: unknown) => void;
} = {}) => {
  return useMutation({
    mutationFn: ({
      regionId,
      regionHubId,
      body,
    }: {
      regionId: string;
      regionHubId: string;
      body: PutRegionHubBody;
    }) => putRegionHub(regionId, regionHubId, body),
    onSuccess,
    onError,
  });
};
