import { z } from 'zod';

export const RegionSchema = z.object({
  regionId: z.string(),
  provinceFullName: z.string(),
  provinceShortName: z.string(),
  cityFullName: z.string(),
  cityShortName: z.string(),
  relatedRegionIds: z.string().array(),
});
export type Region = z.infer<typeof RegionSchema>;
