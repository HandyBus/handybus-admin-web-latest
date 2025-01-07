'use client';

import {
  CreateHubRequestSchema,
  type CreateHubRequestType,
  HubListSchema,
} from '@/types/v1/regionHub.type';
import { authInstance } from '../config';
import { silentParse } from '@/utils/parse.util';

export const getHubs = async (regionId: number) => {
  const { regionHubs } = await authInstance.get<{ regionHubs: unknown }>(
    `/v1/location/admin/regions/${regionId}/hubs`,
  );
  return silentParse(HubListSchema, regionHubs);
};

export const addHub = async (regionId: number, input: CreateHubRequestType) => {
  return await authInstance.post(
    `/v1/location/admin/regions/${regionId}/hubs`,
    silentParse(CreateHubRequestSchema, input),
  );
};
