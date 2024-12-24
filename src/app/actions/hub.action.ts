'use server';

import { instance } from '@/services/config';
import { type CreateHubRequestType, HubListSchema } from '@/types/hub.type';

export const getHubs = async (regionId: number) => {
  const { regionHubs } = (
    await instance.get(`/location/admin/regions/${regionId}/hubs`)
  ).data;
  return HubListSchema.parse(regionHubs);
};

export const addHub = async (regionId: number, input: CreateHubRequestType) => {
  return await instance.post(`/location/admin/regions/${regionId}/hubs`, input);
};
