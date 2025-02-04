'use client';

import {
  CreateHubRequest,
  CreateHubRequestSchema,
  RegionHubSchema,
} from '@/types/hub.type';
import { authInstance } from './config';
import { silentParse } from '@/utils/parse.util';
import { useMutation, useQuery } from '@tanstack/react-query';
import regions from '../data/regions.json';
import { RegionSchema } from '@/types/region';

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

export const getRegionHubs = async (regionId: string) => {
  const res = await authInstance.get(
    `/v1/location/admin/regions/${regionId}/hubs`,
    { shape: { regionHubs: RegionHubSchema.array() } },
  );
  return res.regionHubs;
};

export const useGetRegionHubs = (regionId: string) => {
  return useQuery({
    queryKey: ['regionHub', regionId],
    queryFn: () => getRegionHubs(regionId),
    enabled: !!regionId,
  });
};

// // TODO 추후 주석 해제. v2 버전임.
// export const getRegionHubs = async (regionId: string) => {
//   const res = await authInstance.get(
//     `/v1/location/admin/regions/${regionId}/hubs`,
//     { shape: withPagination({ regionHubs: RegionHubSchema.array() }) },
//   );
//   return res.regionHubs;
// };

export const getRegionHub = async (regionId: string, regionHubId: string) => {
  const res = await authInstance.get(
    `/v1/location/admin/regions/${regionId}/hubs/${regionHubId}`,
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

export const deleteRegionHub = async (
  regionId: string,
  regionHubId: string,
) => {
  return await authInstance.delete(
    `/v1/location/admin/regions/${regionId}/hubs/${regionHubId}`,
  );
};

export const useDeleteRegionHub = () => {
  return useMutation({
    mutationFn: ({
      regionId,
      regionHubId,
    }: {
      regionId: string;
      regionHubId: string;
    }) => deleteRegionHub(regionId, regionHubId),
  });
};

export const deleteRegionHubs = async (
  regionId: string,
  body: { regionHubIds: string[] },
) => {
  return await authInstance.delete(
    `/v1/location/admin/regions/${regionId}/hubs`,
    body,
  );
};
