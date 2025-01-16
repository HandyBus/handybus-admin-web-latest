'use client';

import { RegionSchema } from '@/types/v1/region.type';
import regions from '../../data/regions.json';
import { silentParse } from '@/utils/parse.util';

// not a real API call
export const getRegions = () => {
  return silentParse(RegionSchema.array(), regions.regions);
};
