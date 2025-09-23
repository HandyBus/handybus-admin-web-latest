import { AdminUpdateRegionHubRequest } from '@/types/hub.type';
import { z } from 'zod';

export const EditHubFormSchema = z.object({
  regionId: z.string(),
  name: z.string(),
  coord: z.object({
    address: z.string(),
    latitude: z.number(),
    longitude: z.number(),
    roadViewPan: z.number().nullable(),
  }),
});

export type EditHubFormType = z.infer<typeof EditHubFormSchema>;

export const conform = (data: EditHubFormType): AdminUpdateRegionHubRequest => {
  const { coord, name, regionId } = data;
  return {
    name,
    ...coord,
    regionId,
  } satisfies AdminUpdateRegionHubRequest;
};
