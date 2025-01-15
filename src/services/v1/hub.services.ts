'use client';

import {
  CreateHubRequestSchema,
  type CreateHubRequestType,
  RegionHubSchema,
} from '@/types/v1/regionHub.type';
import { authInstance } from '../config';
import { silentParse } from '@/utils/parse.util';

// TODO : v2 api (location) 가 준비되면 migrate
export const getHubs = async (regionId: number) => {
  const response = await authInstance.get(
    `/v1/location/admin/regions/${regionId}/hubs`,
    { shape: { regionHubs: RegionHubSchema.array() } },
  );
  return response.regionHubs;
};

// TODO : v2 api (location) 가 준비되면 migrate
export const getHub = async (regionId: number, regionHubId: number) => {
  const response = await authInstance.get(
    `/v1/location/admin/regions/${regionId}/hubs/${regionHubId}`,
    { shape: { regionHub: RegionHubSchema } },
  );
  return response.regionHub;
};

// TODO : v2 api (location) 가 준비되면 migrate
export const addHub = async (regionId: number, input: CreateHubRequestType) => {
  return await authInstance.post(
    `/v1/location/admin/regions/${regionId}/hubs`,
    silentParse(CreateHubRequestSchema, input),
  );
};
