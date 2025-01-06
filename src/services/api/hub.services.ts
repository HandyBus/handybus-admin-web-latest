'use client';

import {
  type CreateHubRequestType,
  HubListSchema,
} from '@/types/v1/regionHub.type';
import { authInstance } from '../config';

export const getHubs = async (regionId: number) => {
  const { regionHubs } = await authInstance.get<{ regionHubs: unknown }>(
    `/v1/location/admin/regions/${regionId}/hubs`,
  );
  return HubListSchema.parse(regionHubs);
};

export const addHub = async (regionId: number, input: CreateHubRequestType) => {
  return await authInstance.post(
    `/v1/location/admin/regions/${regionId}/hubs`,
    input,
  );
};
