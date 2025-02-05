'use client';

import {
  CreateHubRequest,
  CreateHubRequestSchema,
  RegionHubSchema,
} from '@/types/hub.type';
import { authInstance, withPagination } from './config';
import { silentParse } from '@/utils/parse.util';
import {
  keepPreviousData,
  useInfiniteQuery,
  useMutation,
  useQuery,
} from '@tanstack/react-query';
import regions from '../data/regions.json';
import { RegionSchema } from '@/types/region';
import { toSearchParamString } from '@/utils/searchParam.util';

// ----- 조회 -----

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
  orderBy?: 'name' | 'address' | 'latitude' | 'longitude';
  order?: 'ASC' | 'DESC';
}

export interface GetRegionHubsOptionsWithPagination
  extends GetRegionHubsOptions {
  page: string | undefined;
  limit?: number;
}

export const getRegionHubs = async (options?: GetRegionHubsOptions) => {
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

export const useGetRegionHubs = (
  options?: GetRegionHubsOptionsWithPagination,
) => {
  return useInfiniteQuery({
    queryKey: ['regionHub', options],
    queryFn: () => getRegionHubs(options),
    initialPageParam: undefined,
    initialData: { pages: [], pageParams: [] },
    getNextPageParam: (lastPage) => {
      return lastPage.nextPage;
    },
    placeholderData: keepPreviousData,
  });
};

export const getRegionHubsOfRegion = async (regionId: string) => {
  const res = await authInstance.get(
    `/v2/location/admin/regions/${regionId}/hubs`,
    { shape: { regionHubs: RegionHubSchema.array() } },
  );
  return res.regionHubs;
};

export const useGetRegionHubsOfRegion = (regionId: string) => {
  return useQuery({
    queryKey: ['regionHub', 'region', regionId],
    queryFn: () => getRegionHubsOfRegion(regionId),
    enabled: !!regionId,
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

// ----- 명령 -----

export const postRegionHub = async (
  regionId: string,
  body: CreateHubRequest,
) => {
  return await authInstance.post(
    `/v1/location/admin/regions/${regionId}/hubs`,
    silentParse(CreateHubRequestSchema, body),
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
  );
};

export const usePutRegionHub = () => {
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
  });
};
