'use server';

import { instance } from '@/services/config';
import { type CreateHubRequestType, HubListSchema } from '@/types/hub.type';

export const getHubs = async (regionID: number) => {
  const { regionHubs } = (
    await instance.get(`/location/admin/regions/${regionID}/hubs`)
  ).data;
  return HubListSchema.parse(regionHubs);
};

export const addHub = async (regionID: number, input: CreateHubRequestType) => {
  return await instance.post(`/location/admin/regions/${regionID}/hubs`, input);
};
