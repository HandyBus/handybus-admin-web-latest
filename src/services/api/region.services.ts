'use client';

import { RegionSchema } from '@/types/region.type';
import regions from '../../data/regions.json';

export const getRegions = async () => {
  return RegionSchema.array().parse(regions.regions);
};
