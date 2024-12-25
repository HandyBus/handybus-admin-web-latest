import { CreateHubRequestType } from '@/types/hub.type';
import { z } from 'zod';

export const CreateHubFormSchema = z.object({
  regionId: z.number().int(),
  name: z.string(),
  coord: z.object({
    address: z.string(),
    latitude: z.number(),
    longitude: z.number(),
  }),
});

export type CreateHubFormType = z.infer<typeof CreateHubFormSchema>;

export const conform = (data: CreateHubFormType): CreateHubRequestType => {
  const { coord, name } = data;
  return {
    name,
    ...coord,
  } satisfies CreateHubRequestType;
};
