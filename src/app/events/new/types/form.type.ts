import { CreateShuttleRequestType } from '@/types/v1/shuttle.type';
import { z } from 'zod';

export const CreateShuttleFormSchema = z.object({
  name: z.string(),
  regionId: z.number().int(),
  regionHubId: z.number().int(),
  dailyShuttles: z.array(z.object({ date: z.date() })),
  type: z.enum(['CONCERT']),
  detail: z.object({
    image: z.string().url(),
    name: z.string(),
    // to work with react-hook-form
    artistIds: z.array(z.object({ artistId: z.number().int() })),
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
      regionId: Number(rest.regionId),
      regionHubId: Number(rest.regionHubId),
      type: 'CONCERT' as const,
      concert: {
        ...detail,
        concertArtistIds: detail.artistIds.map((a) => a.artistId),
      },
    } satisfies CreateShuttleRequestType;
  } else {
    return {
      ...rest,
      regionId: Number(rest.regionId),
      regionHubId: Number(rest.regionHubId),
      type: 'FESTIVAL' as const,
      festival: {
        ...detail,
        festivalArtistIds: detail.artistIds.map((a) => a.artistId),
      },
    } satisfies CreateShuttleRequestType;
  }
};
