'use client';

import {
  type CreateHubRequestType,
  HubListSchema,
} from '@/types/regionHub.type';
import { authInstance } from '../config';

export const getHubs = async (regionId: number) => {
  const { regionHubs } = await authInstance.get<{ regionHubs: unknown }>(
    `/location/admin/regions/${regionId}/hubs`,
  );
  return HubListSchema.parse(regionHubs);
};

export const addHub = async (regionId: number, input: CreateHubRequestType) => {
  return await authInstance.post(
    `/location/admin/regions/${regionId}/hubs`,
    input,
  );
};
