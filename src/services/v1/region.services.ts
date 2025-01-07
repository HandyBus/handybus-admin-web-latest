'use client';

import { RegionSchema } from '@/types/v1/region.type';
import regions from '../../data/regions.json';
import { silentParse } from '@/utils/parse.util';

export const getRegions = async () => {
  return silentParse(RegionSchema.array(), regions.regions);
};
