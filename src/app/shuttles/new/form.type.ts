import { CreateShuttleRequestType } from '@/types/shuttle.type';
import { z } from 'zod';

export const CreateShuttleFormSchema = z.object({
  name: z.string(),
  regionID: z.number().int(),
  regionHubID: z.number().int(),
  dailyShuttles: z.array(z.object({ date: z.coerce.date() })),
  type: z.enum(['CONCERT']),
  detail: z.object({
    image: z.string().url(),
    name: z.string(),
    // to work with react-hook-form
    artistIDs: z.array(z.object({ id: z.number().int() })),
  }),
});

export type CreateShuttleFormType = z.infer<typeof CreateShuttleFormSchema>;

export const conform = (
  data: CreateShuttleFormType,
): CreateShuttleRequestType => {
  const { detail, ...rest } = data;
  if (data.type === 'CONCERT') {
    return {
      ...rest,
      regionID: Number(rest.regionID),
      regionHubID: Number(rest.regionHubID),
      type: 'CONCERT' as const,
      concert: {
        ...detail,
        concertArtistIDs: detail.artistIDs.map((a) => a.id),
      },
    } satisfies CreateShuttleRequestType;
  } else {
    return {
      ...rest,
      regionID: Number(rest.regionID),
      regionHubID: Number(rest.regionHubID),
      type: 'FESTIVAL' as const,
      festival: {
        ...detail,
        festivalArtistIDs: detail.artistIDs.map((a) => a.id),
      },
    } satisfies CreateShuttleRequestType;
  }
};
