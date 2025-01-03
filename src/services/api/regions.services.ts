'use server';

import { instance } from '@/services/config';
import { RegionListSchema } from '@/types/region.type';

export const getRegions = async () => {
  const { regions } = (await instance.get('/location/admin/regions')).data;
  return RegionListSchema.parse(regions);
};
