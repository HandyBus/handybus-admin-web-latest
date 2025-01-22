import { z } from 'zod';

export const RegionSchema = z.object({
  regionId: z.number().int(),
  provinceFullName: z.string(),
  provinceShortName: z.string(),
  cityFullName: z.string(),
  cityShortName: z.string(),
  relatedRegionIds: z.array(z.number().int()),
  createdAt: z.string(),
  updatedAt: z.string(),
});
export type Region = z.infer<typeof RegionSchema>;
