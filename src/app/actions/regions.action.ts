'use server';

import { REGIONS_PATH } from '@/constants/files';
import { RegionListSchema } from '@/types/region.type';
import fs from 'fs';

export const getRegions = async () => {
  return RegionListSchema.parse(
    JSON.parse(
      await new Promise<string>((resolve, reject) => {
        fs.readFile(REGIONS_PATH, (err, data) => {
          if (err) reject(err);
          resolve(data.toString('utf-8'));
        });
      }),
    ).regions,
  );
};
