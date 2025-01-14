'use client';

import {
  CreateHubRequestSchema,
  type CreateHubRequestType,
  RegionHubSchema,
} from '@/types/v1/regionHub.type';
import { authInstance } from '../config';
import { silentParse } from '@/utils/parse.util';

export const getHubs = async (regionId: number) => {
  const response = await authInstance.get(
    `/v1/location/admin/regions/${regionId}/hubs`,
    { shape: { regionHubs: RegionHubSchema.array() } },
  );
  return response.regionHubs;
};

export const getHub = async (regionId: number, regionHubId: number) => {
  const response = await authInstance.get(
    `/v1/location/admin/regions/${regionId}/hubs/${regionHubId}`,
    { shape: { regionHub: RegionHubSchema } },
  );
  return response.regionHub;
};

export const addHub = async (regionId: number, input: CreateHubRequestType) => {
  return await authInstance.post(
    `/v1/location/admin/regions/${regionId}/hubs`,
    silentParse(CreateHubRequestSchema, input),
  );
};
