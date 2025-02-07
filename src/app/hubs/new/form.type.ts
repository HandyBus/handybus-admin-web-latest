import { CreateHubRequest } from '@/types/hub.type';
import { z } from 'zod';

export const CreateHubFormSchema = z.object({
  regionId: z.string(),
  name: z.string(),
  coord: z.object({
    address: z.string(),
    latitude: z.number(),
    longitude: z.number(),
  }),
});

export type CreateHubFormType = z.infer<typeof CreateHubFormSchema>;

export const conform = (data: CreateHubFormType): CreateHubRequest => {
  const { coord, name } = data;
  return {
    name,
    ...coord,
  } satisfies CreateHubRequest;
};
